import { Dexie, Table } from 'dexie'
import {
  Note,
  NoteTitle,
  UpdateNote,
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

  async getAuthInfo() {
    return await this.auth.toArray()
  }

  async addAuthInfo(auth: IAuth) {
    return await this.auth.add(auth)
  }

  async updateAuth(auth: IAuth) {
    return await this.auth.update(1, auth)
  }


  async setNoteSync(noteId: number, sync: boolean = true) {
    return await this.notes.update(noteId, { sync })
  }

  async updateNote(note: UpdateNote) {
    return await this.notes.update(note.id, note)
  }

  async updateNoteTitle(note: NoteTitle) {
    return await this.notes.update(note.id, { title: note.title })
  }

  async deleteNote(id: number) {
    return await this.notes.delete(id)
  }

  async createNote(note: Note) {
    return await this.notes.add(note)
  }

  async getNote(noteId: number) {
    return await this.notes.get(noteId)
  }

  async getNotesList() {
    return await this.notes.toArray()
  }

  async clearNotes() {
    return await this.notes.clear()
  }



  async addImage(noteId: number, image: ImageProps) {
    return await this.localImg.add({ noteId, ...image })
  }

  async getImage(noteId: number, fileName: string) {
    return await this.localImg.where("noteId")
      .equals(noteId)
      .and((item) => item.fileName === fileName)
      .toArray()
  }

  async deleteImage(noteId: number, fileName: string) {
    return await this.localImg.where("noteId")
      .equals(noteId)
      .and((item) => item.fileName === fileName)
      .delete()
  }

  async deleteNoteImages(noteId: number) {
    return await this.localImg.where("noteId")
      .equals(noteId)
      .delete()
  }

  async deleteAllImages() {
    return await this.localImg.clear()
  }


}

export const db = new NotesDB()
