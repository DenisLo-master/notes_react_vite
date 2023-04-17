import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <MantineProvider
    theme={{ colorScheme: 'light' }}
    withGlobalStyles
    withNormalizeCSS
  >
    <App />
  </MantineProvider>,
  //</React.StrictMode>
)
