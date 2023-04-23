import { Tooltip, Button, Text, TextInput, Flex } from '@mantine/core'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { modals } from '@mantine/modals'
import { IconLogout, IconSearch } from '@tabler/icons-react'
import { Dispatch, SetStateAction } from 'react'
import moment from 'moment'
import { Note, NoteProps } from '../interfaces/NoteProps'
import { useAuth } from '../context/AuthProvider'
import { createStyles, Header, Group, rem, em } from '@mantine/core'
import { createNoteDB, deleteNoteDB } from '../store/action/noteDB'

const useStyles = createStyles((theme) => ({
  header: {
    paddingTop: rem(5),
    paddingBottom: rem(5),
    minheight: rem(56),
  },

  inner: {
    minHeight: rem(56),
    display: 'flex',
    gap: rem(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    [`@media (max-width: ${em(800)})`]: {
      flexDirection: 'column-reverse',
    },
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
  span: {
    marginLeft: '0.3rem',
    [`@media (max-width: ${em(700)})`]: {
      display: 'none',
    },
  },
  textInput: {
    width: '100%',
  },
  group: {
    flexWrap: 'nowrap',
    width: '100%',
    [`@media (min-width: ${em(800)})`]: {
      flex: '1 1 50%',
    },
  },
  button: {
    [`@media (max-width: ${em(900)})`]: {
      fontSize: '13px',
    },
  },
}))

type HeaderType = {
  setList: Dispatch<SetStateAction<NoteProps[]>>
  uid: string
  searchText: (text: string) => void
}

export const HeaderSearch = ({ setList, searchText, uid }: HeaderType) => {
  const { classes } = useStyles()

  const { visible, toggleVisibleSidebar, visibleSidebar } = useLayoutContext()
  const { activeNote, setActiveNote } = useLayoutContext()
  const { signOutUser } = useAuth()
  const toggleVisibleHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    toggleVisibleSidebar()
  }
  //создание заметки
  const createNoteHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    visibleSidebar()
    try {
      const createdNote: Note = {
        id: new Date().getTime(),
        body: '',
        created_at: moment(new Date().getTime()).format('DD.MM.YYYY, HH:mm'),
        updated_at: moment(new Date().getTime()).format('DD.MM.YYYY, HH:mm'),
        title: '',
        sync: false,
      }

      createNoteDB({ uid, note: createdNote })
      const activeNote: NoteProps = {
        ...createdNote,
        additionalText: '',
        active: true,
      }
      setActiveNote(activeNote)
      setList((prev) => [...prev, activeNote])
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNoteHandler = () => {
    if (!activeNote?.id) return
    modals.openConfirmModal({
      title: 'Delete your note',
      centered: true,
      children: <Text size='sm'>Are you sure you want to delete your note?</Text>,
      labels: { confirm: 'Delete note', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        deleteNoteDB({ uid, noteId: activeNote.id })
        setActiveNote(null)
      },
    })
  }
  const searchHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    searchText(value)
  }

  return (
    <Header height='100%' className={classes.header}>
      <Flex justify='space-between' align='center' className={classes.inner}>
        <Group className={classes.group} spacing='xs'>
          <Tooltip label='Show/Hide sidebar'>
            <Button className={classes.button} compact variant='outline' onClick={toggleVisibleHandle}>
              {visible ? 'Hide' : 'Show'} sidebar
            </Button>
          </Tooltip>

          <Tooltip label='Create note'>
            <Button className={classes.button} compact variant='outline' onClick={createNoteHandle}>
              Create note
            </Button>
          </Tooltip>

          <Tooltip label='Delete note'>
            <Button className={classes.button} compact variant='outline' onClick={deleteNoteHandler}>
              Delete note
            </Button>
          </Tooltip>
        </Group>

        <Group className={classes.group} spacing='xs' align='center'>
          <TextInput
            className={classes.textInput}
            onChange={searchHandle}
            placeholder='Find note'
            rightSection={<IconSearch size='0.8rem' />}
          />
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
