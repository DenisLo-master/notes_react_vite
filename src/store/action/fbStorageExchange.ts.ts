import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
    listAll, deleteObject
} from "firebase/storage";
import { UserNoteID } from "./fbDataBaseExchange";
import { firebaseApp } from "../firebase.config";


interface UploadFilesProps {
    uid: string
    noteId: number
    fileName: string
    file: Blob
}
const storage = getStorage();


export const uploadFiles = ({ uid, noteId, fileName, file }: UploadFilesProps): Promise<string> => {
    return new Promise((resolve) => {

        console.log("++++", uid, noteId, fileName, file)
        if (!file) return;
        const storageRef = ref(storage, `/${uid}/${noteId}/${fileName}`);
        const uploadImg = uploadBytesResumable(storageRef, file);

        uploadImg.on(
            "state_changed",
            (snapshot) => {
                const prog =
                    Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                const fileState = {
                    imgName: file.name,
                    progress: prog,
                    totalSize: Math.round(snapshot.totalBytes / 1024),
                    isUpload: true
                };
            },
            (err) => {
                if (err) {
                    console.log(err);
                }
            },
            () =>
                getDownloadURL(uploadImg.snapshot.ref).then((url) => {
                    resolve(url)
                })
        );
    })
};

export async function deleteNoteImages({ uid, noteId }: UserNoteID) {
    try {
        const storage = getStorage(firebaseApp);
        const folderRef = ref(storage, `/${uid}/${noteId}`)
        const filesSnapshot = await listAll(folderRef);

        const filesPromises = filesSnapshot.items.map((item) => {
            return deleteObject(item);
        });
        await Promise.all(filesPromises);
        console.log(`Файлы заметок успешно удалены.`);
    } catch (error) {
        console.error(`Ошибка при удалении файлов  заметки:`, error);
    }
};