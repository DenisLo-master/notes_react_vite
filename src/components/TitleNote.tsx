import { FC, useState, useRef } from 'react'
import { NoteProps } from '../interfaces/NoteProps'
import { updateNoteTitleDB } from '../store/action/noteDB'
import { setNoteToFirebase } from '../store/action/fbDataBaseExchange'
import { useAuth } from '../context/AuthProvider'

export const TitleNote: FC<NoteProps> = ({
  title,
  created_at,
  body,
  sync,
  additionalText,
  active,
  onClick,
  id,
}) => {
  const { uid } = useAuth()
  const [noteTitle, setNoteTitle] = useState<string>(title)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setNoteTitle(value)
  }
  const handleSaveTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setNoteTitle(value)
    if (inputRef.current) {
      const id = Number(inputRef.current.getAttribute('id'))
      updateNoteTitleDB(
        {
          uid,
          noteTitle: { id, title: value }
        }
      )
    }
  }


  return (
    <div onClick={onClick} className={` ${active ? 'note-active' : ''}`}>
      <div className="note">
        <span>
          <input
            onBlur={handleSaveTitle}
            ref={inputRef}
            style={{ fontWeight: 'bold', border: 'none', background: 'none' }}
            onChange={handleChangeTitle}
            value={noteTitle}
            placeholder={'Новая заметка'}
            id={id.toString()}
          />
        </span>
        <div>
          {created_at} <span>{additionalText}</span>
        </div>
      </div>
    </div>
  )
}

