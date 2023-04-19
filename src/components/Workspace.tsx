import { Container, Box, Button } from '@mantine/core'
import Header from './Header'
import ListItem from './ListItem'
import MainArea from './MainArea'
import { useLayoutContext } from '../hooks/useLayoutContext'
import {
  getNotesFromFirebase,
  setNotesToFirebase,
} from '../store/action/firebaseExchange'
import { Note, NoteProps } from '../interfaces/NoteProps'
import { useEffect, useState } from 'react'
import { addNotes } from '../store/action/AddToLocalDB'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/action/NotesDB'
import moment from 'moment'
import { useAuth } from '../context/AuthProvider'

const Layout = () => {
  const { signOutUser } = useAuth()
  const currentUserId = localStorage.getItem('userId') || ''
  const { visible } = useLayoutContext()
  //получаем записи из IndexedDB
  const notesListFromIDB = useLiveQuery(() => db.notes.toArray()) as Note[]

  const { currentUser, getCurrentUser } = useAuth()

  //создаём список для отображения
  const [myNotesList, setMyNotesList] = useState<NoteProps[]>([])
  const [serchedText, setSearchedText] = useState('')

  const searchedNotesList = serchedText
    ? myNotesList.filter(
      (note) =>
        note.title.toLowerCase().includes(serchedText) ||
        note.body.toLowerCase().includes(serchedText),
    )
    : myNotesList

  const [serchedText, setSearchedText] = useState('')

  const searchedNotesList = serchedText
    ? myNotesList.filter(
      (note) => note.title.toLowerCase().includes(serchedText) || note.body.toLowerCase().includes(serchedText),
    )
    : myNotesList

  useEffect(() => {
    db.notes.clear()
    //получаем записи из Firebase
    getNotesFromFirebase(currentUserId /* 'denis.lkg@gmail.com' */).then((notes) => {
      notes && notes.map((note) => addNotes(note))
    })
  }, [])

  useEffect(() => {
    console.log("currentUser Effect", currentUser)

    const tempArray: NoteProps[] = []
    notesListFromIDB &&
      notesListFromIDB.map((note, index) => {
        tempArray.push({
          id: note.id,
          title: note.title,
          body: note.body,
          additionalText: note.body.substring(0, 10),
          created_at: moment(note.created_at).format('L'),
          updated_at: moment(note.updated_at).format('L'),
          active: index === 0 ? true : false, //показываем первую запись активной
        })
      })

    setMyNotesList(tempArray)
  }, [notesListFromIDB])

  //отправляем в FireBase, если не пустой список
  // if (notesListFromIDB && notesListFromIDB.length !== 0) {
  //   setNotesToFirebase({
  //     user: currentUserId,
  //     note: notesListFromIDB,
  //   })
  // }
  // выход из аккаунта
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

        <Header addItem={setMyNotesList} serchText={setSearchedText} />
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
