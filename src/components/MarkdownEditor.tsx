import React, {
  ComponentProps,
  FC,
  PropsWithChildren,
  ReactEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Button, ActionIcon, Textarea, rem, Group, Container } from '@mantine/core'

import { marked } from 'marked'

import { IconList, IconListNumbers, IconSeparatorHorizontal } from '@tabler/icons-react'
import { ReactMarkdown } from 'react-markdown/lib/react-markdown'

interface MarkdownEditorProps {
  value: string
  setMarkdownText: (value: any) => void
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({ value, setMarkdownText }) => {
  const [textTemp, setTextTemp] = useState<string>('')
  const [selectionStart, setSelectionStart] = useState<number | null>()
  const [selectionEnd, setSelectionEnd] = useState<number | null>()
  const [images, setImages] = useState<HTMLElement[]>([])

  const onSave = () => {
    const result = convertStrToHtml(textTemp)
    const html = marked(result)
    setMarkdownText(html)
  }
  const onCancel = () => {
    setMarkdownText(value)
  }

  const handleInputSelect = (event: any) => {
    const inputElement = event.target as HTMLInputElement
    setSelectionStart(inputElement?.selectionStart)
    setSelectionEnd(inputElement?.selectionEnd)
  }

  function getMarked(text: string, typeMarkdown: string) {
    if (typeMarkdown === 'bold') {
      return `**${text}**`
    } else if (typeMarkdown === 'italics') {
      return `_${text}_`
    } else if (typeMarkdown === 'strikethrough') {
      return `~${text}~`
    } else if (typeMarkdown === 'hLine') {
      return `\n***\n`
    } else if (typeMarkdown === 'list') {
      const list = text.replace(new RegExp('\n', 'g'), '\n * ')
      return `* ${list}`
    } else if (typeMarkdown === 'listNumber') {
      const list = text.replace(new RegExp('\n', 'g'), '\n 1. ')
      return `1. ${list}`
    }
  }

  const getMarkdownText = (typeMarkdown: string) => {
    if (typeof selectionStart === 'number' && typeof selectionEnd === 'number') {
      const prefix = textTemp.substring(0, selectionStart) || ' '
      const selectedText = textTemp.substring(selectionStart, selectionEnd)
      const suffix = textTemp.substring(selectionEnd)
      const markedText = getMarked(selectedText, typeMarkdown)
      const replacedText = `${prefix}${markedText}${suffix}`
      setTextTemp(replacedText)
      setSelectionStart(null)
      setSelectionEnd(null)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextTemp(e.target.value)
  }

  function convertStrToHtml(textTemp: string) {
    let htmlStr = textTemp
    images.forEach((img, i) => {
      const imgStr = `\\(---image_${i}---\\)`
      const imgIndex = new RegExp(imgStr, 'g')
      htmlStr = htmlStr.replace(imgIndex, img.outerHTML)
    })
    return htmlStr
  }

  function convertHtmlToStr(html: string) {
    var tempElement = document.createElement('div')
    tempElement.innerHTML = html

    const imageArray = [...tempElement.getElementsByTagName('img')]
    let images: HTMLElement[] = []
    for (let i = 0; i < imageArray.length; i++) {
      const image = imageArray[i]
      if (image) {
        images.push(image)
        image.outerHTML = ` (---image_${i}---) `
      }
    }
    return { text: tempElement.textContent || tempElement.innerText || '', images }
  }

  useEffect(() => {
    const { text, images } = convertHtmlToStr(value)
    if (text) {
      setImages(images)
      setTextTemp(text)
    }
  }, [value])

  return (
    <Container>
      <Group position="right" spacing="xl">
        <Group pb={'1rem'} spacing="xs">
          <ActionIcon variant="default" onClick={() => getMarkdownText('hLine')}>
            <IconSeparatorHorizontal size={rem(18)} strokeWidth={2} color={'black'} />
          </ActionIcon>
        </Group>
        <Group pb={'1rem'} spacing="xs">
          <>
            <ActionIcon variant="default" onClick={() => getMarkdownText('list')}>
              <IconList size={rem(18)} />
            </ActionIcon>
            <ActionIcon variant="default" onClick={() => getMarkdownText('listNumber')}>
              <IconListNumbers size={rem(18)} />
            </ActionIcon>
          </>
        </Group>
        <Group pb={'1rem'} position="right" spacing="xs">
          <Button variant="default" size="xs" onClick={() => getMarkdownText('italics')}>
            K
          </Button>
          <Button variant="default" size="xs" onClick={() => getMarkdownText('bold')}>
            Ж
          </Button>
        </Group>
      </Group>

      <Textarea
        value={textTemp}
        onChange={handleInputChange}
        onSelect={handleInputSelect}
        autosize
        minRows={14}
        maxRows={24}
      />
      <ReactMarkdown>{textTemp}</ReactMarkdown>
      <Group pt={'1rem'} position="right" spacing="xs">
        <Button variant="light" onClick={onCancel}>
          Отменить
        </Button>
        <Button variant="filled" onClick={onSave}>
          Сохранить
        </Button>
      </Group>
    </Container>
  )
}

export default MarkdownEditor
