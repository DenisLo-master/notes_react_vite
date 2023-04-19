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
import { Button, ActionIcon, Menu, Text, } from '@mantine/core'
import { IconPhotoPlus, IconFileUpload, IconLink } from '@tabler/icons-react';
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




  //добавление картинки из локального хранилища на место установки курсора
  const addImageFile = (file: File) => {
    console.log('adding file', file)
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        // Сохранение файла в состоянии компонента
        console.log("+++++++++image", imageDataUrl.length)
        localStorage.setItem(`${file.name}`, imageDataUrl);

        function dataURLtoBlob(dataURL: string): Blob {
          const byteString = atob(dataURL.split(',')[1]);
          const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
          const arrayBuffer = new ArrayBuffer(byteString.length);
          const uint8Array = new Uint8Array(arrayBuffer);

          for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i);
          }

          return new Blob([arrayBuffer], { type: mimeString });
        }


        const imageDataLocal = localStorage.getItem(`${file.name}`);
        if (imageDataLocal) {
          const reader = new FileReader();
          reader.onloadend = () => {
            // Чтение файла в виде ArrayBuffer
            const buffer = reader.result as ArrayBuffer;

            // Создание Uint8Array из ArrayBuffer
            const uint8Array = new Uint8Array(buffer);

            // Создание Blob из Uint8Array с указанием типа MIME для изображения
            const blob = new Blob([uint8Array], { type: 'image/jpeg' }); // Здесь указан тип MIME, замените его на соответствующий тип вашего изображения

            // Создание URL из Blob
            const imageUrl = URL.createObjectURL(blob); // Создание URL из Blob
            console.log("+++++++++imageUrl", imageDataUrl.length)

            editor?.chain().focus().setImage({ src: imageUrl }).run()

          };
        }
        // Чтение Data URL в виде ArrayBuffer
        reader.readAsArrayBuffer(dataURLtoBlob);

      };
      reader.readAsDataURL(file);
      // const fileLocal = localStorage.getItem(`${file.name}`)
      // const image = fileLocal && URL.createObjectURL(fileLocal)
    }
  }


  return (
    <>
      {/* Отображение даты и времени на странице редактора */}
      <Text size={'sm'} align="center">
        {moment().format('DD MMMM YYYY, h:mm:a')}
      </Text>

      {/* редактор */}
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

      {/* кнопка добавления картинки по URL */}


      {/* кнопка добавления картинки из локального хранилища */}

    </>
  )
}


