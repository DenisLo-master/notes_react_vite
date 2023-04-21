import { Container, Box } from '@mantine/core'
import { HeaderSearch } from './Header'
import ListItem from './ListItem'
import MainArea from './MainArea'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { getNoteIdFromFirebase, getNotesFromFirebase, setNoteToFirebase } from '../store/action/firebaseExchange'
import { Note, NoteProps } from '../interfaces/NoteProps'
import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/action/NotesDB'
import { useAuth } from '../context/AuthProvider'
import { addNote, updateNote } from '../store/action/actionslDB'

const Layout = () => {
  const { visible, setActive } = useLayoutContext()
  //получаем записи из IndexedDB
  const notesListFromIDB = useLiveQuery(() => db.notes.toArray()) as Note[]

  const { currentUserId } = useAuth()

  useEffect(() => {
    if (notesListFromIDB && notesListFromIDB.length) {
      notesListFromIDB.forEach((note, index) => {
        if (index === 0) {
          setActive(note)
        }
        if (!note.sync) {
          setNoteToFirebase({ uid: currentUserId, noteId: note.id })
        } else {
          getNoteIdFromFirebase({ uid: currentUserId, noteId: note.id }).then((note) => {
            note && updateNote(note)
          })
        }
      })
    } else {
      getNotesFromFirebase(currentUserId).then((notes) => {
        notes && notes.forEach((note) => addNote(note))
      })
    }
  }, [])

  const [myNotesList, setMyNotesList] = useState<NoteProps[]>([])
  const [searchedText, setSearchedText] = useState('')

  const searchedNotesList = searchedText
    ? myNotesList.filter(
        (note) => note.title.toLowerCase().includes(searchedText) || note.body.toLowerCase().includes(searchedText),
      )
    : myNotesList

  useEffect(() => {
    const tempArray: NoteProps[] = []
    notesListFromIDB &&
      notesListFromIDB.forEach((note, index) => {
        tempArray.push({
          id: note.id,
          title: note.title,
          body: note.body,
          additionalText: note.body.substring(0, 10),
          created_at: note.created_at,
          updated_at: note.updated_at,
          sync: note.sync,
          //active: index === 0 ? true : false, //показываем первую запись активной
        })
      })

    setMyNotesList(tempArray)
  }, [notesListFromIDB])

  return (
    <Container size='xl'>
      <HeaderSearch addItem={setMyNotesList} searchText={setSearchedText} currentUserId={currentUserId} />
      <Box
        className='containerShadow'
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

export default Layout
