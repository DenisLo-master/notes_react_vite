import { FC, useState, useRef } from 'react'
import { NoteProps } from '../interfaces/NoteProps'
import { updateNote } from '../store/action/actionslDB'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/action/NotesDB'
import { setNoteToFirebase } from '../store/action/firebaseExchange'
import { useAuth } from '../context/AuthProvider'

const Note: FC<NoteProps> = ({ title, created_at, body, active, onClick, id }) => {
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
      updateNote({
        id,
        title: value,
        updated_at: new Date().toDateString(),
      })
      setNoteToFirebase({
        uid: currentUserId,
        noteId: id,
      })
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
            id={id.toString()}
          />
        </span>
        <div>
          {created_at} <span>{body.substring(0, 10)}</span>
        </div>
      </div>
    </div>
  )
}

export default Note
