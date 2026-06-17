const CACHE_NAME = "mahjong4p-score-20260612-1366";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./mahjong4p_score.jpg",
  "./mahjong4p_score_192.jpg",
  "./mahjong4p_score_512.jpg"
];
self.addEventListener("install", function(event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache) { return cache.addAll(ASSETS); }));
  self.skipWaiting();
});
self.addEventListener("activate", function(event) {
  event.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.map(function(key) { if (key !== CACHE_NAME) return caches.delete(key); }));
  }));
  self.clients.claim();
});
self.addEventListener("fetch", function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    return response || fetch(event.request).catch(function() { return caches.match("./index.html"); });
  }));
});
