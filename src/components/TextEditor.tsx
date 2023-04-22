import React, { FC, Dispatch, useState, useEffect } from 'react'
import { RichTextEditor, Link } from '@mantine/tiptap'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import Placeholder from '@tiptap/extension-placeholder'
import SubScript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image'
import { ActionIcon, Menu, Text, } from '@mantine/core'
import { IconPhotoPlus, IconFileUpload, IconLink } from '@tabler/icons-react';
import moment from 'moment'
import { dataURLtoBlob } from '../utilities/saveImage';
import { addImageDB } from '../store/action/imageDB';

interface TextEditorProps {
  uid: string
  noteId: number
  content: string
  updatedContent: Dispatch<React.SetStateAction<string>>
}

export const TextEditor: FC<TextEditorProps> = ({ uid, noteId, content, updatedContent }) => {
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
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      updatedContent(html)
    },
  });

  //добавление картинки по URL на место установки курсора
  const addImageURL = () => {
    const url = window.prompt('image URL')

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }


  const addImageFile = (file: File) => {
    console.log('adding file', file)
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const fileName = `${file.name}${new Date().getTime()}`
        const fileData = reader.result as string;
        addImageDB({ uid, noteId, image: { fileName, fileData } })

        if (fileData) {
          const blob = dataURLtoBlob(fileData);
          if (blob) {
            const imageUrl = URL.createObjectURL(blob);
            editor?.chain().focus().setImage({ src: imageUrl, alt: "local", title: fileName }).run()
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }


  return (
    <>
      <Text size={'sm'} align="center">
        {moment().format('DD MMMM YYYY, h:mm:a')}
      </Text>

      <RichTextEditor autoFocus editor={editor}>
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>



          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>

            <Menu shadow="xs" >
              <Menu.Target>
                <ActionIcon
                  variant='default'
                >
                  <IconPhotoPlus
                    size={20}
                    strokeWidth={2}
                    color={'black'}
                  />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  onClick={addImageURL}
                  icon={<IconLink
                    size={24}
                    strokeWidth={1}
                    color={'black'}
                  />}
                >
                  по ссылке
                </Menu.Item>
                <Menu.Item
                  icon={<IconFileUpload
                    size={24}
                    strokeWidth={1}
                    color={'black'}
                  />}
                  onClick={() => {
                    // Открыть окно выбора файла
                    const fileInput = document.createElement('input');
                    fileInput.type = 'file';
                    fileInput.accept = '.png,.jpeg,.svg,.jpg,.gif,.webp'; // Можно указать другие разрешенные типы файлов
                    fileInput.onchange = (e: any) => {
                      // При выборе файла
                      const selected = e.target?.files[0];
                      addImageFile(selected);
                    };
                    fileInput.click();
                  }}
                >
                  Выбрать файл
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor >
    </>
  )
}


