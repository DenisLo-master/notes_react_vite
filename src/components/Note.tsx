import { FC, useState, useRef } from 'react'
import { NoteProps } from '../interfaces/NoteProps'
import { updateNoteTitle } from '../store/action/actionslDB'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/action/NotesDB'

const Note: FC<NoteProps> = ({
  title,
  created_at,
  body,
  active,
  onClick,
  id,
}) => {
  const [noteTitle, setNoteTitle] = useState<string>(title)
  const inputRef = useRef<HTMLInputElement>(null)

  //получаем записи из IndexedDB
  const notesListFromIDB = useLiveQuery(() => db.notes.toArray())

  const handlechangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setNoteTitle(value)
  }
  const handleSaveTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setNoteTitle(value)
    if (inputRef.current) {
      const id = Number(inputRef.current.getAttribute('id'))
      updateNoteTitle({
        id,
        title: value,
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
            onChange={handlechangeTitle}
            value={noteTitle}
            placeholder={'Новая заметка'}
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
