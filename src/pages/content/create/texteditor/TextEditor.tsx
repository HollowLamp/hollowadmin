import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import { all, createLowlight } from "lowlight";
import { useEffect, useState } from "react";

const lowlight = createLowlight(all);

interface TextEditorProps {
  content: string;
  setContent: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ content, setContent }) => {
  const [language, setLanguage] = useState("javascript");

  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Image,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
    editor
      ?.chain()
      .focus()
      .setCodeBlock({ language: event.target.value })
      .run();
  };

  const addImage = () => {
    const url = prompt("输入图片URL");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
          <RichTextEditor.H5 />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.CodeBlock />
        </RichTextEditor.ControlsGroup>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>
        <button onClick={addImage}>插入图片</button>
        <select
          value={language}
          onChange={handleLanguageChange}
          style={{
            marginLeft: "16px",
            padding: "4px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="ruby">Ruby</option>
          <option value="php">PHP</option>
          <option value="go">Go</option>
          <option value="json">JSON</option>
          <option value="markdown">Markdown</option>
        </select>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default TextEditor;
