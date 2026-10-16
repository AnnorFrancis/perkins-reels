/* One-Tap Post Calendar: works offline after the first open.
   Page, code and post list: network first (fresh when online). Pictures and videos: cache first (their URLs change when they change).
   Paths are resolved against the worker's scope, so the app also works from a subfolder such as a GitHub Pages project site. */
var SHELL = "otpc-shell-eb6ca023", MEDIA = "otpc-media-v1";
var CORE = ["./", "index.html", "app.css?v=eb6ca023", "app.js?v=eb6ca023", "posts.js?v=eb6ca023", "manifest.webmanifest", "icons/icon-192.png"];
var MEDIA_PATH = new URL("m/", self.registration.scope).pathname;
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(SHELL).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== SHELL && k !== MEDIA; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.indexOf(MEDIA_PATH) === 0) {
    if (req.headers.get("range")) return; // let the browser stream video seeks straight from the network
    e.respondWith(caches.open(MEDIA).then(function (c) {
      return c.match(req).then(function (hit) {
        return hit || fetch(req).then(function (res) { if (res.ok && res.status === 200) c.put(req, res.clone()); return res; });
      });
    }));
    return;
  }
  e.respondWith(fetch(req).then(function (res) {
    if (res.ok) { var copy = res.clone(); caches.open(SHELL).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () { return caches.match(req).then(function (hit) { return hit || caches.match("index.html"); }); }));
});
