export interface NoteFB {
  id: number
  title: string
  body: string
  created_at: string
  updated_at: string
}
export interface Note extends NoteFB {
  sync: boolean
}

export interface NoteProps extends Note {
  additionalText?: string
  active?: boolean
  onClick?: () => void
}

export interface UpdateNote {
  id: number
  title?: string
  body?: string
  updated_at: string
  sync: boolean
}
export interface NoteTitle {
  id: number
  title: string
}

