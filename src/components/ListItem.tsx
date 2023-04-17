import { FC, useState } from 'react'
import Note from './Note'
import { NoteProps } from '../interfaces/NoteProps'

interface SidebarProps {
  visible: boolean
}

const ListItem: FC<SidebarProps> = ({ visible }) => {
  const notesList: NoteProps[] = [
    {
      id: 1,
      date: '01.01.1970',
      title: 'Note 1',
      additionalText: 'text',
      active: false,
      text: 'Text 1',
    },
    {
      id: 2,
      date: '01.01.1970',
      title: 'Note 1',
      additionalText: 'text',
      active: false,
      text: 'Text 2',
    },
    {
      id: 3,
      date: '01.01.1970',
      title: 'Note 1',
      additionalText: 'text',
      active: true,
      text: 'Text 3',
    },
    {
      id: 4,
      date: '01.01.1970',
      title: 'Note 1',
      additionalText: 'text',
      active: false,
      text: 'Text 4',
    },
  ]
  const [notes, setNotes] = useState<NoteProps[]>(notesList)
  const style = {
    width: visible ? '20vw' : '0',
  }
  const nodeClickHandle = (id: number) => {
    const updateNote: NoteProps[] = []
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
          text={node.text}
        />
      ))}
    </div>
  ) : (
    <div style={style}></div>
  )
}

export default ListItem
