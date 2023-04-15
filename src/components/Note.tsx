import { FC } from 'react'
import { NoteProps } from '../interfaces/NoteProps'

const Note: FC<NoteProps> = ({
  title,
  date,
  additionalText,
  active,
  onClick,
}) => {
  return (
    <div onClick={onClick} className={` ${active ? 'note-active' : ''}`}>
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
