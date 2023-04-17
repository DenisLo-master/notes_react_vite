import { FC, useEffect, useState } from 'react'
import Note from './Note'
import { NoteProps } from '../interfaces/NoteProps'
import { useLayoutContext } from '../hooks/useLayoutContext'

interface SidebarProps {
  visible: boolean
  notesList: NoteProps[]
}

const ListItem: FC<SidebarProps> = ({ visible, notesList }) => {
  const [notes, setNotes] = useState<NoteProps[]>(notesList)
  const { setCurrentNote } = useLayoutContext()
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
      if (note.id === id) {
        note.active = true
        setCurrentNote(note)
      }

      updateNote.push(note)
    })

    setNotes(updateNote)
  }

  return visible ? (
    <div className="sidebarArea" style={style}>
      {notes.length !== 0
        ? notes.map((note) => (
            <Note
              key={note.id}
              id={note.id}
              created_at={note.created_at}
              title={note.title}
              additionalText={note.additionalText}
              active={note.active}
              onClick={() => noteClickHandle(note.id)}
              body={note.body}
            />
          ))
        : 'Загрузка...'}
    </div>
  ) : (
    <div style={style}></div>
  )
}

export default ListItem
