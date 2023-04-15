import { FC } from 'react'
import { createContext, useState } from 'react'
import { Modal, Button, Text } from '@mantine/core'
import { Container } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import { TextEditor } from './TextEditor'
import MarkdownEditor from './MarkdownEditor'

interface MainbarProps {
  visible: boolean
}

//инициалицазия фэйкового контента
const initContent =
  '<p>This is a FAKE TEXT<code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/">Tiptap.dev</a> and supports all of its features:</p>'

const MainArea: FC<MainbarProps> = ({ visible }) => {
  const style = {
    width: visible ? '70vw' : '90vw',
  }
  const [content, setContent] = useState<string>(initContent)
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div className="mainArea" style={style}>
      <Button variant='light' m={10} onClick={open}>
        Редактировать Markdown
      </Button>
      <div className="mainArea-date">
        <span>14.04.2023 г.</span>
      </div>
      <div>

        <Container mt={'md'}>
          <TextEditor content={content} updatedContent={setContent} />
        </Container>

        <Modal
          opened={opened}
          onClose={close}
          title="Markdown Editor"
          centered
          size="70%"
        >
          <MarkdownEditor
            value={content}
            setMarkdownText={(value) => {
              close()
              setContent(value)
            }}
          />
        </Modal>
      </div>
    </div>
  )
}

export default MainArea
