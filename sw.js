// Service worker: guarda la app en el teléfono para que abra sin conexión.
var CACHE='cdlp-app-v1';
var SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); }).then(function(){ return self.skipWaiting(); })); });
self.addEventListener('activate',function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); })); }).then(function(){ return self.clients.claim(); })); });
self.addEventListener('fetch',function(e){
  var req=e.request, url=new URL(req.url);
  if(req.method!=='GET' || url.origin!==self.location.origin) return; // la sincronización con Google va directo a la red
  // Primero la red (para recibir actualizaciones); si no hay conexión, la copia guardada.
  e.respondWith(fetch(req).then(function(res){ var cp=res.clone(); caches.open(CACHE).then(function(c){ c.put(req.mode==='navigate'?'./index.html':req, cp); }); return res; })
    .catch(function(){ return caches.match(req.mode==='navigate'?'./index.html':req, {ignoreSearch:true}).then(function(m){ return m || caches.match('./index.html'); }); }));
});
