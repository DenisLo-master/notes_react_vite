import { ImageProps } from '../../interfaces/ImageProps'
import { db } from './indexDB'

interface AddImageFile {
    uid: string
    noteId: number
    image: ImageProps
}

interface DeleteImageFile extends DeleteNoteImage {
    fileName: string
}

interface DeleteNoteImage {
    uid: string
    noteId: number
}

export async function addImageDB({ uid, noteId, image }: AddImageFile): Promise<void> {
    try {
        await db.addImage(uid, noteId, image)
    } catch (error) {
        console.log(error)
    }
}

export async function deleteImageDB({ uid, noteId, fileName }: DeleteImageFile): Promise<void> {
    try {
        await db.deleteImage(uid, noteId, fileName)
    } catch (error) {
        console.log(error)
    }
}

export async function deleteNoteImagesDB({ uid, noteId }: DeleteNoteImage): Promise<void> {
    try {
        await db.deleteNoteImages(uid, noteId)
    } catch (error) {
        console.log(error)
    }
}

export async function deleteAllImagesDB(): Promise<void> {
    try {
        await db.deleteAllImages()
    } catch (error) {
        console.log(error)
    }
}