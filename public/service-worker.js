self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
  });

  self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
  });

  self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (url.hostname === 'texlive2.swiftlatex.com') {
      event.respondWith(
        caches.open('texlive-cache').then(cache =>
          cache.match(event.request).then(response =>
            response || fetch(event.request).then(fetchResponse => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            })
          )
        )
      );
    }
  });
