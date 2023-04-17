import { Container, Box } from '@mantine/core'
import Header from './Header'
import ListItem from './ListItem'
import MainArea from './MainArea'
import { useLayoutContext } from '../hooks/useLayoutContext'
import {
  getNotesFromFirebase,
  setNotesToFirebase,
} from '../store/action/firebaseExchange'
import { Note } from '../interfaces/NoteProps'
import { useEffect, useState } from 'react'
import { addNotes } from '../store/action/AddToLocalDB'

const Layout = () => {
  const { visible } = useLayoutContext()
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    //получаем записи из Firebase
    const notes_res = getNotesFromFirebase('denis.lkg@gmail.com')/* .then((res) =>
      setNotes(res),
    ) */
    console.log(notes_res)

    //записываем полученные данные в IndexedDB
    addNotes(notes)
  }, [])

  return (
    <Container size="xl">
      <div className="main">
        <button
          onClick={() => {
            setNotesToFirebase({ user: 'denis.lkg@gmail.com', notes })
          }}
        >
          toFB
        </button>
        <button
          onClick={() => {
            getNotesFromFirebase('denis.lkg@gmail.com')
          }}
        >
          fromFB
        </button>

        <Header />
        <Box
          className="containerShadow"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyItems: 'flex-start',
          }}
        >
          <ListItem visible={visible} />
          <MainArea visible={visible} />
        </Box>
      </div>
    </Container>
  )
}

export default Layout
