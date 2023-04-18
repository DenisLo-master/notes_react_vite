import { FC } from 'react'
import { NoteProps } from '../interfaces/NoteProps'

const Note: FC<NoteProps> = ({
  title,
  created_at,
  additionalText,
  active,
  onClick,
  id,
}) => {
  return (
    <div onClick={onClick} className={` ${active ? 'note-active' : ''}`}>
      <div className="note">
        <span>
          <input
            style={{ fontWeight: 'bold', border: 'none' }}
            onChange={() => {}}
            value={title}
            id={id.toString()}
          />
          {/* <b>{title}</b> */}
        </span>
        <div>
          {created_at} <span>{additionalText}</span>
        </div>
      </div>
    </div>
  )
}

export default Note
