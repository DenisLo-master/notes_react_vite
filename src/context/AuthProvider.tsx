import { FC, PropsWithChildren, useContext, createContext, useState } from 'react'
import { ISignIn, ISignUp } from '../interfaces/LoginTypes.js'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getDatabase, ref, set } from 'firebase/database'
import { useNavigate } from 'react-router-dom'

export interface IAuthValues {
  currentUserId: string
  signUp: (values: ISignUp) => void
  signIn: (values: ISignIn) => void
  signOutUser: () => void
}
type AuthContext = Partial<IAuthValues>
const AuthContext = createContext<any>({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()

  const [currentUserId, setCurrentUserId] = useState<string>()

  const db = getDatabase()
  const auth = getAuth()

  const signUp = async ({ name, email, password }: ISignUp) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      const user = response.user

      const userId = user.uid
      const createdAt = user.metadata.creationTime

      localStorage.setItem('userId', userId)

      setCurrentUserId(userId)

      // запись в базу данных после регистрации
      set(ref(db, 'users/' + userId), {
        id: userId,
        userName: name,
        email,
        createdAt,
      })
    } catch (error) {
      alert(error)
    }
  }

  const signIn = async ({ email, password }: ISignIn) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      const user = response.user

      const userId = user.uid

      localStorage.setItem('userId', userId)

      setCurrentUserId(userId)
    } catch (error) {
      alert(error)
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth).then(() => {
        navigate('/')
        localStorage.removeItem('userId')
      })
    } catch (error) {
      alert(error)
    }
  }

  const value = {
    currentUserId,
    signUp,
    signIn,
    signOutUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
