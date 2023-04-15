import React, { useState } from "react";
import MarkdownEditor from "./components/MarkdownEditor";
import ReactMarkdown from "react-markdown";

const App: React.FC = () => {
  const [showMarkdownEditor, setShowMarkdownEditor] = useState<boolean>(false)
  const [markdownText, setMarkdownText] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
  };


  return (
    <div className="">
      <h1>Markdown Editor</h1>
      <textarea
        className="flex border-2-grayborder-solid border-2 border-sky-500 w-1/6"
        value={markdownText}
        onChange={handleInputChange}
      />

      <button onClick={() => setShowMarkdownEditor(true)}>Редактировать</button>

      {showMarkdownEditor &&
        <MarkdownEditor
          value={markdownText}
          setMarkdownText={(value) => {
            setShowMarkdownEditor(false)
            setMarkdownText(value)
          }}
        />
      }
    </div>
  );
};

export default App;
