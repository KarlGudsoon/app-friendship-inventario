/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope

import { precacheAndRoute } from 'workbox-precaching'

precacheAndRoute(self.__WB_MANIFEST)

// Escucha cuando llega una notificación push
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}

  const title = data.title || 'Inventario'
  const options = {
    body: data.body || '',
    icon: '/favicon-192x192.png',
    badge: '/favicon-192x192.png',
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Cuando el usuario hace click en la notificación, abre la app
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow('/'))
})