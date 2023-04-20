import { db } from './NotesDB'
import { Note, UpdateNote } from '../../interfaces/NoteProps'
import moment from 'moment'



export async function updateNote(note: UpdateNote): Promise<void> {
  try {
    await db.updateNote(note)
  } catch (error) {
    console.log(error)
  }
}



export async function clearNotes(): Promise<void> {
  try {
    await db.notes.clear()
  } catch (error) {
    console.log("ERROR clear notes", error)
  }
}


export async function addNote(note: Note): Promise<void> {
  try {
    await db.createNote({
      id: note.id,
      body: note.body,
      title: note.title,
      created_at: new Date().toString(),
      updated_at: new Date().toString()
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