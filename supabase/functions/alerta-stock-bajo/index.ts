import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

webpush.setVapidDetails(
  'mailto:maturana.or.adrian@gmail.com',
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!
)

// Ventana mínima entre avisos para un producto que sigue bajo el mínimo
const COOLDOWN_MS = 60 * 60 * 1000 // 1 hora

serve(async (req) => {
  const payload = await req.json()
  const record = payload.record // el producto actualizado
  const oldRecord = payload.old_record // estado previo (solo en UPDATE)

  // Evita recursión: si el único cambio fue nuestro propio timestamp, salir.
  if (
    oldRecord &&
    oldRecord.stock_actual === record.stock_actual &&
    oldRecord.stock_minimo === record.stock_minimo
  ) {
    return new Response(JSON.stringify({ ok: true, skipped: 'solo timestamp' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Correo solo cuando el producto llega a 0
  const ceroAntes = oldRecord ? oldRecord.stock_actual === 0 : false
  if (record.stock_actual === 0 && !ceroAntes) {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Inventario <onboarding@resend.dev>', // cambia esto cuando tengas dominio propio
        to: ['maturana.or.adrian@gmail.com'], // el correo del admin
        subject: `⚠ Stock 0: ${record.nombre}`,
        html: `
          <h2>Aviso de stock 0</h2>
          <p><strong>${record.nombre}</strong> tiene stock actual de <strong>${record.stock_actual}</strong>, 
           debajo del mínimo (${record.stock_minimo}).</p>
          <p>Por favor reabastecer pronto.</p>
        `,
      }),
    })

    const data = await res.json()
    console.log('Resultado envío:', data)
  }

  // Push: solo si está bajo el mínimo y pasó al menos 1 hora desde el último aviso.
  // La reserva atómica garantiza un único envío por ventana aunque lleguen
  // varias invocaciones concurrentes (clics rápidos en -/+).
  const bajoAhora = record.stock_actual <= record.stock_minimo

  if (bajoAhora) {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const cutoff = new Date(Date.now() - COOLDOWN_MS).toISOString()
    const { data: claimed, error: claimError } = await supabaseAdmin
      .from('productos')
      .update({ ultima_alerta_stock: new Date().toISOString() })
      .eq('id', record.id)
      .lt('ultima_alerta_stock', cutoff)
      .select('id')

    if (claimError) console.error('Error reservando alerta:', claimError)

    if (claimed && claimed.length > 0) {
      const { data: subs } = await supabaseAdmin
        .from('push_subscriptions')
        .select('*')

      const mensaje = JSON.stringify({
        title: `⚠ Stock bajo: ${record.nombre}`,
        body: `Quedan ${record.stock_actual} (mínimo: ${record.stock_minimo})`,
      })

      for (const sub of subs ?? []) {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            mensaje
          )
        } catch (err) {
          console.error('Error enviando push a', sub.endpoint, err)
        }
      }
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
