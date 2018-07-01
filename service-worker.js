var myCache = 'kafConverter';
var cacheAssets = ['/','index.html','images/','css/bootstrap.min.css','css/kaforad-converter.css','kaforad-converter.js'];//,'/scripts/',''/images','/images/','/css/',];
//dat cache
var currencyData='kafConverterData';
//installing service worker
self.addEventListener('install', function(e) {
  console.log('Installed- servicewoker');
  //since  i won't be changing my service worker , i do not need skip waiting but, 
  //I can always uncomment the below if I will be installing another service worker that need immediate update
  //self.skipWaiting();
  e.waitUntil(
    caches.open(myCache).then(function(cache) {
      console.log('my files been cached');
      console.log('myCache in install  '+myCache)
      // add all files to be cache to the cache
      console.log(cacheAssets);
      return cache.addAll(cacheAssets);
    })
  );
});

//activate 
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
  	//console.log('myCache in activate  '+ myCache);
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== myCache) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

//updating http response into my cache
self.addEventListener('fetch', function(event) {
  console.log('[ServiceWorker] Fetch', event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)      
      	.then(function(networkRespose){//handles when request is not already in the catch - clone returned response from the network
      		return caches.open('myCache').then(function(cache){
      			cache.put(event.request,networkRespose.clone());
      			return networkRespose;

      		});
      	
      	});
    }).catch(function(error){
    	// return caches.match('');
    	console.log('Cache'+error);
    })
  );
});