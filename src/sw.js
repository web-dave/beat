const cachefiles = ["index.html", "/", "manifest.json"];
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        return caches.open("beat-cache").then((cache) => {
          cache.put(e.request.url, response.clone());
          return response.clone();
        });
      })
      .catch((error) => {
        // In case of Offline we return the cached Data
        return caches.match(e.request).then((response) => {
          return response;
        });
      })
  );
});
self.addEventListener("install", (e) => console.log(e));
self.addEventListener("activate", () => {
  caches
    .open("angular-pwa")
    .then((cache) => cache.addAll(cachefiles))
    .then(() => self.skipWaiting());
});

self.addEventListener("push", (e) => console.log(e));
