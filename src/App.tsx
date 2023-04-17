import { useState } from 'react'

import './App.css'
import Workspace from './components/Workspace'
import { LayoutContext } from './hooks/useLayoutContext'
import { firebaseApp } from './store/firebase.config'
import { Note } from './interfaces/NoteProps'

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
    <LayoutContext.Provider value={{ visible, toggleVisibleSidebar, activeNote, setCurrentNote }}>
      <Workspace />
    </LayoutContext.Provider>
  )
}
