import { db } from './NotesDB'
import { Note, UpdateNote, UpdateNoteTitle } from '../../interfaces/NoteProps'

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
