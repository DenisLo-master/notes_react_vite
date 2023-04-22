export interface ImageProps {
  fileName: string
  fileData: string
}

export interface ImageLocal extends ImageProps {
  uid: string
  noteId: number
}

