import React, { FC, Dispatch, useState, useEffect } from 'react'
import { RichTextEditor } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { FileButton, Button, Text } from '@mantine/core'
import moment from 'moment'

interface TextEditorProps {
  content: string
  updatedContent: Dispatch<React.SetStateAction<string>>
}

export const TextEditor: FC<TextEditorProps> = ({ content, updatedContent }) => {
  //для обновления времени на странице через 1 минуту
  const [, setDate] = useState<Date>()

  //для обновления времени на странице через 1 минуту
  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date())
    }, 60000)
    return () => {
      interval
    }
  }, [])

  //инициализация редактора Mantine
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: 'my-editor-image' } }),
      Placeholder.configure({ placeholder: 'Новая заметка' }),
    ],

    //получение данных от родителя
    content: content,

    //отправка родителю измененных данных
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      updatedContent(html)
    },
  })

  //добавление картинки по URL на место установки курсора
  const addImageURL = () => {
    const url = window.prompt('URL')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  //добавление картинки из локального хранилища на место установки курсора
  const addImageFile = (file: File) => {
    if (file) {
      const image = URL.createObjectURL(file)
      editor?.chain().focus().setImage({ src: image }).run()
    }
  }

  return (
    <>
      {/* Отображение даты и времени на странице редактора */}
      <Text size={'sm'} align="center">
        {moment().format('DD MMMM YYYY, h:mm:a')}
      </Text>

      {/* редактор */}
      <RichTextEditor autoFocus styles={{ root: { border: 0 } }} editor={editor}>
        <RichTextEditor.Content />
      </RichTextEditor>

      {/* кнопка добавления картинки по URL */}
      <Button variant="light" m={10} onClick={addImageURL}>
        add URL
      </Button>

      {/* кнопка добавления картинки из локального хранилища */}
      <FileButton onChange={addImageFile} accept="image/*,.png,.jpeg,.svg,.jpg,.gif,.webp">
        {(props) => (
          <Button variant="light" {...props}>
            add File
          </Button>
        )}
      </FileButton>
    </>
  )
}
