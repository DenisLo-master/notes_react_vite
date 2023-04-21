import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";


interface UploadFilesProps {
    uid: string
    noteId: number
    fileName: string
    file: Blob
}

export const uploadFiles = ({ uid, noteId, fileName, file }: UploadFilesProps): Promise<string> => {
    return new Promise((resolve) => {
        if (!file) return;
        const storage = getStorage();
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
                // dispatch(setImageState(fileState));
            },
            (err) => {
                if (err) {
                    console.log(err);
                    //   dispatch(setSyncNoteError(imgName,err));
                }
            },
            () =>
                getDownloadURL(uploadImg.snapshot.ref).then((url) => {
                    const fileState = {
                        imgName: file.name,
                        progress: 100,
                        totalSize: Math.round(uploadImg.snapshot.totalBytes / 1024),
                        url,
                        isUpload: false
                    };
                    //  dispatch(setImageState(fileState));
                    // dispatch(setImageUrl(imgName,url));
                    resolve(url)
                })
        );
    })
};