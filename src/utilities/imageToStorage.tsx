import React from 'react'
import { Note } from '../interfaces/NoteProps'
import { uploadFiles } from '../store/action/fbStorageExchange.ts';
import { deleteImageDB, getImageDB } from '../store/action/imageDB';
import { updateNoteDB } from '../store/action/notesDB';

interface ImageToStorageProps {
    uid: string
    note: Note
}

export async function imageToStorage({ uid, note }: ImageToStorageProps): Promise<boolean> {
    return new Promise(async (resolve) => {
        const newBody = document.createElement("div");
        newBody.innerHTML = note.body
        const imageArray = [...newBody.getElementsByTagName("img")]
        for (let i = 0; i < imageArray.length; i++) {
            const image = imageArray[i];
            if (image) {
                if (image.alt === "local" && image.title) {
                    const fileData = await getImageDB(
                        {
                            noteId: note.id,
                            fileName: image.title
                        })
                    console.log("fileData", fileData)
                    const fileBlob = fileData && dataURLtoBlob(fileData)
                    const link = fileBlob && await uploadFiles(
                        {
                            uid,
                            noteId: note.id,
                            fileName: image.title,
                            file: fileBlob
                        })
                    if (link) {
                        image.src = link
                        image.alt = "image"
                        deleteImageDB({ noteId: note.id, fileName: image.title })
                    } else {
                        const imageUrl = fileBlob && URL.createObjectURL(fileBlob)
                        if (imageUrl) {
                            image.src = imageUrl
                            resolve(false)
                        }
                    }
                }
            }
        }
        note.body = newBody.innerHTML
        await updateNoteDB({ ...note, sync: false })
        resolve(true)
    })
}


export function dataURLtoBlob(dataURL: string): Blob | null {
    const arr = dataURL.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        return null
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
}