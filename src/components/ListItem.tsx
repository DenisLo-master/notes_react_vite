import { FC, useEffect, useState } from 'react'
import { NoteProps } from '../interfaces/NoteProps'
import { useLayoutContext } from '../hooks/useLayoutContext'

import { TitleNote } from './TitleNote'
import { ScrollArea, Box, Transition } from '@mantine/core'

interface SidebarProps {
  visible: boolean
  notesList: NoteProps[]
}

const ListItem: FC<SidebarProps> = ({ visible, notesList }) => {
  const [notes, setNotes] = useState<NoteProps[]>(notesList)
  const { activeNote, setActiveNote, hiddenSidebar } = useLayoutContext()
  useEffect(() => {
    setNotes(notesList)
  }, [notesList])

  const style = {
    flex: visible ? '0 0 20%' : '0 0 0',
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

  const listItemPositionStyle = window.innerWidth < 600 ? 'absolute' : 'relative'

  if (notes.length === 0) {
    return (
      <div className='sidebarArea' style={style}>
        {'Записей нет'}
      </div>
    )
  } else {
    return (
      <Transition
        mounted={visible}
        transition="slide-right"
        duration={1000}
        timingFunction="ease"
      >
        {(transitionStyles) => (
          <div >

            <ScrollArea.Autosize
              mah='100%'
              style={{
                ...transitionStyles,
                position: listItemPositionStyle, top: 0, left: 0, bottom: 0,
                maxWidth: "400px",
                backgroundColor: "#ededed",
                zIndex: 1000
              }}
            >
              {notes.length !== 0
                ? notes.map((note) => (
                  <Box
                    key={note.id + "box"}
                    sx={(theme) => ({
                      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                      textAlign: 'center',
                      padding: 0,
                      borderRadius: theme.radius.md,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor:
                          theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
                      },
                    })}
                  >
                    <TitleNote
                      key={note.id}
                      id={note.id}
                      created_at={note.created_at}
                      updated_at={note.updated_at}
                      title={note.title}
                      additionalText={getTextFromHtml(note.body)}
                      active={note.id === activeNote?.id}
                      onClick={() => {
                        noteClickHandle(note.id)
                        hiddenSidebar()
                      }}
                      body=''
                      sync={note.sync}
                    />
                  </Box>
                ))
                : 'Загрузка...'}
            </ScrollArea.Autosize>
          </div>
        )
        }
      </Transition >
    )
  }
}

export default ListItem
