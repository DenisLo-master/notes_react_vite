import { FC, PropsWithChildren, useContext, createContext } from 'react'
import { auth } from '../store/firebase.config.js'
import { ISignUp } from '../interfaces/LoginTypes.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'

export interface IAuthValues {
  signUp: (values: ISignUp) => void
  signIn: (values: ISignUp) => void
}

const AuthContext = createContext<any>({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  function setTiken() {}

  const signUp = async ({ email, password }: ISignUp) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      console.log('signUp', response)
    } catch (error) {
      alert(error)
    }
  }

  const signIn = async ({ email, password }: ISignUp) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      console.log('signIn', response)
    } catch (error) {
      alert(error)
    }
  }

  const value = {
    signUp,
    signIn,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
