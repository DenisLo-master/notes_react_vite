import {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
} from "firebase/storage";




export const uploadFiles = (noteId: number, file: File) => {
    if (!file) return;
    const storage = getStorage();
    const uid = 'sfsfsfds'
    const storageRef = ref(storage, `/${uid}/${noteId}/${file.name}`);
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
            })
    );
};