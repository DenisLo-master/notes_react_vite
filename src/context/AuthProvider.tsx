import { FC, PropsWithChildren, useContext, createContext, useState } from 'react'
import { auth } from '../store/firebase.config.js'
import { ISignUp } from '../interfaces/LoginTypes.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, ref, set } from 'firebase/database'

export interface IAuthValues {
  user: any
  signUp: (values: ISignUp) => void
  signIn: (values: ISignUp) => void
}

export interface IToken {
  refreshToken: string
  accessToken: string
  expirationTime: number
}

const TOKEN_KEY = 'jwt-token'
const REFRESH_KEY = 'jwt-refresh-token'
const EXPIRES_KEY = 'jwt-expires'

const AuthContext = createContext<any>({})

export const useAuth = () => {
  return useContext(AuthContext)
}

const writeUserData = (userId: string, name: string, email: string, createdAt?: string) => {
  const db = getDatabase()
  set(ref(db, 'users/' + userId), {
    username: name,
    email: email,
    createdAt: createdAt,
  })
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState({})
  function setToken({ refreshToken, accessToken, expirationTime }: IToken) {
    localStorage.setItem(TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_KEY, refreshToken)
    localStorage.setItem(EXPIRES_KEY, expirationTime.toString())
  }

  const signUp = async ({ name, email, password, ...rest }: ISignUp) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)

      console.log(response.user)

      const user = response.user
      const metadata = user.metadata
      const userId = user.uid
      const refreshToken = localStorage.setItem(REFRESH_KEY, user.refreshToken)
      const accessToken = user.getIdToken().then((accessToken) => localStorage.setItem(TOKEN_KEY, accessToken))
      const expirationTime = Date.now() + 3600 * 1000
      const createdAt = metadata.creationTime

      writeUserData(userId, name, email, createdAt)
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
    user,
    signUp,
    signIn,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
