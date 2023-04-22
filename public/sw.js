const staticCacheName = 'ststic-site-v4'
const dinamicCacheName = 'dinamic-site-v4'

const ASSETS = ['/', '/index.html', 'offline.html', '/assets/index-e6689b31.css', '/assets/index-af037430.js']

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
self.addEventListener('fetch', (event) => {
  event.respondWith(cacheFirst(event.request))
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
    await cache.put(request.url, response.clone())
    return response
  } catch (error) {
    const cached = await cache.match(request)
    return cached ?? (await caches.match('/offline.html'))
  }
}
