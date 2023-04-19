import { Tooltip, Button, Text, TextInput } from '@mantine/core'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { modals } from '@mantine/modals'
import { IconSearch } from '@tabler/icons-react'
import { Dispatch, SetStateAction } from 'react'
import moment from 'moment'
import { NoteProps } from './../interfaces/NoteProps'
import { CreateNote } from '../store/action/CreateNote'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../store/action/NotesDB'

type HeaderType = {
  addItem: Dispatch<SetStateAction<NoteProps[]>>
}

const Header = ({ addItem }: HeaderType) => {
  const { visible, toggleVisibleSidebar } = useLayoutContext()
  const { activeNote } = useLayoutContext()
  const toggleVisibleHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    toggleVisibleSidebar()
  }
  //создание заметки
  const createNoteHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    const templateNote: NoteProps = {
      id: new Date().getTime(),
      body: 'Новая заметка',
      created_at: moment(new Date().getTime()).format('DD.MM.YYYY'),
      title: 'Новая заметка',
      additionalText: 'Новая заметка',
    }

    addItem((prev) => [...prev, templateNote])
    try {
      const CreatedNote = {
        id: templateNote.id,
        body: templateNote.body,
        created_at: templateNote.created_at,
        updated_at: templateNote.created_at,
        title: templateNote.title,
      }
      CreateNote(CreatedNote)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNoteHandler = () =>
    modals.openConfirmModal({
      title: 'Delete your note',
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to delete your note?</Text>
      ),
      labels: { confirm: 'Delete note', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        db.deleteNote(activeNote.id)
      },
    })
  const searchHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    console.log(value)
  }

  return (
    <div className="header">
      <div>
        <Tooltip label="Show/Hide sidebar">
          <Button
            variant="light"
            color="gray"
            style={{ margin: '0 10px' }}
            onClick={toggleVisibleHandle}
          >
            {visible ? 'Hide' : 'Show'} sidebar
          </Button>
        </Tooltip>
        <Tooltip label="Create note">
          <Button
            variant="light"
            color="gray"
            style={{ margin: '0 10px' }}
            onClick={createNoteHandle}
          >
            Create note
          </Button>
        </Tooltip>
        <Tooltip label="Delete note">
          <Button
            variant="light"
            color="gray"
            style={{ margin: '0 10px' }}
            onClick={deleteNoteHandler}
          >
            Delete note
          </Button>
        </Tooltip>
      </div>
      <div className="searchNode">
        <TextInput
          onChange={searchHandle}
          placeholder="Find note"
          rightSection={<IconSearch size="0.8rem" />}
        />
      </div>
    </div>
  )
}

export default Header
