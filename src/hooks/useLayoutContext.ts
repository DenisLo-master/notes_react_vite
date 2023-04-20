import { createContext, useContext } from 'react'
import { Note } from '../interfaces/NoteProps'

export interface LayoutContext {
  visible: boolean
  toggleVisibleSidebar: () => void
  activeNote: Note | any
  setActive: (note: Note) => void
}

export const LayoutContext = createContext<LayoutContext>({
  visible: true,
  toggleVisibleSidebar: () => {},
  activeNote: <Note>{},
  setActive: (note: Note): void => {},
})
export const useLayoutContext = () => useContext(LayoutContext)
