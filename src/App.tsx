import { createContext, useState } from 'react'
import './App.css'
import Layout from './components/Workspace'
import { LayoutContext } from './hooks/useLayoutContext'

function App() {
  const [visible, setVisible] = useState<boolean>(true)
  const toggleVisibleSidebar = () => {
    setVisible((prev) => !prev)
  }
  return (
    <LayoutContext.Provider value={{ visible, toggleVisibleSidebar }}>
      <Layout />
    </LayoutContext.Provider>
  )
}

export default App
