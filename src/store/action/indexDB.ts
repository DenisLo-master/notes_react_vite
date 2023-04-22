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
      localImg: '++id, uid, noteId, fileName,fileData',
    })
  }

  getAuthInfo(authId: number) {
    return this.auth.get(authId)
  }
  createAuth(auth: IAuth) {
    return this.auth.add(auth)
  }
  updateAuth(auth: IAuth) {
    return this.auth.update(1, auth)
  }


  setNoteSync(noteId: number, sync: boolean = true) {
    return this.notes.update(noteId, { sync })
  }

  updateNote(note: UpdateNote, sync: boolean = false) {
    return this.notes.update(note.id, { ...note, sync })
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

  getNotesList() {
    return this.notes.toArray()
  }

  clearNotes() {
    return this.notes.clear()
  }



  addImage(uid: string, noteId: number, image: ImageProps) {
    return this.localImg.add({ uid, noteId, ...image })
  }

  deleteImage(uid: string, noteId: number, fileName: string) {
    return this.localImg.where("uid")
      .equals(uid)
      .and((item1) => item1.noteId === noteId)
      .and((item2) => item2.fileName === fileName)
      .delete()
  }

  deleteNoteImages(uid: string, noteId: number) {
    return this.localImg.where("uid")
      .equals(uid)
      .and((item) => item.noteId === noteId)
      .delete()
  }

  deleteAllImages() {
    return this.localImg.clear()
  }


}

export const db = new NotesDB()
