/* Fieldkeep V8 mobile: network-first game, offline solo fallback */
const CACHE='fieldkeep-v8-mobile-1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('fieldkeep-')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',event=>{
 const req=event.request, url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
   event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;}).catch(async()=>await caches.match(req)||await caches.match('./index.html')));return;
 }
 if(url.pathname.endsWith('/manifest.webmanifest')||url.pathname.endsWith('/icon.svg'))event.respondWith(caches.match(req).then(r=>r||fetch(req)));
});