export interface NoteProps {
  id: number
  title: string
  date: string
  additionalText?: string
  active?: boolean
  onClick?: () => void
  text: string
}

export interface Note {
  title: string
  body: string
  created_at: Date
  updated_at?: Date
}
