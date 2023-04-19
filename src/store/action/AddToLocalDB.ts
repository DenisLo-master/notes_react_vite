import { db } from './NotesDB'
import { Note } from '../../interfaces/NoteProps'

export async function addNotes(note: Note): Promise<void> {
  try {
    await db.createNote({
      id: note.id,
      body: note.body,
      title: note.title,
      created_at: new Date().toString(),
      updated_at: new Date().toString(),
    })
  } catch (error) {
    console.log(error)
  }
}
