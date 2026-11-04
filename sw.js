// Lennart Land – offline-hjælper. Hent altid nyeste version, når der er net; brug gemt kopi uden net.
const CACHE='lennart-land-v2';
const FILES=[
  './billede-boblejagt.webp',
  './billede-dansegulvet.webp',
  './billede-guldgraveren.webp',
  './billede-kabum.webp',
  './billede-kamelflyv.webp',
  './billede-kamelloeb.webp',
  './billede-oerkenhop.webp',
  './billede-roedtlys.webp',
  './ikon-192.png',
  './ikon-512.png',
  './ikon-64.png',
  './ikon-apple.png',
  './ikon-maskable.png',
  './','./index.html',
  './lennart.webp',
  './manifest.webmanifest',
  './spil-boblejagt.html',
  './spil-dansegulvet.html',
  './spil-guldgraveren.html',
  './spil-kabum.html',
  './spil-kamelflyv.html',
  './spil-kamelloeb.html',
  './spil-oerkenhop.html',
  './spil-roedtlys.html'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(FILES.map(f=>c.add(new Request(f,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE&&k.startsWith('lennart-land')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  // Skrifttyper fra Google: gem første gang, brug derefter den gemte
  if(u.hostname.endsWith('googleapis.com')||u.hostname.endsWith('gstatic.com')||u.hostname==='cdnjs.cloudflare.com'){
    e.respondWith(caches.open(CACHE).then(c=>c.match(r).then(hit=>hit||fetch(r).then(res=>{c.put(r,res.clone());return res;}))));return;}
  if(u.origin!==location.origin)return;
  // Egne filer: prøv nettet først (så opdateringer kommer med det samme), ellers gemt kopi
  e.respondWith((async()=>{const c=await caches.open(CACHE);
    try{const res=await Promise.race([fetch(r,{cache:'no-cache'}),new Promise((_,no)=>setTimeout(()=>no(0),4000))]);if(res.ok)c.put(r,res.clone());return res;}
    catch(_){const hit=await c.match(r,{ignoreSearch:true});if(hit)return hit;if(r.mode==='navigate'){const i=await c.match('./index.html');if(i)return i;}return fetch(r);}})());
});
