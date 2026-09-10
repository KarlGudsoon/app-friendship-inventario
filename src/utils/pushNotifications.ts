import { supabase } from './supabaseClient'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}

export async function activarNotificaciones(userId: string) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('Tu navegador no soporta notificaciones push')
    return
  }

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    alert('Permiso de notificaciones denegado')
    return
  }

  const registration = await navigator.serviceWorker.ready

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      import.meta.env.VITE_VAPID_PUBLIC_KEY
    ),
  })

  const subJson = subscription.toJSON()

  const { error } = await supabase.from('push_subscriptions').insert({
    user_id: userId,
    endpoint: subJson.endpoint,
    p256dh: subJson.keys?.p256dh,
    auth: subJson.keys?.auth,
  })

  if (error) console.error('Error guardando suscripción:', error)
  else alert('Notificaciones activadas ✅')
}