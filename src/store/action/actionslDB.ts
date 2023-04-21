import { db } from './NotesDB'
import {
  IAuth,
  Note,
  UpdateNote,
  UpdateNoteTitle,
} from '../../interfaces/NoteProps'

export async function updateNote(note: UpdateNote): Promise<void> {
  try {
    //console.log('Updating notes-------', note)
    await db.updateNote(note)
  } catch (error) {
    console.log(error)
  }
}
export async function updateNoteTitle(note: UpdateNoteTitle): Promise<void> {
  try {
    await db.updateNoteTitle(note)
  } catch (error) {
    console.log(error)
  }
}

export async function clearNotes(): Promise<void> {
  try {
    //console.log('clear notes-------')
    await db.notes.clear()
  } catch (error) {
    console.log('ERROR clear notes', error)
  }
}

export async function addNote(note: Note): Promise<void> {
  try {
    await db.createNote({
      id: note.id,
      body: note.body,
      title: note.title,
      created_at: note.created_at,
      updated_at: note.updated_at,
    })
  } catch (error) {
    console.log(error)
  }
}

export async function getNote(noteId: number): Promise<Note | undefined> {
  try {
    return await db.getNote(noteId)
  } catch (error) {
    console.log(error)
  }
}

export async function getAuthInfo(auth: IAuth): Promise<IAuth | undefined> {
  try {
    const result = await db.getAuthInfo(auth.id)
    return result
  } catch (error) {
    console.log(error)
  }
}
export async function addAuthInfo(auth: IAuth): Promise<void> {
  try {
    await db.createAuth(auth)
  } catch (error) {
    console.log(error)
  }
}
export async function updateAuthInfo(auth: IAuth): Promise<void> {
  try {
    await db.updateAuth(auth)
  } catch (error) {
    console.log(error)
  }
}
export async function clearAuthInfo(): Promise<void> {
  try {
    //console.log('clear notes-------')
    await db.auth.clear()
  } catch (error) {
    console.log('ERROR clear notes', error)
  }
}
export async function getNotesList(): Promise<Note[] | undefined> {
  try {
    return await db.getNotesList()
  } catch (error) {
    console.log(error)
  }
}
