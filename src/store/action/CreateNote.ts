import { db } from './NotesDB'
import { Note } from '../../interfaces/NoteProps'

export async function CreateNote(note: Note): Promise<void> {
  try {
    await db.createNote({
      id: note.id,
      body: note.body,
      title: note.title,
      created_at: new Date().getTime().toString(),
      updated_at: new Date().getTime().toString(),
    })
  } catch (error) {
    console.log(error)
  }
}
