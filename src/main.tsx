import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <ModalsProvider>
      <App />
    </ModalsProvider>
  </MantineProvider>,
)
