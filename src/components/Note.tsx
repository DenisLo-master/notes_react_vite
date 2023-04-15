import { FC } from 'react'

interface NoteProps {
  id: number
  title: string
  date: string
  additionalText?: string
  active?: boolean
  onClick?: () => void
}

const Note: FC<NoteProps> = ({ title, date, additionalText, active }) => {
  return (
    <div className={` ${active ? 'note-active' : ''}`}>
      <div className="note">
        <span>
          <b>{title}</b>
        </span>
        <div>
          {date} <span>{additionalText}</span>
        </div>
      </div>
    </div>
  )
}

export default Note
