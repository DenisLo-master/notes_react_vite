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
import { Note } from '../../interfaces/NoteProps'
import { db } from './indexDB'
import { getNote } from './notesDB'
import { imageToStorage } from '../../utilities/saveImage'
import { deleteNoteImagesDB } from './imageDB'

const dbFireBase = getDatabase(firebaseApp)

export interface UserNoteID {
  uid: string
  noteId: number
}
interface Updates {
  [key: string]: Note
}

interface NoteHash {
  [key: string]: Note
}

export async function setNoteToFirebase({ uid, noteId }: UserNoteID) {
  try {
    const tempNote = await getNote(noteId)
    console.log("tempNote", tempNote)
    if (!tempNote || tempNote.sync) return
    const sync = await imageToStorage({ uid, note: tempNote })
    const note = await getNote(noteId)
    if (!note) return
    const noteFB = {
      id: note.id,
      title: note.title,
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

export async function getNotesFromFirebase(
  uid: string,
): Promise<Note[] | undefined> {
  try {
    const snapshot = await get(
      child(ref(dbFireBase), `/notes_data/${uid}/notes/`),
    )
    if (snapshot.exists()) {
      const listNotesWithHash: NoteHash[] = snapshot.val()
      let notesList: Note[] = []
      listNotesWithHash.length &&
        listNotesWithHash.forEach((noteHash: NoteHash) => {
          const noteValue = Object.values(noteHash)
          if (noteValue.length) return
          const note = noteValue[0]
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
    const snapshot = await get(
      child(ref(dbFireBase), `/notes_data/${uid}/notes/${noteId}`),
    )

    if (snapshot.exists()) {
      const hash = Object.keys(snapshot.val())[0]
      const note: Note = snapshot.val()[hash]
      console.log('Note', note)
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
    remove(child(ref(dbFireBase), `/notes_data/${uid}/notes/${noteId}`))
    deleteNoteImagesDB({ uid, noteId })
  } catch (err) {
    console.error('Error deleteNoteFromFirebase', uid, err)
  }
}
