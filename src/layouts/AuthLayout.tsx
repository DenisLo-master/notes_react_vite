import { useEffect, useState } from 'react'
import { SignIn } from '../components/AuthComponents/SignIn'
import { SignUp } from '../components/AuthComponents/SignUp'
import { Navigate } from 'react-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export const AuthLayout = () => {
  const [register, setRegister] = useState(false)

  const [currentUser, setCurrentUser] = useState<any>()

  const auth = getAuth()

  useEffect(() => {
    const currentUser = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid
        setCurrentUser(user)
      }
    })
    return currentUser
  }, [])

  if (currentUser) {
    return <Navigate to='/workspace' />
  }
  return <>{register ? <SignIn setRegister={setRegister} /> : <SignUp setRegister={setRegister} />}</>
}
