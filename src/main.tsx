import ReactDOM from 'react-dom/client'
import { App } from './App'
import { MantineProvider } from '@mantine/core'
import React from 'react'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={{ colorScheme: 'light' }} withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  </React.StrictMode>,
)

