// Remplace le service worker de l'ancienne version web du jeu (export Godot avec PWA).
// Il gardait une copie du jeu dans le navigateur des visiteurs : celui-ci la supprime,
// se désinstalle, puis recharge la page pour afficher le site de téléchargement.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys())
      await caches.delete(key);
    await self.registration.unregister();
    for (const client of await self.clients.matchAll({ type: "window" }))
      client.navigate(client.url);
  })());
});
