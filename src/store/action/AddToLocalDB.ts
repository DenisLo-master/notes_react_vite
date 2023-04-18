import { db } from './NotesDB'
import { Note } from '../../interfaces/NoteProps'

export async function addNotes(note: Note): Promise<void> {
  try {
    await db.notes.add({
      id: note.id,
      body: note.body,
      title: note.title,
      created_at: new Date(),
      updated_at: new Date(),
    })
  } catch (error) {
    console.log(error)
  }
}
