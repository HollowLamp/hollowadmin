import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { all, createLowlight } from "lowlight";
import { useEffect, useState } from "react";
import { Button, Select } from "@mantine/core";

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
      Link.configure({
        openOnClick: false,
      }),
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

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      setLanguage(value);
      editor?.chain().focus().setCodeBlock({ language: value }).run();
    }
  };

  const addImage = () => {
    const url = prompt("输入图片URL");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = prompt("输入链接URL");
    if (url) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
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
        <Button onClick={addImage}>插入图片</Button>
        <Button onClick={addLink} style={{ marginLeft: "8px" }}>
          插入链接
        </Button>
        <Select
          value={language}
          onChange={handleLanguageChange}
          data={[
            { value: "javascript", label: "JavaScript" },
            { value: "python", label: "Python" },
            { value: "html", label: "HTML" },
            { value: "css", label: "CSS" },
            { value: "typescript", label: "TypeScript" },
            { value: "java", label: "Java" },
            { value: "cpp", label: "C++" },
            { value: "ruby", label: "Ruby" },
            { value: "php", label: "PHP" },
            { value: "go", label: "Go" },
            { value: "json", label: "JSON" },
            { value: "markdown", label: "Markdown" },
          ]}
          placeholder="选择语言"
          style={{
            marginLeft: "16px",
            width: "150px",
          }}
        />
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default TextEditor;
