import { db } from './NotesDB'
import { UpdateNote } from '../../interfaces/NoteProps'

export async function updateNotes(note: UpdateNote): Promise<void> {
  try {
    await db.updateNote(note)
  } catch (error) {
    console.log(error)
  }
}
