import { db } from './NotesDB'
import { UpdateNote } from '../../interfaces/NoteProps'

export async function updateNotes(note: UpdateNote): Promise<void> {
  try {
    console.log('Updating notes-------', note)
    await db.updateNote(note)
  } catch (error) {
    console.log(error)
  }
}


