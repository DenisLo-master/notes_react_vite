import { FC, useState } from 'react'
import Note from './Note'

interface SidebarProps {
  visible: boolean
}

const Sidebar: FC<SidebarProps> = ({ visible }) => {
  const style = {
    width: visible ? '20vw' : '0',
  }
  const [active, setActive] = useState(false)
  return visible ? (
    <div className="sidebarArea" style={style}>
      <Note date="01.01.1970" title="Note 1" additionalText="text" />
      <Note date="01.01.1970" title="Note 1" additionalText="text" />
      <Note date="01.01.1970" title="Note 1" additionalText="text" active />
      <Note date="01.01.1970" title="Note 1" additionalText="text" />
    </div>
  ) : (
    <div style={style}></div>
  )
}

export default Sidebar
