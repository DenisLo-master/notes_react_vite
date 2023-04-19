import { FC, useEffect, useState } from 'react'
import { NoteProps } from '../interfaces/NoteProps'
import { useLayoutContext } from '../hooks/useLayoutContext'
import moment from 'moment'

import Note from './Note'
import { setNotesToFirebase } from '../store/action/firebaseExchange'

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
        localStorage.setItem('activeNote', id.toString())
      }

      updateNote.push(note)
    })

    setNotes(updateNote)
  }

  if (notes.length === 0) {
    return (
      <div className="sidebarArea" style={style}>
        {'Записей нет'}
      </div>
    )
  } else {
    return visible ? (
      <div className="sidebarArea" style={style}>
        {notes.length !== 0
          ? notes.map((note) => (
              <Note
                key={note.id}
                id={note.id}
                created_at={moment(note.updated_at).format('DD.MM.YYYY')}
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
}

export default ListItem
