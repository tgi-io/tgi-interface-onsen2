/**---------------------------------------------------------------------------------------------------------------------
 * sw.js Service Worker
 */
console.log('eat me');
// 1. Save the files to the user's device
// The "install" event is called when the ServiceWorker starts up.
// All ServiceWorker code must be inside events.
self.addEventListener('install', function(e) {
  console.log('install');

  // waitUntil tells the browser that the install event is not finished until we have
  // cached all of our files
  e.waitUntil(
    // Here we call our cache "myonsenuipwa", but you can name it anything unique
    caches.open('myonsenuipwa').then(cache => {
      // If the request for any of these resources fails, _none_ of the resources will be
      // added to the cache.
      console.log('suck me');



      let ret =  cache.addAll([
        'index.html',
        '/dist/onsenui/css/onsenui.css',
        '/dist/onsenui/css/onsen-css-components.css',
        'prototype.css',
        '/dist/onsenui/js/onsenui.js',
        'prototype.js'
      ]);
      console.log('it is done');
      return ret;
    })
  );
});

// 2. Intercept requests and return the cached version instead
self.addEventListener('fetch', function(e) {
  console.log('fetch THIS');
  e.respondWith(
    // check if this file exists in the cache
    caches.match(e.request)
    // Return the cached file, or else try to get it from the server
      .then(response => response || fetch(e.request))
  );
});


/*
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/onsenui/css/onsenui.min.css">
  <link rel="stylesheet" href="https://unpkg.com/onsenui/css/onsen-css-components.min.css">
  <script src="https://unpkg.com/onsenui/js/onsenui.min.js"></script>

  </head>
  <body>
  <ons-button onclick="alert('You clicked me!')">Click Me</ons-button>
</body>
</html>
*/