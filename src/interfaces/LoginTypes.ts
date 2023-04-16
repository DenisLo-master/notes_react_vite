export interface ISignUp {
  email: string
  password: string
}

export interface AuthProps {
  setRegister: React.Dispatch<React.SetStateAction<boolean>>
}
