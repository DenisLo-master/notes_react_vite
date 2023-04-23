export interface ISignUp {
  name: string
  email: string
  password: string
}
export interface ISignIn {
  email: string
  password: string
}

export interface IAuth {
  id: number
  token: string
  expirationTime: string
  timeLeft: string
}


export interface AuthProps {
  setRegister: React.Dispatch<React.SetStateAction<boolean>>
}
