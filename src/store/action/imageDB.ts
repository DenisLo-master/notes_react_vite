import { ImageProps } from '../../interfaces/ImageProps'
import { db } from './indexDB'

interface AddImageFile {
    noteId: number
    image: ImageProps
}

interface ImageFileName {
    noteId: number
    fileName: string
}

export async function addImageDB({ noteId, image }: AddImageFile): Promise<void> {
    try {
        await db.addImage(noteId, image)
    } catch (error) {
        console.log(error)
    }
}

export async function getImageDB({ noteId, fileName }: ImageFileName): Promise<string | undefined> {
    try {
        const result = await db.getImage(noteId, fileName)
        return result[0].fileData
    } catch (error) {
        console.log(error)
    }
}

export async function deleteImageDB({ noteId, fileName }: ImageFileName): Promise<void> {
    try {
        await db.deleteImage(noteId, fileName)
    } catch (error) {
        console.log(error)
    }
}

export async function deleteNoteImagesDB(noteId: number): Promise<void> {
    try {
        await db.deleteNoteImages(noteId)
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