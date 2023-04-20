import { Dexie, Table } from 'dexie'
import { Note, UpdateNote, UpdateNoteTitle } from '../../interfaces/NoteProps'

export class NotesDB extends Dexie {
  notes!: Table<Note>

  constructor() {
    super('MyNotes')
    this.version(1).stores({
      notes: 'id, title, body,created_at,updated_at,sync', // Primary key and indexed props
    })
  }
  setNoteSync(noteId: number) {
    return this.notes.update(noteId, { sync: true })
  }

  updateNote(note: UpdateNote) {
    return this.notes.update(note.id, { ...note, sync: false })
  }
  updateNoteTitle(note: UpdateNoteTitle) {
    return this.notes.update(note.id, { title: note.title })
  }

  deleteNote(id: number) {
    return this.notes.delete(id)
  }

  createNote(note: Note) {
    return this.notes.add({ ...note, sync: false })
  }

  getNote(noteId: number) {
    return this.notes.get(noteId)
  }
}

export const db = new NotesDB()
