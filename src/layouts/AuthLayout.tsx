import { useState } from 'react'
import { SignIn } from '../components/AuthComponents/SignIn'
import { SignUp } from '../components/AuthComponents/SignUp'
import { useAuth } from '../context/AuthProvider'
import { Outlet } from 'react-router'

export const AuthLayout = () => {
  const [register, setRegister] = useState(false)

  const { user } = useAuth()

  if (localStorage.getItem('userId')) {
    return <Outlet />
  }
  return <>{register ? <SignIn setRegister={setRegister} /> : <SignUp setRegister={setRegister} />}</>
}
