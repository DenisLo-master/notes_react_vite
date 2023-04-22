import { Container, Box } from '@mantine/core'
import { HeaderSearch } from './Header'
import ListItem from './ListItem'
import MainArea from './MainArea'
import { useLayoutContext } from '../hooks/useLayoutContext'
import {
  getNoteIdFromFirebase,
  getNotesFromFirebase,
  setNoteToFirebase,
} from '../store/action/fbDataBaseExchange'
import { Note, NoteProps } from '../interfaces/NoteProps'
import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/action/indexDB'
import { useAuth } from '../context/AuthProvider'
import { createNoteDB, getNotesListDB, updateNoteDB } from '../store/action/notesDB'
import { imageToStorage } from '../utilities/imageToStorage'


export const Workspace = () => {
  const { uid } = useAuth()
  const { visible, setActiveNote } = useLayoutContext()
  const notesListFromIDB = useLiveQuery(() => db.notes.toArray()) as Note[]


  async function initNotes() {
    const notesIDB = await getNotesListDB()
    console.log("notesIDB", notesIDB)
    console.log("uid", uid)
    if (notesIDB && notesIDB.length) {
      notesIDB.forEach(async (note, index) => {
        if (index === 0) {
          setActiveNote(note)
        }
        if (!note.sync) {
          await imageToStorage({ uid: uid, note })
          setNoteToFirebase({ uid: uid, noteId: note.id })
        } else {
          getNoteIdFromFirebase({ uid: uid, noteId: note.id }).then(
            async (note) => {
              note && await updateNoteDB({ ...note, sync: false })
            },
          )
        }
      })
    } else {
      getNotesFromFirebase(uid).then((notes) => {
        notes && notes.forEach((note) => {
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
      (note) =>
        note.title.toLowerCase().includes(searchedText) ||
        note.body.toLowerCase().includes(searchedText),
    )
    : myNotesList

  useEffect(() => {
    if (notesListFromIDB?.length) {
      setMyNotesList(notesListFromIDB)
    }
  }, [notesListFromIDB])

  return (
    <Container size="xl">
      <HeaderSearch
        setList={setMyNotesList}
        searchText={setSearchedText}
        uid={uid}
      />
      <Box
        className="containerShadow"
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyItems: 'flex-start',
        }}
      >
        <ListItem visible={visible} notesList={searchedNotesList} />
        <MainArea visible={visible} />
      </Box>
    </Container>
  )
}

