import {
  FC,
  PropsWithChildren,
  useContext,
  createContext,
  useState,
} from 'react'
import { IAuth, ISignIn, ISignUp } from '../interfaces/LoginTypes.js'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { clearNotesDB } from '../store/action/notesDB.js'
import { addAuthInfoDB, clearAuthInfoDB, getAuthInfoDB, updateAuthInfoDB } from '../store/action/authDB.js'

export interface IAuthValues {
  uid: string
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

  const [uid, setUid] = useState<string>('')
  const [error, setError] = useState('')

  const auth = getAuth()

  const signUp = async ({ name, email, password }: ISignUp) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const user = response.user as any
      const uid = user.uid
      const expirationTime = new Date(user.stsTokenManager.expirationTime)
      const timeLeft = (expirationTime.getTime() - new Date().getTime()) / 1000

      const authInfo: IAuth = {
        id: 1,
        token: user.accessToken,
        expirationTime: expirationTime.toISOString(),
        timeLeft: timeLeft.toString(),
      }
      addAuthInfoDB(authInfo)

      setUid(uid)

      autoRefreshUserToken(timeLeft)
    } catch (error) {
      if (error instanceof Error) {
        console.log(error)

        setError('Пользователь уже существует')
      }
    }
  }

  const signIn = async ({ email, password }: ISignIn) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      const user = response.user as any
      const uid = user.uid
      const expirationTime = new Date(user.stsTokenManager.expirationTime)
      const timeLeft = (expirationTime.getTime() - new Date().getTime()) / 1000

      const authInfo: IAuth = {
        id: 1,
        token: user.accessToken,
        expirationTime: expirationTime.toISOString(),
        timeLeft: timeLeft.toString(),
      }
      addAuthInfoDB(authInfo)
      setUid(uid)
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
        setUid('')
        clearAuthInfoDB()
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid
        setUid(uid)
      }
    })
  }

  const logoutFirebase = () => {
    console.log('logout')
    clearAuthInfoDB()
    clearNotesDB()
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
        const uid = user.uid
        const expirationTime = new Date(user.stsTokenManager.expirationTime)

        const timeLeft =
          (expirationTime.getTime() - new Date().getTime()) / 1000

        const authInfo: IAuth = {
          id: 1,
          token: user.accessToken,
          expirationTime: expirationTime.toISOString(),
          timeLeft: timeLeft.toString(),
        }
        updateAuthInfoDB(authInfo)
        setUid(uid)
        autoRefreshUserToken(timeLeft)
      })
      .catch(function (error) {
        console.log('---!!!---Error refreshUserToken', error)
      })
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      refreshUserToken()
      autoLoginFirebase()
    }
  })

  const autoLoginFirebase = async () => {
    const authInfo = await getAuthInfoDB()
    const token = authInfo?.token

    if (token) {
      const time = authInfo.expirationTime
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
    uid,
    getCurrentUser,
    signUp,
    signIn,
    signOutUser,
    error,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
