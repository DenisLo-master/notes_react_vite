if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((reg) => console.log('Srvice Worker registered', reg))
    .catch((err) => console.log('Srvice Worker not registered', err))
}
