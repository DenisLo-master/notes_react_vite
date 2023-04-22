import { Dexie, Table } from 'dexie'
import {
  Note,
  UpdateNote,
  UpdateNoteTitle,
} from '../../interfaces/NoteProps'
import { IAuth } from '../../interfaces/LoginTypes'
import { ImageLocal, ImageProps } from '../../interfaces/ImageProps'

export class NotesDB extends Dexie {
  notes!: Table<Note>
  auth!: Table<IAuth>
  localImg!: Table<ImageLocal>

  constructor() {
    super('MyNotes')
    this.version(1).stores({
      notes: 'id, title, body,created_at,updated_at,sync', // Primary key and indexed props
      auth: 'id, token, expirationTime, timeLeft',
      localImg: '++id, noteId, fileName,fileData',
    })
  }

  getAuthInfo() {
    return this.auth.toArray()
  }

  addAuthInfo(auth: IAuth) {
    return this.auth.add(auth)
  }

  updateAuth(auth: IAuth) {
    return this.auth.update(1, auth)
  }


  setNoteSync(noteId: number, sync: boolean = true) {
    return this.notes.update(noteId, { sync })
  }

  updateNote(note: UpdateNote) {
    return this.notes.update(note.id, note)
  }

  updateNoteTitle(note: UpdateNoteTitle) {
    return this.notes.update(note.id, { title: note.title })
  }

  deleteNote(id: number) {
    return this.notes.delete(id)
  }

  createNote(note: Note) {
    return this.notes.add(note)
  }

  getNote(noteId: number) {
    return this.notes.get(noteId)
  }

  getNotesList() {
    return this.notes.toArray()
  }

  clearNotes() {
    return this.notes.clear()
  }



  addImage(noteId: number, image: ImageProps) {
    return this.localImg.add({ noteId, ...image })
  }

  getImage(noteId: number, fileName: string) {
    return this.localImg.where("noteId")
      .equals(noteId)
      .and((item) => item.fileName === fileName)
      .toArray()
  }

  deleteImage(noteId: number, fileName: string) {
    return this.localImg.where("noteId")
      .equals(noteId)
      .and((item) => item.fileName === fileName)
      .delete()
  }

  deleteNoteImages(noteId: number) {
    return this.localImg.where("noteId")
      .equals(noteId)
      .delete()
  }

  deleteAllImages() {
    return this.localImg.clear()
  }


}

export const db = new NotesDB()
