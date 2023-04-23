const staticCacheName = 'ststic-site-v12'
const dynamicCacheName = 'dinamic-site-v12'

const firebaseKey = 'AIzaSyAEaOGPrYjbM0k'
const ASSETS = [
  "/",
  "/index.html",
  "/vite.svg",
  "/index-aa64aa25.js",
  "/index-7152b513.css",
  "/vendor-63ddff08.js"
];


self.addEventListener('install', async (event) => {
  console.log(event)
  const cache = await caches.open(staticCacheName)
  await cache.addAll(ASSETS)

})

// activate //---
self.addEventListener('activate', async (event) => {
  const cachesKeysArr = await caches.keys()
  await Promise.all(
    cachesKeysArr.filter((key) => key !== staticCacheName && key !== dynamicCacheName).map((key) => caches.delete(key)),
  )
})


self.addEventListener('fetch', function (event) {
  // console.log(event.request.url)
  const url = new URL(event.request.url);

  // Если URL-адрес содержит путь к динамическим файлам сгенерированным Vite
  if (url.pathname.includes('/assets/')) {
    // Используем стратегию кэширования "cache first" для файлов JavaScript
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          // Клонируем ответ, чтобы сохранить его в кэше и вернуть оригинал
          const responseClone = response.clone();
          caches.open(staticCacheName).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
    );
  } else {
    event.respondWith(fetch(event.request).then(function (response) {
      if (!(event.request.url.includes('chrome-extension') ||
        event.request.url.includes('firebasestorage') ||
        event.request.url.includes('localhost') ||
        event.request.url.includes(firebaseKey))) {
        cacheFirst(response)
      }
      return response;
    }).catch(function (error) {
      console.log('Fetch failed:', error);
    }))
  }


  // event.respondWith(
  //   fetch(event.request).then(function (response) {
  //     // Ваша логика обработки ответа
  //     if (!(event.request.url.includes('chrome-extension') ||
  //       event.request.url.includes('firebasestorage') ||
  //       event.request.url.includes('localhost') ||
  //       event.request.url.includes(firebaseKey))) {
  //       cacheFirst(response)
  //     }
  //     return response;
  //   }).catch(function (error) {
  //     // Ваша логика обработки ошибки
  //     console.log('Fetch failed:', error);
  //   })
  // );
});

// //fetch
// self.addEventListener('fetch', async (event) => {
//   console.log(event.request.url)
//   if (!event.request.url.includes(firebaseKey)) {
//     if (!event.request.url.includes('chrome-extension')) {
//       if (!event.request.url.includes('firebasestorage')) {
//         await event.respondWith(cacheFirst(event.request))
//       }
//     }
//   }
// })

async function cacheFirst(request) {
  const cached = await caches.match(request)
  try {
    return (
      cached ??
      (await fetch(request).then((response) => {
        return networkFirst(request)
      }))
    )
  } catch (error) {
    return networkFirst(request)
  }
}

async function networkFirst(request) {
  const cache = await caches.open(dynamicCacheName)
  try {
    const response = await fetch(request)

    await cache.put(request, response.clone())

    return response
  } catch (error) {
    const cached = await cache.match(request)
    return cached
  }
}
