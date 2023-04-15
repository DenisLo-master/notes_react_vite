import { createContext, useContext } from 'react'
export interface LayoutContext {
  visible: boolean
  toggleVisibleSidebar: () => void
}

export const LayoutContext = createContext<LayoutContext>({
  visible: true,
  toggleVisibleSidebar: () => {},
})
export const useLayoutContext = () => useContext(LayoutContext)
