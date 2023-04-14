import { useState } from 'react'
import { Container, Box } from '@mantine/core'
import Header from './Header'
import Sidebar from './Sidebar'
import MainArea from './MainArea'

const Layout = () => {
  const [visible, setVisible] = useState<boolean>(true)
  const buttonHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const button: HTMLButtonElement = event.currentTarget
    setVisible((prev) => !prev)
  }
  return (
    <Container size="xl">
      <div className="main">
        <Header />
        <Box
          className="containerShadow"
          sx={{ display: 'flex', flexDirection: 'row', justifyItems: 'flex-start' }}>
          <Sidebar visible={visible} />
          <MainArea visible={visible} />
        </Box>
        <button onClick={buttonHandler}>visible</button>
      </div>
    </Container>
  )
}

export default Layout
