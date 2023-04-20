import { FC, useEffect } from 'react'
import { useState } from 'react'
import { Container, ActionIcon } from '@mantine/core'
import { TextEditor } from './TextEditor'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { IconEdit } from '@tabler/icons-react'
import { updateNote } from '../store/action/actionslDB'
import { setNoteToFirebase } from '../store/action/firebaseExchange'
import { useAuth } from '../context/AuthProvider'

interface MainbarProps {
  visible: boolean
}

//инициалицазия фэйкового контента
const initContent = '<p>опишите заметку</p>'

const MainArea: FC<MainbarProps> = ({ visible }) => {
  //инициалицазия фэйкового контента
  const { activeNote } = useLayoutContext()
  const { currentUserId } = useAuth()

  const style = {
    width: visible ? '70vw' : '90vw',
  }
  const [content, setContent] = useState<string>(initContent)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  useEffect(() => {
    activeNote && setContent(activeNote.body)
  }, [activeNote])

  useEffect(() => {
    const { id, title, body, created_at, updated_at } = activeNote
    if (id) {
      !isEdit &&
        setNoteToFirebase({
          uid: currentUserId,
          note: { id, title, body, created_at, updated_at },
        })
    }
  }, [isEdit])

  useEffect(() => {
    if (!activeNote.id) return
    const updateCurrentNote = { ...activeNote }
    updateCurrentNote.body = content
    updateNote(updateCurrentNote)
  }, [content])

  return (
    <div className="mainArea" style={style}>
      <div className="mainArea-edit">
        <ActionIcon variant="light" onClick={() => setIsEdit((prev) => !prev)}>
          <IconEdit
            size={48}
            strokeWidth={2}
            color={isEdit ? '#06a4ee' : 'gray'}
          />
        </ActionIcon>
      </div>
      <div>
        <Container mt={'md'}>
          {isEdit ? (
            <TextEditor content={content} updatedContent={setContent} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </Container>
      </div>
    </div>
  )
}

export default MainArea
