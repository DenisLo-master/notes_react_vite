import { FC, useEffect, useState } from 'react'
import { NoteProps } from '../interfaces/NoteProps'
import { useLayoutContext } from '../hooks/useLayoutContext'

import { TitleNote } from './TitleNote'
import { ScrollArea } from '@mantine/core'
interface SidebarProps {
  visible: boolean
  notesList: NoteProps[]
}

const ListItem: FC<SidebarProps> = ({ visible, notesList }) => {
  const [notes, setNotes] = useState<NoteProps[]>(notesList)
  const { activeNote, setActiveNote } = useLayoutContext()
  useEffect(() => {
    setNotes(notesList)
  }, [notesList])

  const style = {
    width: visible ? '20vw' : '0',
    display: visible ? '' : 'none',
  }

  const setActiveStyleNote = (id: number) => {
    const updateNote: NoteProps[] = []
    notesList.forEach((note) => {
      note.active = false
      if (note.id === id) {
        note.active = true
        setActiveNote(note)
      }
      updateNote.push(note)
    })
    setNotes(updateNote)
  }

  const noteClickHandle = (id: number) => {
    setActiveStyleNote(id)
  }

  useEffect(() => {
    if (!activeNote && notesList.length) {
      setActiveStyleNote(notesList[0].id)
    }
  }, [activeNote])

  const getTextFromHtml = (html: string) => {
    var tempElement = document.createElement('div')
    tempElement.innerHTML = html
    return tempElement.textContent?.substring(0, 10)
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
        <ScrollArea.Autosize mah="100%">
          {notes.length !== 0
            ? notes.map((note) => (
              <TitleNote
                key={note.id}
                id={note.id}
                created_at={note.created_at}
                updated_at={note.updated_at}
                title={note.title}
                additionalText={getTextFromHtml(note.body)}
                active={
                  note.id === activeNote?.id
                }
                onClick={() => noteClickHandle(note.id)}
                body=""
                sync={note.sync}
              />
            ))
            : 'Загрузка...'}
        </ScrollArea.Autosize>
      </div>
    ) : (
      <div style={style}></div>
    )
  }
}

export default ListItem
