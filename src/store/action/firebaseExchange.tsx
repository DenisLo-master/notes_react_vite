import { ref, getDatabase, child, get, push, set } from 'firebase/database'
import { auth, firebaseApp } from '../firebase.config'
import { Note } from '../../interfaces/NoteProps'

const db = getDatabase(firebaseApp)

interface UserNotes {
  user: string
  notes: Note[]
}
interface Updates {
  [key: string]: Note[]
}

export async function setNotesToFirebase({ user, notes }: UserNotes) {
  try {
    //console.log('setNotesToFirebase--', user)
    //временно пока нет uid будет подставляться вместо userFB
    //const uid = user.replace(new RegExp('\\.', 'g'), '_')
    //const newHashKey = push(child(ref(db), `/notes_data/${uid}/notes`)).key
    const newHashKey = push(child(ref(db), `/notes_data/${user}/notes`)).key
    if (!newHashKey) return
    const updates: Updates = {}
    updates[newHashKey] = notes
    //console.log(updates)
    await set(ref(db, `/notes_data/${user}/notes/`), updates)
  } catch (err) {
    console.error('Error setNotesToFirebase', user, err)
  }
}

export async function getNotesFromFirebase(user: string) {
  try {
    //console.log('getNotesFromFirebase--', user)
    //const uid = user.replace(new RegExp('\\.', 'g'), '_')

    //console.log(uid)
    const snapshot = await get(child(ref(db), `/notes_data/${user}/notes/`))

    if (snapshot.exists()) {
      const hash = Object.keys(snapshot.val())[0]
      const notes = snapshot.val()[hash]
      //console.log('Notes', notes)
      return notes
    }
  } catch (err) {
    console.error('Error getNotesFromFirebase', user, err)
  }
}
