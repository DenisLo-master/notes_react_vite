import { FC, PropsWithChildren, createContext, useContext, useState } from 'react'
import { Note } from '../interfaces/NoteProps'

export interface LayoutContextProps {
  visible: boolean
  toggleVisibleSidebar: () => void
  activeNote: Note | null
  setActiveNote: (note: Note | null) => void
  hiddenSidebar: () => void
  visibleSidebar: () => void
}

// type LayoutContext = Partial<LayoutContextProps>

const LayoutContext = createContext<LayoutContextProps>({
  visible: true,
  toggleVisibleSidebar: () => {},
  activeNote: null,
  setActiveNote: (note: Note | null): void => {},
  hiddenSidebar: () => {},
  visibleSidebar: () => {},
})

export const useLayoutContext = () => {
  return useContext(LayoutContext)
}

export const LayoutProvider: FC<PropsWithChildren> = ({ children }) => {
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [visible, setVisible] = useState<boolean>(true)
  const toggleVisibleSidebar = (): void => {
    setVisible((prev) => !prev)
  }

  const hiddenSidebar = () => {
    setVisible(false)
  }
  const visibleSidebar = () => {
    setVisible(true)
  }

  const value = {
    visible,
    toggleVisibleSidebar,
    activeNote,
    setActiveNote,
    hiddenSidebar,
    visibleSidebar,
  }

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}
