import { FC, PropsWithChildren, useContext, createContext, useState } from 'react'
import { auth } from '../store/firebase.config.js'
import { ISignUp } from '../interfaces/LoginTypes.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, ref, set, onValue } from 'firebase/database'

export interface IAuthValues {
  user: any
  accessToken: string
  signUp: (values: ISignUp) => void
  signIn: (values: ISignUp) => void
}

const AuthContext = createContext<any>({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState({})
  const [accessToken, setAccessToken] = useState('')

  const db = getDatabase()

  const signUp = async ({ name, email, password }: ISignUp) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      const responseUser = response.user

      responseUser.getIdToken().then((accessToken) => setAccessToken(accessToken))

      const userId = responseUser.uid
      const createdAt = responseUser.metadata.creationTime

      set(ref(db, 'users/' + userId), {
        userName: name,
        email,
        createdAt,
      })

      setUser({ userId, name, email, createdAt })
    } catch (error) {
      alert(error)
    }
  }

  const signIn = async ({ email, password }: ISignUp) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      const responseUser = response.user

      responseUser.getIdToken().then((accessToken) => setAccessToken(accessToken))

      const userId = responseUser.uid

      const user = ref(db, 'users/' + userId)
      onValue(user, (snapshot) => {
        const data = snapshot.val()
        setUser({
          userId,
          name: data.displayName,
          email: data.email,
          createdAt: data.createdAt,
        })
      })
    } catch (error) {
      alert(error)
    }
  }

  const value = {
    user,
    accessToken,
    signUp,
    signIn,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
