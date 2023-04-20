import { useState } from 'react'

import './App.css'
import Workspace from './components/Workspace'
import { LayoutContext } from './hooks/useLayoutContext'
import { firebaseApp } from './store/firebase.config'
import { Note } from './interfaces/NoteProps'
import { Navigate, Route, Routes } from 'react-router'
import { AuthLayout } from './layouts/AuthLayout'
import { PrivateRoute } from './layouts/PrivateRoute'

export function App() {
  const [visible, setVisible] = useState<boolean>(true)
  const toggleVisibleSidebar = (): void => {
    setVisible((prev) => !prev)
  }
  const [activeNote, setActiveNote] = useState<Note | unknown>({})
  const setActive = (note: Note): void => setActiveNote(note)

  firebaseApp.auth()

  return (
    //Внешний вид программы
    <>
      <LayoutContext.Provider
        value={{ visible, toggleVisibleSidebar, activeNote, setActive }}
      >
        <Routes>
          <Route path="/" element={<AuthLayout />} />
          <Route path="/workspace" element={<PrivateRoute />}>
            <Route path="" element={<Workspace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LayoutContext.Provider>
    </>
  )
}
