const PREFIX='marichka-kitty-'+new URL(self.registration.scope).pathname+'-';
const CACHE=PREFIX+'v2';
const CORE=['index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'].map(p=>new URL(p,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(CORE);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url),base=new URL(self.registration.scope);
 if(request.method!=='GET'||url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
 if(request.mode==='navigate'){
  event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(request);if(response.ok)await cache.put(CORE[0],response.clone());return response;}catch(_){const saved=await cache.match(CORE[0]);return saved||Response.error();}})());
 }else if(CORE.includes(url.href))event.respondWith((async()=>{const cache=await caches.open(CACHE);return (await cache.match(request))||fetch(request);})());
});
