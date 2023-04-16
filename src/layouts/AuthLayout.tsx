import { useState } from 'react'
import { SignIn } from '../components/AuthComponents/SignIn'
import { SignUp } from '../components/AuthComponents/SignUp'

export const AuthLayout = () => {
  const [register, setRegister] = useState(false)

  return <>{register ? <SignIn setRegister={setRegister} /> : <SignUp setRegister={setRegister} />}</>
}
