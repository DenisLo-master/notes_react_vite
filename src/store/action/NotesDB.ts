import { Dexie, Table } from 'dexie'
import { Note, UpdateNote } from '../../interfaces/NoteProps'

export class NotesDB extends Dexie {
  notes!: Table<Note>

  constructor() {
    super('MyNotes')
    this.version(1).stores({
      notes: 'id, title, body,created_at,updated_at', // Primary key and indexed props
    })
  }
  updateNote(note: UpdateNote) {
    return this.notes.update(note.id, note)
  }
  deleteNote(id: number) {
    return this.notes.delete(id)
  }
  createNote(note: Note) {
    return this.notes.add(note)
  }
}

export const db = new NotesDB()
