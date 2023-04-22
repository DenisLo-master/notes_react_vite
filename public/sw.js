const staticCacheName = 'ststic-site-v9'
const dinamicCacheName = 'dinamic-site-v9'

const firebaseKey = 'AIzaSyAEaOGPrYjbM0k'

const ASSETS = ['/', '/index.html', 'offline.html']

self.addEventListener('install', async (event) => {
  const cache = await caches.open(staticCacheName)
  await cache.addAll(ASSETS)
})

// activate //---
self.addEventListener('activate', async (event) => {
  const cachesKeysArr = await caches.keys()
  await Promise.all(
    cachesKeysArr.filter((key) => key !== staticCacheName && key !== dinamicCacheName).map((key) => caches.delete(key)),
  )
})

//fetch
self.addEventListener('fetch', async (event) => {
  if (!event.request.url.includes(firebaseKey)) {
    await event.respondWith(cacheFirst(event.request))
  }
})

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
  const cache = await caches.open(dinamicCacheName)
  try {
    const response = await fetch(request)

    await cache.put(request, response.clone())

    return response
  } catch (error) {
    const cached = await cache.match(request)
    return cached
  }
}
