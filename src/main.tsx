import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { App } from './App'
import { ModalsProvider } from '@mantine/modals'

import { Provider } from 'react-redux'
import { store } from './store/notesRedux/store'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <MantineProvider
      theme={{ colorScheme: 'light' }}
      withGlobalStyles
      withNormalizeCSS
    >
      <ModalsProvider>
        <App />
      </ModalsProvider>
    </MantineProvider>
  </Provider>,
  //</React.StrictMode>
)
