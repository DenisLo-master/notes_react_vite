import { db } from './NotesDB'
import { Note } from '../../interfaces/NoteProps'

export async function addNotes(notes: Note[]): Promise<void> {
  try {
    await notes.map((note) =>
      db.notes.add({
        body: note.body,
        title: note.title,
        created_at: new Date(),
        updated_at: new Date(),
      }),
    )
  } catch (error) {
    console.log(error)
  }
}
