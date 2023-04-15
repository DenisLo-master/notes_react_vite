import { Container, Box } from '@mantine/core'
import Header from './Header'
import Sidebar from './Sidebar'
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
          <Sidebar visible={visible} />
          <MainArea visible={visible} />
        </Box>
      </div>
    </Container>
  )
}

export default Layout
