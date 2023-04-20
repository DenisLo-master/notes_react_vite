import { useEffect, useState } from 'react'
import { SignIn } from '../components/AuthComponents/SignIn'
import { SignUp } from '../components/AuthComponents/SignUp'
import { Navigate } from 'react-router'
import { getAuth } from 'firebase/auth'
import { useAuth } from '../context/AuthProvider'

export const AuthLayout = () => {
  const [register, setRegister] = useState(false)


  const { currentUser, getCurrentUser } = useAuth()

  useEffect(() => {
    !currentUser && getCurrentUser()
  }, [])

  if (currentUser) {
    return <Navigate to='/workspace' />
  }
  return <>{register ? <SignIn setRegister={setRegister} /> : <SignUp setRegister={setRegister} />}</>
}
