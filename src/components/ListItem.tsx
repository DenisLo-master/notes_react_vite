import { FC, useEffect, useState } from 'react'
import Note from './Note'
import { NoteProps } from '../interfaces/NoteProps'

interface SidebarProps {
  visible: boolean
  notesList: NoteProps[]
}

const ListItem: FC<SidebarProps> = ({ visible, notesList }) => {
  const [notes, setNotes] = useState<NoteProps[]>(notesList)
  useEffect(() => {
    setNotes(notesList)
  }, [notesList])

  const style = {
    width: visible ? '20vw' : '0',
  }
  const noteClickHandle = (id: number) => {
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
      {notes.map((note) => (
        <Note
          key={note.id}
          id={note.id}
          date={note.date}
          title={note.title}
          additionalText={note.additionalText}
          active={note.active}
          onClick={() => noteClickHandle(note.id)}
          body={note.body}
        />
      ))}
    </div>
  ) : (
    <div style={style}></div>
  )
}

export default ListItem
