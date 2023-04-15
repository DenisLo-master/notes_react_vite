import React, { ComponentProps, FC, PropsWithChildren, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Popup } from "./Popup";



interface MarkdownEditorProps {
    value: string
    setMarkdownText: (value: any) => void;
}
const MarkdownEditor: FC<MarkdownEditorProps> = ({ value, setMarkdownText }) => {
    const [text, setText] = useState<string>("");
    const [textTemp, setTextTemp] = useState<string>("");
    const [textareaSelected, setTextareaSelected] = useState('');

    const setBoldText = (substring: string) => {
        const marked = `**${substring}**`
        const textTempSplit: string[] = textTemp.split(" ");

        for (let i = 0; i < textTempSplit.length; i++) {
            if (textTempSplit[i] === substring) {
                textTempSplit[i] = marked
            }
        }

        const modifiedText: string = textTempSplit.join(" ");
        setTextTemp(modifiedText)
    }

    const onSave = () => {
        setMarkdownText(textTemp)
    }
    const onCancel = () => {
        setMarkdownText(text)
    }

    const handleTextareaBlur = () => {
        const selectedText = window.getSelection()?.toString() || '';
        setTextareaSelected(selectedText);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTextTemp(e.target.value);
    };

    useEffect(() => {
        setTextTemp(value)
        setText(value)
    }, [value])

    console.log("text", text)
    console.log("textTemp", textTemp)
    return (
        <Popup>
            <div
                className='flex w-1/2 flex-col items-center justify-center
             p-2 bg-sky-200 rounded-xl shadow-md'
            >
                <button type="button" onClick={() => setBoldText(textareaSelected)}>ж</button>
                <textarea
                    className="w-full h-full "
                    value={textTemp}
                    onChange={handleInputChange}
                    onBlur={handleTextareaBlur}
                />
                <div className="flex relative justify-between w-1/2">
                    <button onClick={onCancel}>Отменить</button>
                    <button onClick={onSave}>Сохранить</button>
                </div>
                <ReactMarkdown>{textTemp}</ReactMarkdown>
            </div>

        </Popup>

    );
};

export default MarkdownEditor;
