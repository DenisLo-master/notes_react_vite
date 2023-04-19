import { Flex, Loader } from '@mantine/core'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

export const PrivateRoute = () => {
  const [currentUser, setCurrentUser] = useState<any>()

  const auth = getAuth()

  useEffect(() => {
    const currentUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      }
    })
    return currentUser
  }, [])

  if (!currentUser) {
    return (
      <Flex justify='center' mt='2rem'>
        <Loader size={'4rem'} variant='dots' />
      </Flex>
    )
  }

  return <Outlet />
}
