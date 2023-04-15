import { FC, useState, useId } from 'react'
import Note from './Note'

interface SidebarProps {
  visible: boolean
}

const nodesList = [
  {
    id: 1,
    date: '01.01.1970',
    title: 'Note 1',
    additionalText: 'text',
    active: false,
  },
  {
    id: 2,
    date: '01.01.1970',
    title: 'Note 1',
    additionalText: 'text',
    active: false,
  },
  {
    id: 3,
    date: '01.01.1970',
    title: 'Note 1',
    additionalText: 'text',
    active: true,
  },
  {
    id: 4,
    date: '01.01.1970',
    title: 'Note 1',
    additionalText: 'text',
    active: false,
  },
]
const Sidebar: FC<SidebarProps> = ({ visible }) => {
  const style = {
    width: visible ? '20vw' : '0',
  }

  const [active, setActive] = useState(false)
  return visible ? (
    <div className="sidebarArea" style={style}>
      {nodesList.map((node) => (
        <Note
          key={node.id}
          id={node.id}
          date={node.date}
          title={node.title}
          additionalText={node.additionalText}
          active={node.active}
        />
      ))}
    </div>
  ) : (
    <div style={style}></div>
  )
}

export default Sidebar
