import { createContext, useContext } from 'react'
import { Note } from '../interfaces/NoteProps'

export interface LayoutContext {
  visible: boolean
  toggleVisibleSidebar: () => void
  activeNote: Note
  setActiveNote: (note: Note) => void
}

export const LayoutContext = createContext<LayoutContext>({
  visible: true,
  toggleVisibleSidebar: () => { },
  activeNote: {
    id: 0,
    body: '',
    created_at: '',
    updated_at: '',
    title: ''
  },
  setActiveNote: () => { },
})
export const useLayoutContext = () => useContext(LayoutContext)
