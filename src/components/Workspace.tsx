import { Container, Box } from '@mantine/core'
import Header from './Header'
import ListItem from './ListItem'
import MainArea from './MainArea'
import { useLayoutContext } from '../hooks/useLayoutContext'

const Layout = () => {
  const { visible } = useLayoutContext()

  return (
    <Container size="xl">
      <div className="main">
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
