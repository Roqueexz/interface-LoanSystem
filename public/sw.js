self.addEventListener('push', event => {
  let dados = {};
  try { dados = event.data?.json() || {}; } catch { /* usa mensagem padrão */ }
  event.waitUntil(self.registration.showNotification(dados.title || 'LoanSystem', { body: dados.body || 'Confira seus recebimentos.', icon: '/icon-192.png', data: { url: '/calendario' }, tag: 'recebimentos' }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(new URL(event.notification.data?.url || '/calendario', self.location.origin).href));
});
