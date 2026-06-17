const CACHE_NAME = "mahjong4p-score-v1350";
const ASSETS = [
  "./",
  "./index.html",
  "./mahjong4p_score-V03_20260612-1350_model_change_pwa.html",
  "./manifest.webmanifest",
  "./mahjong4p_score.jpg",
  "./mahjong4p_score_192.jpg",
  "./mahjong4p_score_512.jpg"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, copy);
        });
        return response;
      }).catch(function() {
        return caches.match("./index.html");
      });
    })
  );
});
