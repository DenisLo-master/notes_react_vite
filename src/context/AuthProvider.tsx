import { FC, PropsWithChildren, useContext, createContext, useState } from 'react'
import { auth } from '../store/firebase.config.js'
import { ISignUp } from '../interfaces/LoginTypes.js'
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getDatabase, ref, set, onValue } from 'firebase/database'
import { async } from '@firebase/util'

export interface IAuthValues {
  user: any
  accessToken: string
  signUp: (values: ISignUp) => void
  signIn: (values: ISignUp) => void
}

function setLocalStorage(userId: string) {
  localStorage.setItem('userId', userId)
}

function removeLocalStorage() {
  localStorage.removeItem('userId')
}

const AuthContext = createContext<any>({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<any>(null)
  const [accessToken, setAccessToken] = useState('')

  const db = getDatabase()
  const auth = getAuth()
  const currentUser = auth.currentUser

  const signUp = async ({ name, email, password }: ISignUp) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      const user = response.user

      setUser(user)
      setLocalStorage(user.uid)

      // responseUser.getIdToken().then((accessToken) => setAccessToken(accessToken))

      // const userId = responseUser.uid
      // const createdAt = responseUser.metadata.creationTime

      // set(ref(db, 'users/' + userId), {
      //   userName: name,
      //   email,
      //   createdAt,
      // })
    } catch (error) {
      alert(error)
    }
  }

  const signIn = async ({ email, password }: ISignUp) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      const user = response.user
      setUser(user)
      setLocalStorage(user.uid)

      // console.log(responseUser)

      // responseUser.getIdToken().then((accessToken) => setAccessToken(accessToken))

      // const userId = responseUser.uid

      // const user = ref(db, 'users/' + userId)
      // onValue(user, (snapshot) => {
      //   const data = snapshot.val()
      //   setUser({
      //     userId,
      //     name: data.displayName,
      //     email: data.email,
      //     createdAt: data.createdAt,
      //   })
      // })
    } catch (error) {
      alert(error)
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth).then(() => {
        setUser(null)
        removeLocalStorage()
        console.log('signOut')
      })
    } catch (error) {
      alert(error)
    }
  }

  console.log('user', user)

  const value = {
    user,
    accessToken,
    signUp,
    signIn,
    signOutUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
