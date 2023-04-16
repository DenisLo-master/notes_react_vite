import { useState } from 'react'

import './App.css'
import Workspace from './components/Workspace'
import { LayoutContext } from './hooks/useLayoutContext'
import { firebaseApp } from './store/firebase.config'
import { Note } from './interfaces/NoteProps'
import { Route, Routes } from 'react-router'
import { AuthComponent } from './components/AuthComponent'

export function App() {
  const [visible, setVisible] = useState<boolean>(true)
  const toggleVisibleSidebar = (): void => {
    setVisible((prev) => !prev)
  }
  const [activeNote, setActiveNote] = useState<Note>({
    id: 0,
    body: '',
    created_at: new Date(),
    title: '',
  })

  const setCurrentNote = (note: Note) => {
    setActiveNote(note)
  }
  firebaseApp.auth()

  return (
    //Внешний вид программы

    <>
      <Routes>
        <Route path='/auth' element={<AuthComponent />} />
      </Routes>
      <LayoutContext.Provider value={{ visible, toggleVisibleSidebar, activeNote, setCurrentNote }}>
        <Workspace />
      </LayoutContext.Provider>
    </>
  )
}
