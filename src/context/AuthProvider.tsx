import { FC, PropsWithChildren, useContext, createContext } from 'react'
import { ISignIn, ISignUp } from '../interfaces/LoginTypes.js'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getDatabase, ref, set } from 'firebase/database'
import { useNavigate } from 'react-router-dom'

export interface IAuthValues {
  signUp: (values: ISignUp) => void
  signIn: (values: ISignIn) => void
  signOutUser: () => void
}

const AuthContext = createContext<any>({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()

  const db = getDatabase()
  const auth = getAuth()

  const signUp = async ({ name, email, password }: ISignUp) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      const user = response.user

      const userId = user.uid
      const createdAt = user.metadata.creationTime

      // запись в базу данных после регистрации
      set(ref(db, 'users/' + userId), {
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
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      alert(error)
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth).then(() => {
        navigate('/')
      })
    } catch (error) {
      alert(error)
    }
  }

  const value = {
    signUp,
    signIn,
    signOutUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
