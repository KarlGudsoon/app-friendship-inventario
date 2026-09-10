import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push@3.6.7'

webpush.setVapidDetails(
  'mailto:maturana.or.adrian@gmail.com',
  Deno.env.get('VAPID_PUBLIC_KEY')!,
  Deno.env.get('VAPID_PRIVATE_KEY')!
)

serve(async (req) => {
  const payload = await req.json()
  const record = payload.record // el producto actualizado

  // Solo actuamos si el stock quedó igual o por debajo del mínimo
  if (record.stock_actual <= record.stock_minimo) {
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
        subject: `⚠ Stock bajo: ${record.nombre}`,
        html: `
          <h2>Aviso de stock bajo</h2>
          <p><strong>${record.nombre}</strong> tiene stock actual de <strong>${record.stock_actual}</strong>, 
          igual o por debajo del mínimo (${record.stock_minimo}).</p>
          <p>Por favor reabastecer pronto.</p>
        `,
      }),
    })

    const data = await res.json()
    console.log('Resultado envío:', data)

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

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

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})