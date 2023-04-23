import { Container, Flex, Paper } from '@mantine/core'
import { HeaderSearch } from './HeaderSearch'
import ListItem from './ListItem'
import MainArea from './MainArea'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { getNoteIdFromFirebase, getNotesFromFirebase, setNoteToFirebase } from '../store/action/fbDataBaseExchange'
import { Note, NoteProps } from '../interfaces/NoteProps'
import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/action/indexDB'
import { useAuth } from '../context/AuthProvider'
import { createNoteDB, deleteNoteDB, getNotesListDB, updateNoteDB } from '../store/action/noteDB'
import { imageToStorage } from '../utilities/imageToStorage'

export const Workspace = () => {
  const { uid } = useAuth()
  const { visible, setActiveNote } = useLayoutContext()
  const notesListFromIDB = useLiveQuery(() => db.notes.toArray()) as Note[]

  async function initNotes() {
    const notesIDB = await getNotesListDB()
    if (notesIDB && notesIDB.length) {
      const check = notesIDB.map(async (note, index) => {
        if (index === 0) {
          setActiveNote(note)
        }
        if (!note.sync) {
          await imageToStorage({ uid: uid, note })
          setNoteToFirebase({ uid: uid, noteId: note.id })
        } else {
          await deleteNoteDB(note.id)
          getNoteIdFromFirebase({ uid: uid, noteId: note.id }).then(
            async (note) => {
              note && await updateNoteDB({ ...note, sync: true })
            },
          )
        }
      })
      await Promise.all(check)
      await getNotesFromFirebase(uid).then((notes) => {
        notes &&
          notes.forEach((note) => {
            createNoteDB({ uid, note: { ...note, sync: true } })
          })
      })
    } else {
      getNotesFromFirebase(uid).then((notes) => {
        notes &&
          notes.forEach((note) => {
            createNoteDB({ uid, note: { ...note, sync: true } })
          })
      })
    }
  }

  useEffect(() => {
    uid && initNotes()
  }, [uid])

  const [myNotesList, setMyNotesList] = useState<NoteProps[] | []>([])
  const [searchedText, setSearchedText] = useState('')

  const searchedNotesList = searchedText
    ? myNotesList.filter(
      (note) => note.title.toLowerCase().includes(searchedText) || note.body.toLowerCase().includes(searchedText),
    )
    : myNotesList

  useEffect(() => {
    if (notesListFromIDB?.length) {
      setMyNotesList(notesListFromIDB)
    }
  }, [notesListFromIDB])

  return (
    <Container size='xl'>
      <Flex style={{ position: 'relative', }}>
        <ListItem visible={visible} notesList={searchedNotesList} />
        <Flex style={{ position: 'relative', flexDirection: "column", flex: 1, zIndex: 1 }}>
          <HeaderSearch setList={setMyNotesList} searchText={setSearchedText} uid={uid} />
          <Flex style={{ position: 'relative', boxShadow: '5px 5px 15px rgba(0,0,0,0.6)' }}>
            <MainArea visible={visible} />
          </Flex>
        </Flex>

      </Flex>
    </Container>
  )
}
