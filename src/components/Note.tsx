import { FC, useState, useRef } from 'react'
import { NoteProps } from '../interfaces/NoteProps'
import { updateNotes } from '../store/action/UpdateLocalDB'
import { setNotesToFirebase } from '../store/action/firebaseExchange'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/action/NotesDB'

const Note: FC<NoteProps> = ({
  title,
  created_at,
  additionalText,
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
    if (inputRef.current) {
      // console.log(inputRef.current.getAttribute('id'))
    }
  }
  const handleSaveTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    //console.log(value)

    setNoteTitle(value)
    if (inputRef.current) {
      const id = inputRef.current.getAttribute('id')
      updateNotes(Number(id), { title: value })
      //получаем записи из IndexedDB
      //const notesListFromIDB = useLiveQuery(() => db.notes.toArray())

      //setNotesToFirebase({ user: 'denis.lkg@gmail.com', notes: notesListFromIDB })
    }
  }
  //console.log(notesListFromIDB)

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
