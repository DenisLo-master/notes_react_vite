import { FC, useEffect } from 'react'
import { useState } from 'react'
import { Container, ActionIcon, Text } from '@mantine/core'
import { TextEditor } from './TextEditor'
import { useLayoutContext } from '../hooks/useLayoutContext'
import { IconEdit } from '@tabler/icons-react'
import { setAllNotesToFirebase, setNoteToFirebase } from '../store/action/fbDataBaseExchange'
import { useAuth } from '../context/AuthProvider'
import { updateNoteDB } from '../store/action/noteDB'

interface MainbarProps {
  visible: boolean
}

//инициалицазия фэйкового контента
const initContent = '<p>опишите заметку</p>'

const MainArea: FC<MainbarProps> = ({ visible }) => {
  //инициалицазия фэйкового контента
  const { activeNote } = useLayoutContext()
  const { uid } = useAuth()

  const style = {
    width: visible ? '70vw' : '90vw',
  }
  const [content, setContent] = useState<string>(initContent)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  useEffect(() => {
    if (activeNote) {
      setContent(activeNote.body)
      setIsEdit(false)
      setAllNotesToFirebase(uid)
    }
  }, [activeNote])

  useEffect(() => {
    if (activeNote?.id) {
      !isEdit &&
        setNoteToFirebase({
          uid: uid,
          noteId: activeNote.id,
        })
    }
  }, [isEdit])

  useEffect(() => {
    if (!activeNote?.id) return
    const updateCurrentNote = { ...activeNote }
    updateCurrentNote.body = content
    updateNoteDB({ ...updateCurrentNote, sync: false })
  }, [content])

  return (
    <div className="mainArea" style={style}>
      {activeNote?.id ?
        <>
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
                <TextEditor
                  noteId={activeNote.id}
                  content={content}
                  updatedContent={setContent} />
              ) : (
                <div>
                  <Text size={'sm'} align="center">
                    {activeNote.updated_at}
                  </Text>
                  {content ? <div dangerouslySetInnerHTML={{ __html: content }} /> :
                    <span style={{ color: "gray" }}>Новая заметка</span>
                  }
                </div>
              )}
            </Container>
          </div>
        </> :
        null}
    </div>

  )
}

export default MainArea
