import { ref, getDatabase, child, get, push, set } from 'firebase/database'
import { auth, firebaseApp } from '../firebase.config'
import { Note } from '../../interfaces/NoteProps'
import { useAuth } from '../../context/AuthProvider'

const db = getDatabase(firebaseApp)

interface UserNotes {
    uid: string
    note: Note
}
interface Updates {
    [key: string]: Note
}

export async function setNotesToFirebase({ uid, note }: UserNotes) {

    try {
        const newHashKey = push(child(ref(db), `/notes_data/${uid}/notes/${note.id}`)).key
        if (!newHashKey) return
        const updates: Updates = {}
        updates[newHashKey] = note
        console.log(updates)
        await set(ref(db, `/notes_data/${uid}/notes/`), updates)
    } catch (err) {
        console.error('Error setNotesToFirebase', uid, err)
    }

}

export async function getNotesFromFirebase(uid: string): Promise<Note[] | undefined> {
    try {
        const snapshot = await get(child(ref(db), `/notes_data/${uid}/notes/`))

        if (snapshot.exists()) {
            const hash = Object.keys(snapshot.val())[0]
            const notes: Note[] = snapshot.val()[hash]
            console.log('Notes', notes)
            return notes
        }
    } catch (err) {
        console.error('Error getNotesFromFirebase', uid, err)

    }
}
