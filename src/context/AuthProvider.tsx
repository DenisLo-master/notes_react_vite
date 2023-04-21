import { FC, PropsWithChildren, useContext, createContext, useState } from 'react'
import { ISignIn, ISignUp } from '../interfaces/LoginTypes.js'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { getDatabase, ref, set } from 'firebase/database'
import { useNavigate } from 'react-router-dom'
import { clearNotes } from '../store/action/actionslDB.js'

export interface IAuthValues {
  currentUserId: string
  signUp: (values: ISignUp) => void
  signIn: (values: ISignIn) => void
  signOutUser: () => void
  error: string
}
type AuthContext = Partial<IAuthValues>

export interface IError {
  error: {
    code: number
    message: string
    errors: [
      {
        message: string
        domain: string
        reason: string
      },
    ]
  }
}

const AuthContext = createContext<any>({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate()

  const [currentUserId, setCurrentUserId] = useState<string>('')
  const [error, setError] = useState('')

  const db = getDatabase()
  const auth = getAuth()

  const signUp = async ({ name, email, password }: ISignUp) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      const user = response.user as any

      const userId: string = user.uid
      const createdAt = user.metadata.creationTime

      const expirationTime = new Date(user.stsTokenManager.expirationTime)

      const timeLeft = (expirationTime.getTime() - new Date().getTime()) / 1000
      localStorage.setItem('token', user.multiFactor.user.accessToken)
      localStorage.setItem('expirationTime', expirationTime.toDateString())
      localStorage.setItem('timeLeft', timeLeft.toString())

      setCurrentUserId(userId)

      // запись в базу данных после регистрации
      set(ref(db, 'users/' + userId), {
        id: userId,
        userName: name,
        email,
        createdAt,
      })
      autoRefreshUserToken(timeLeft)
    } catch (error) {
      if (error instanceof Error) {
        setError('Пользователь уже существует')
      }
    }
  }

  const signIn = async ({ email, password }: ISignIn) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      const user = response.user as any

      const userId: string = user.uid

      const expirationTime = new Date(user.stsTokenManager.expirationTime)

      const timeLeft = (expirationTime.getTime() - new Date().getTime()) / 1000
      localStorage.setItem('token', user.accessToken)
      localStorage.setItem('expirationTime', expirationTime.toDateString())
      localStorage.setItem('timeLeft', timeLeft.toString())

      setCurrentUserId(userId)
      autoRefreshUserToken(timeLeft)
    } catch (error) {
      if (error instanceof Error) {
        setError('Пользователь не найден')
      }
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth).then(() => {
        navigate('/')
        setCurrentUserId('')
        localStorage.removeItem('userId')
      })
    } catch (error) {
      alert(error)
    }
  }

  const getCurrentUser = () => {
    console.log('getCurrentUser')
    onAuthStateChanged(auth, (user) => {
      console.log('getCurrentUser2', user)

      if (user) {
        const uid = user.uid
        setCurrentUserId(uid)
      }
    })
  }

  const logoutFirebase = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('timeLeft')
    clearNotes()
  }

  const autoRefreshUserToken = (time: number) => {
    return setTimeout(() => {
      refreshUserToken()
    }, time * 960)
  }

  const refreshUserToken = () => {
    auth.currentUser
      ?.getIdTokenResult(/* forceRefresh */ true)
      .then(() => {
        const user = auth.currentUser as any
        const expirationTime = new Date(user.stsTokenManager.expirationTime)

        const timeLeft = (expirationTime.getTime() - new Date().getTime()) / 1000
        localStorage.setItem('token', user.accessToken)
        localStorage.setItem('expirationTime', expirationTime.toDateString())
        localStorage.setItem('timeLeft', timeLeft.toString())

        autoRefreshUserToken(timeLeft)
      })
      .catch(function (error) {
        console.log('---!!!---Error refreshUserToken', error)
      })
  }

  auth.onAuthStateChanged((user) => {
    // console.log("--------------onAuthStateChanged-------------------");
    if (user) {
      //console.log('onAuthStateChanged', user)
      refreshUserToken()
      autoLoginFirebase()
    }
  })

  const autoLoginFirebase = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      logoutFirebase()
    } else {
      const time = localStorage.getItem('expirationTime')
      if (!time) {
        logoutFirebase()
        return
      }
      const expirationTime = new Date(+time)
      const timeLeft = (expirationTime.getTime() - new Date().getTime()) / 1000

      if (expirationTime <= new Date()) {
        autoRefreshUserToken(0)
      } else {
        autoRefreshUserToken(timeLeft)
      }
    }
  }

  const value = {
    currentUserId,
    getCurrentUser,
    signUp,
    signIn,
    signOutUser,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
