import { FC, useState, useRef } from 'react'
import { NoteProps } from '../interfaces/NoteProps'
import { updateNoteTitle } from '../store/action/actionslDB'
import { setNoteToFirebase } from '../store/action/firebaseExchange'
import { useAuth } from '../context/AuthProvider'

const Note: FC<NoteProps> = ({
  title,
  created_at,
  body,
  active,
  onClick,
  id,
}) => {
  const { currentUserId } = useAuth()
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
      updateNoteTitle({ id, title: value })

      setNoteToFirebase({
        uid: currentUserId,
        noteId: id,
      })
    }
  }

  const getTextFromHtml = (html: string) => {
    var tempElement = document.createElement('div')
    tempElement.innerHTML = html
    return tempElement.textContent?.substring(0, 10)
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
          {created_at} <span>{getTextFromHtml(body)}</span>
        </div>
      </div>
    </div>
  )
}

export default Note
