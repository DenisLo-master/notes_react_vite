import { Container, Box, Button } from '@mantine/core'
import Header from './Header'
import ListItem from './ListItem'
import MainArea from './MainArea'
import { useLayoutContext } from '../hooks/useLayoutContext'
import {
  getNoteIdFromFirebase,
  getNotesFromFirebase,
  setNoteToFirebase,
} from '../store/action/firebaseExchange'
import { Note, NoteProps } from '../interfaces/NoteProps'
import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/action/NotesDB'
import moment from 'moment'
import { useAuth } from '../context/AuthProvider'
import { addNote, updateNote } from '../store/action/actionslDB'

const Layout = () => {
  const { signOutUser } = useAuth()
  const { visible, setActiveNote } = useLayoutContext()
  //получаем записи из IndexedDB
  const notesListFromIDB = useLiveQuery(() => db.notes.toArray()) as Note[]

  const { currentUserId } = useAuth()

  useEffect(() => {
    if (notesListFromIDB && notesListFromIDB.length) {
      console.log("init------", notesListFromIDB)
      notesListFromIDB.forEach((note, index) => {
        if (index === 0) {
          setActiveNote(note)
        }
        if (!note.sync) {
          setNoteToFirebase({ uid: currentUserId, note })
        } else {
          getNoteIdFromFirebase({ uid: currentUserId, noteId: note.id })
            .then((note) => {
              note && updateNote(note)
            })
        }
      })
    } else {
      console.log("init------empty", currentUserId)
      getNotesFromFirebase(currentUserId).then((notes) => {
        notes && notes.forEach((note) => addNote(note))
      })
    }
  }, [])

  // //создаём список для отображения
  const [myNotesList, setMyNotesList] = useState<NoteProps[]>([])
  const [searchedText, setSearchedText] = useState('')

  const searchedNotesList = searchedText
    ? myNotesList.filter(
      (note) =>
        note.title.toLowerCase().includes(searchedText) ||
        note.body.toLowerCase().includes(searchedText),
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
          created_at: moment(note.created_at).format('L'),
          updated_at: moment(note.updated_at).format('L'),
          sync: note.sync,
          active: index === 0 ? true : false, //показываем первую запись активной
        })
      })

    setMyNotesList(tempArray)
  }, [notesListFromIDB])


  const handleClickOut = () => {
    signOutUser()
  }

  return (
    <Container size="xl">
      <div className="main">
        {/* Кнопка выхода из аккаунта */}
        <Button pos={'fixed'} right={0} m={10} onClick={handleClickOut}>
          Выход
        </Button>

        <Header
          addItem={setMyNotesList}
          searchText={setSearchedText}
          currentUserId={currentUserId}
        />
        <Box
          className="containerShadow"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyItems: 'flex-start',
          }}>
          <ListItem visible={visible} notesList={searchedNotesList} />
          <MainArea visible={visible} />
        </Box>
      </div>
    </Container>
  )
}

export default Layout
