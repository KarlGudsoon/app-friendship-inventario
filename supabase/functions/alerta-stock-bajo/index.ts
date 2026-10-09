import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

webpush.setVapidDetails(
  'mailto:maturana.or.adrian@gmail.com',
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!
)

// Ventana de recordatorio para un producto que sigue bajo el mínimo
const COOLDOWN_MS = 24 * 60 * 60 * 1000 // 24 horas

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

  const bajoAhora = record.stock_actual <= record.stock_minimo
  const bajoAntes = oldRecord
    ? oldRecord.stock_actual <= oldRecord.stock_minimo
    : false

  const cruzoBajo = bajoAhora && !bajoAntes
  const cooldownOk =
    !record.ultima_alerta_stock ||
    Date.now() - new Date(record.ultima_alerta_stock).getTime() > COOLDOWN_MS

  // Híbrido: avisa al cruzar el mínimo y reaparece como máximo cada 24 h
  const debeAvisar = bajoAhora && (cruzoBajo || cooldownOk)

  const ceroAhora = record.stock_actual === 0
  const ceroAntes = oldRecord ? oldRecord.stock_actual === 0 : false
  const debeEnviarCorreo = ceroAhora && (!ceroAntes || cooldownOk)

  if (!debeAvisar && !debeEnviarCorreo) {
    return new Response(JSON.stringify({ ok: true, skipped: 'sin alerta' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (debeEnviarCorreo) {
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

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  if (debeAvisar) {
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

  // Marca la última alerta para aplicar el cooldown de 24 h
  const { error } = await supabaseAdmin
    .from('productos')
    .update({ ultima_alerta_stock: new Date().toISOString() })
    .eq('id', record.id)

  if (error) console.error('Error actualizando ultima_alerta_stock:', error)

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
