import { FC, PropsWithChildren, createContext, useContext, useState } from 'react'
import { Note } from '../interfaces/NoteProps'

export interface LayoutContextProps {
  visible: boolean
  toggleVisibleSidebar: () => void
  activeNote: Note | null
  setActiveNote: (note: Note | null) => void
}

// type LayoutContext = Partial<LayoutContextProps>

const LayoutContext = createContext<LayoutContextProps>({
  visible: true,
  toggleVisibleSidebar: () => { },
  activeNote: null,
  setActiveNote: (note: Note | null): void => { },
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

  const value = {
    visible,
    toggleVisibleSidebar,
    activeNote,
    setActiveNote
  }

  return (
    <LayoutContext.Provider value={value} >
      {children}
    </LayoutContext.Provider>
  )
}