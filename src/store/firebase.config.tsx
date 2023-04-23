import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import { getDatabase } from 'firebase/database'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAEaOGPrYjbM0ko9Ch208YA4lAbFJCqwew',
  authDomain: 'notes-3f0e5.firebaseapp.com',
  databaseURL: 'https://notes-3f0e5-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'notes-3f0e5',
  storageBucket: "notes-3f0e5.appspot.com",
  messagingSenderId: '743950442941',
  appId: '1:743950442941:web:0c59b0874b641417ab72d4',
}

export const firebaseApp = firebase.initializeApp(firebaseConfig)
export const auth = firebaseApp.auth()

export const dataBase = getDatabase(firebaseApp)
