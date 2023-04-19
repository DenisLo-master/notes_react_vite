import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { App } from './App'
import { AuthProvider } from './context/AuthProvider'
import { ModalsProvider } from '@mantine/modals'

import { Provider } from 'react-redux'
import { store } from './store/notesRedux/store'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <BrowserRouter>
    <Provider store={store}>
      <AuthProvider>
        <MantineProvider theme={{ colorScheme: 'light' }} withGlobalStyles withNormalizeCSS>
          <ModalsProvider>
            <App />
          </ModalsProvider>
        </MantineProvider>
      </AuthProvider>
    </Provider>
  </BrowserRouter>,
  //</React.StrictMode>
)
