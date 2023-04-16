import { Container, Box } from '@mantine/core'
import Header from './Header'
import ListItem from './ListItem'
import MainArea from './MainArea'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { getNotesFromFirebase, setNotesToFirebase } from '../store/action/firebaseExchange'

const Layout = () => {
  const { visible } = useLayoutContext()


  const notes = [
    {
      title: "first note",
      body: "first note body",
    },
    {
      title: "first note",
      body: "first note body",
    }
  ]

  return (
    <Container size="xl">
      <div className="main">
        <button onClick={() => {
          setNotesToFirebase({ user: "denis.lkg@gmail.com", notes })
        }}>toFB</button>
        <button onClick={() => {
          getNotesFromFirebase("denis.lkg@gmail.com")
        }}>fromFB</button>
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
