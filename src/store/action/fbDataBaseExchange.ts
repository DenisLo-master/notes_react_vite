import {
  ref,
  getDatabase,
  child,
  get,
  push,
  set,
  remove,
} from 'firebase/database'
import { firebaseApp } from '../firebase.config'
import { Note, NoteFB } from '../../interfaces/NoteProps'
import { db } from './indexDB'
import { getNoteDB } from './notesDB'
import { imageToStorage } from '../../utilities/imageToStorage'
import { deleteNoteImagesDB } from './imageDB'

const dbFireBase = getDatabase(firebaseApp)

export interface UserNoteID {
  uid: string
  noteId: number
}
interface Updates {
  [key: string]: NoteFB
}

interface NoteHash {
  [key: string]: Note
}
interface IdNoteHash {
  [key: string]: NoteHash
}

export async function setNoteToFirebase({ uid, noteId }: UserNoteID) {
  try {
    if (!uid || !noteId) throw new Error
    const tempNote = await getNoteDB(noteId)
    if (!tempNote || tempNote.sync) return
    const sync = await imageToStorage({ uid, note: tempNote })
    const note = await getNoteDB(noteId)
    if (!note) return
    const noteFB = {
      id: note.id,
      title: note.title ? note.title : "Новая заметка",
      body: note.body,
      created_at: note.created_at,
      updated_at: note.updated_at,
    }
    const newHashKey = push(child(ref(dbFireBase), `/notes_data/${uid}/notes/${note.id}`)).key
    if (!newHashKey) return
    const updates: Updates = {}
    updates[newHashKey] = noteFB
    await set(ref(dbFireBase, `/notes_data/${uid}/notes/${note.id}/`), updates)
    db.setNoteSync(note.id, sync)
  } catch (err) {
    console.error('Error setNoteToFirebase', uid, err)
  }
}

export async function getNotesFromFirebase(uid: string): Promise<Note[] | undefined> {
  try {
    if (!uid) throw new Error
    const snapshot = await get(
      child(ref(dbFireBase), `/notes_data/${uid}/notes/`),
    )
    if (snapshot.exists()) {
      const listNotesWithHash: IdNoteHash = snapshot.val()
      let notesList: Note[] = []

      Object.keys(listNotesWithHash).forEach((noteId) => {
        const noteValue = listNotesWithHash[noteId]
        const note = Object.values(noteValue)[0]
        notesList.push(note)
      })
      return notesList
    }
  } catch (err) {
    console.error('Error getNotesFromFirebase', uid, err)
  }
}

export async function getNoteIdFromFirebase({
  uid,
  noteId,
}: UserNoteID): Promise<Note | undefined> {
  try {
    if (!uid || !noteId) throw new Error
    const snapshot = await get(
      child(ref(dbFireBase), `/notes_data/${uid}/notes/${noteId}`),
    )

    if (snapshot.exists()) {
      const hash = Object.keys(snapshot.val())[0]
      const note: Note = snapshot.val()[hash]
      return note
    }
  } catch (err) {
    console.error('Error getNoteIdFromFirebase', uid, err)
  }
}

export async function deleteNoteFromFirebase({
  uid,
  noteId,
}: UserNoteID): Promise<void> {
  try {
    if (!uid || !noteId) throw new Error
    remove(child(ref(dbFireBase), `/notes_data/${uid}/notes/${noteId}`))
    deleteNoteImagesDB(noteId)
  } catch (err) {
    console.error('Error deleteNoteFromFirebase', uid, err)
  }
}
