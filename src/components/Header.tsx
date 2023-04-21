import { Tooltip, Button, Text, TextInput, Flex } from '@mantine/core'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { modals } from '@mantine/modals'
import { IconLogout, IconSearch } from '@tabler/icons-react'
import { Dispatch, SetStateAction } from 'react'
import moment from 'moment'
import { NoteProps } from './../interfaces/NoteProps'
import { db } from '../store/action/NotesDB'
import { addNote } from '../store/action/actionslDB'
import { deleteNoteFromFirebase } from '../store/action/firebaseExchange'
import { useAuth } from '../context/AuthProvider'
import { createStyles, Header, Group, rem } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },

  inner: {
    minHeight: rem(56),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  search: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },
}))

interface HeaderSearchProps {
  links: { link: string; label: string }[]
}

type HeaderType = {
  addItem: Dispatch<SetStateAction<NoteProps[]>>
  currentUserId: string
  searchText: (text: string) => void
}

export const HeaderSearch = ({ addItem, searchText, currentUserId }: HeaderType) => {
  const { classes } = useStyles()

  const { visible, toggleVisibleSidebar } = useLayoutContext()
  const { activeNote } = useLayoutContext()
  const { signOutUser } = useAuth()
  const toggleVisibleHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    toggleVisibleSidebar()
  }
  //создание заметки
  const createNoteHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    const templateNote: NoteProps = {
      id: new Date().getTime(),
      body: '',
      created_at: moment(new Date().getTime()).format('DD.MM.YYYY, HH:mm'),
      updated_at: moment(new Date().getTime()).format('DD.MM.YYYY, HH:mm'),
      title: '',
      additionalText: '',
      active: true,
    }
    localStorage.setItem('activeNote', templateNote.id.toString())
    addItem((prev) => [...prev, templateNote])
    try {
      const CreatedNote = {
        id: templateNote.id,
        body: templateNote.body,
        created_at: templateNote.created_at,
        updated_at: templateNote.created_at,
        title: templateNote.title,
      }
      addNote(CreatedNote)
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNoteHandler = () =>
    modals.openConfirmModal({
      title: 'Delete your note',
      centered: true,
      children: <Text size='sm'>Are you sure you want to delete your note?</Text>,
      labels: { confirm: 'Delete note', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        db.deleteNote(activeNote.id)
        deleteNoteFromFirebase({
          uid: currentUserId,
          noteId: activeNote.id,
        })
      },
    })
  const searchHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    searchText(value)
  }

  return (
    <Header height={56} className={classes.header}>
      <Flex justify='space-between' align='center' className={classes.inner}>
        <Group spacing='xs'>
          <Tooltip label='Show/Hide sidebar'>
            <Button compact variant='outline' onClick={toggleVisibleHandle}>
              {visible ? 'Hide' : 'Show'} sidebar
            </Button>
          </Tooltip>

          <Tooltip label='Create note'>
            <Button compact variant='outline' onClick={createNoteHandle}>
              Create note
            </Button>
          </Tooltip>

          <Tooltip label='Delete note'>
            <Button compact variant='outline' onClick={deleteNoteHandler}>
              Delete note
            </Button>
          </Tooltip>
        </Group>

        <Group spacing='xs' align='center'>
          <TextInput onChange={searchHandle} placeholder='Find note' rightSection={<IconSearch size='0.8rem' />} />
          <Tooltip label='Выход'>
            <Button compact onClick={signOutUser}>
              <IconLogout />
            </Button>
          </Tooltip>
        </Group>
      </Flex>
    </Header>
  )
}
