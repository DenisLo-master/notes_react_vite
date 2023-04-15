import { FC, useState } from 'react'
import Note from './Note'

interface SidebarProps {
  visible: boolean
}

const ListItem: FC<SidebarProps> = ({ visible }) => {
  const notesList = [
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
  const [notes, setNotes] = useState(notesList)
  const style = {
    width: visible ? '20vw' : '0',
  }
  const nodeClickHandle = (id: number) => {
    const updateNote: any = []
    notesList.map((note) => {
      note.active = false
      note.id === id ? (note.active = true) : note.active
      updateNote.push(note)
    })
    setNotes(updateNote)
  }
  return visible ? (
    <div className="sidebarArea" style={style}>
      {notes.map((node) => (
        <Note
          key={node.id}
          id={node.id}
          date={node.date}
          title={node.title}
          additionalText={node.additionalText}
          active={node.active}
          onClick={() => nodeClickHandle(node.id)}
        />
      ))}
    </div>
  ) : (
    <div style={style}></div>
  )
}

export default ListItem
