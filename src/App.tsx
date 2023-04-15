import { useState } from 'react'

import './App.css'
import Workspace from './components/Workspace'
import { LayoutContext } from './hooks/useLayoutContext'

export function App() {
  const [visible, setVisible] = useState<boolean>(true)
  const toggleVisibleSidebar = () => {
    setVisible((prev) => !prev)
  }

  return (
    //Внешний вид программы
    <LayoutContext.Provider value={{ visible, toggleVisibleSidebar }}>
      <Workspace />
    </LayoutContext.Provider>
  )
}
