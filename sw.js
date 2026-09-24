// Service Worker fuer MangaLounge.
// Cached die App-Huelle beim ersten Besuch, damit die Seite danach
// auch komplett offline (Flugmodus) vom Home-Bildschirm startet.
//
// WICHTIG: Wenn du index.html spaeter aenderst/aktualisierst, erhoehe
// die Versionsnummer unten (v1 -> v2 usw.), sonst liefert der Service
// Worker weiter die alte, zwischengespeicherte Version aus.
var CACHE_NAME = "mangalounge-cache-v19";
var APP_SHELL = [
  "./",
  "./index.html",
  "./config.js",
  "./manifest.json",
  "./icon-180.png",
  "./icon-512.png",
  "./favicon-32.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(APP_SHELL); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE_NAME; }).map(function (k) { return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  var url = new URL(event.request.url);
  // Cross-Origin-Requests (z. B. Google Fonts, AniList-Suche) unangetastet
  // durchreichen -- die App faellt dafuer offline einfach auf System-
  // schriften zurueck, funktioniert aber weiter.
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(event.request).then(function (response) {
      if (response && response.status === 200) {
        var copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(event.request, copy); });
      }
      return response;
    }).catch(function () { return caches.match(event.request); })
  );
});
