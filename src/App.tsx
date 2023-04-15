import { useState } from 'react'
import { TextEditor } from './components/TextEditor'
import { Container } from '@mantine/core'
import parse from 'html-react-parser'

//инициалицазия фэйкового контента
const initContent =
  '<p>This is a FAKE TEXT<code>RichTextEditor</code> component focuses on usability and is designed to be as simple as possible to bring a familiar editing experience to regular users. <code>RichTextEditor</code> is based on <a target="_blank" rel="noopener noreferrer nofollow" href="https://tiptap.dev/">Tiptap.dev</a> and supports all of its features:</p>'

export function App() {
  const [content, setContent] = useState(initContent)

  // выводит данные вместе с тегами
  console.log('### content #', content)

  //выводит данные в виде объекта. Можно вывести на страницу браузера как {parse(content)}
  console.log('### parse #', parse(content))

  return (
    <Container mt={'md'}>
      {/*В текстовый редактор передаем контент из базы данных и обратно получаем обновленные данные*/}
      <TextEditor content={content} updatedContent={setContent} />
    </Container>
  )
}
