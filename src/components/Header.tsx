import {
  Tooltip,
  Button,
  Text,
  Input,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { modals } from '@mantine/modals'
import { IconSearch } from '@tabler/icons-react'

const Header = () => {
  const { visible, toggleVisibleSidebar } = useLayoutContext()

  const toggleVisibleHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    toggleVisibleSidebar()
  }
  const createNoteHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    modals.openConfirmModal({
      title: 'Create note',
      centered: true,
      children: (
        <>
          <Input placeholder="Note title" />{' '}
          <Textarea
            placeholder="Text"
            label="Autosize with no rows limit"
            autosize
            minRows={20}
          />
        </>
      ),
      labels: { confirm: 'Create note', cancel: 'Cansel' },
      confirmProps: { color: 'green' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => console.log('Confirmed'),
    })
  }
  const changeNoteHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    console.log('change note')
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
      onConfirm: () => console.log('Confirmed'),
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
        <Tooltip label="Change note">
          <Button
            variant="light"
            color="gray"
            style={{ margin: '0 10px' }}
            onClick={changeNoteHandle}
          >
            Change note
          </Button>
        </Tooltip>
      </div>
      <div className="searchNode">
        <TextInput
          onChange={searchHandle}
          placeholder="Find node"
          rightSection={<IconSearch size="0.8rem" />}
        />
      </div>
    </div>
  )
}

export default Header
