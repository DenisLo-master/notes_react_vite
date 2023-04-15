export interface NoteProps {
  id: number
  title: string
  date: string
  additionalText?: string
  active?: boolean
  onClick?: () => void
}
