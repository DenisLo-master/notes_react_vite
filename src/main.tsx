import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { App } from './App'
import { ModalsProvider } from '@mantine/modals'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <MantineProvider
    theme={{ colorScheme: 'light' }}
    withGlobalStyles
    withNormalizeCSS
  >
    <ModalsProvider>
      <App />
    </ModalsProvider>
  </MantineProvider>,
  //</React.StrictMode>
)
