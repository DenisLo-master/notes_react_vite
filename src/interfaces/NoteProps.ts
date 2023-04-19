export interface Note {
  id: number
  title: string
  body: string
  created_at: string
  updated_at: string
}


export interface NoteProps extends Note {
  additionalText?: string
  active?: boolean
  onClick?: () => void
}

export type UpdateNote = {
  id: number
  title: string
  body: string
  updated_at: string
}
