import { useEffect, useState } from 'react'
import { SignIn } from '../components/AuthComponents/SignIn'
import { SignUp } from '../components/AuthComponents/SignUp'
import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthProvider'

export const AuthLayout = () => {
  const [register, setRegister] = useState(false)

  const { uid } = useAuth()

  if (uid) {
    return <Navigate to='/workspace' />
  }
  return <>{register ?
    <SignIn setRegister={setRegister} /> :
    <SignUp setRegister={setRegister} />}</>
}
