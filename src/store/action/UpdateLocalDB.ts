import { db } from './NotesDB'
import { Note } from '../../interfaces/NoteProps'

type keyNote = keyof Note

type updateNote = {
  [keys in keyNote]?: string
}

export async function updateNotes(key: number, note: updateNote): Promise<void> {
  try {
    await db.notes.update(key, note)
  } catch (error) {
    console.log(error)
  }
}
