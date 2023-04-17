export interface NoteProps {
  id: number
  title: string
  date: string
  additionalText?: string
  active?: boolean
  onClick?: () => void
  body: string
}

export interface Note {
  id: number
  title: string
  body: string
  created_at: Date
  updated_at?: Date
}
