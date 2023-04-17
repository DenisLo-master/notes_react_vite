import { createContext, useContext } from 'react'
import { Note } from '../interfaces/NoteProps'

export interface LayoutContext {
  visible: boolean
  toggleVisibleSidebar: () => void
  activeNote: Note
  setCurrentNote: (note: Note) => void
}

export const LayoutContext = createContext<LayoutContext>({
  visible: true,
  toggleVisibleSidebar: () => {},
  activeNote: { id: 0, body: '', created_at: new Date(), title: '' },
  setCurrentNote: () => {},
})
export const useLayoutContext = () => useContext(LayoutContext)
