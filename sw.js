// const staticCashName = 'ststic-site-v2'
// const dinamicCashName = 'dinamic-site-v2'

// const ASSETS = [
//   '/',
//   '/index.html',
//   '/css/styles.css',
//   '/css/materialize.min.css',
//   '/js/app.js',
//   '/js/ui.js',
//   '/js/materialize.min.js',
//   '/offline.html',
//   'https://fonts.googleapis.com/icon?family=Material+Icons',
//   'https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
// ]

self.addEventListener('install', async (event) => {
  // const cache = await caches.open(staticCashName)
  // await cache.addAll(ASSETS)
  console.log('sw install')
})

// activate
self.addEventListener('activate', async (event) => {
  // const cachesKeyArr = await caches.keys()
  // await Promise.all(
  //   cachesKeyArr.filter((key) => key !== staticCashName && key !== dinamicCashName).map((key) => caches.delete(key)),
  // )
  console.log('sw activate')
})

//fetch
self.addEventListener('fetch', (event) => {
  // event.respondWith(cacheFirst(event.request))
  console.log('sw fetch')
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
  const cache = await caches.open(dinamicCashName)
  try {
    const response = await fetch(request)
    await cache.put(request, response.clone())
    return response
  } catch (error) {
    const cached = await cache.match(request)
    return cached ?? caches.match('/offline.html')
  }
}
