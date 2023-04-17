import { Dexie, Table } from 'dexie'
import { Note } from '../../interfaces/NoteProps'

export class NotesDB extends Dexie {
  notes!: Table<Note>

  constructor() {
    super('MyNotes')
    this.version(1).stores({
      notes: '++id, title, body,created_at,updated_at', // Primary key and indexed props
    })
  }
}

export const db = new NotesDB()
