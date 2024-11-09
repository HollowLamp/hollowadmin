import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { all, createLowlight } from "lowlight";
import { useEffect, useState } from "react";
import { Select, FileButton, ActionIcon, Tooltip } from "@mantine/core";
import TurndownService from "turndown";
import showdown from "showdown";
import {
  IconPhoto,
  IconLink,
  IconDownload,
  IconUpload,
} from "@tabler/icons-react";

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

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const markdownContent = reader.result as string;
      const converter = new showdown.Converter();
      const htmlContent = converter.makeHtml(markdownContent);
      editor?.commands.setContent(htmlContent);
    };
    reader.readAsText(file);
  };

  const exportMarkdown = () => {
    const htmlContent = editor?.getHTML() || "";
    const turndownService = new TurndownService();
    const markdownContent = turndownService.turndown(htmlContent);
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "content.md";
    link.click();
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

        <Tooltip label="插入图片">
          <ActionIcon onClick={addImage} style={{ marginLeft: "8px" }}>
            <IconPhoto size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="插入链接">
          <ActionIcon onClick={addLink} style={{ marginLeft: "8px" }}>
            <IconLink size={18} />
          </ActionIcon>
        </Tooltip>

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

        <FileButton onChange={handleFileChange} accept=".md">
          {(props) => (
            <Tooltip label="导入 Markdown">
              <ActionIcon {...props} style={{ marginLeft: "8px" }}>
                <IconUpload size={18} />
              </ActionIcon>
            </Tooltip>
          )}
        </FileButton>

        <Tooltip label="导出 Markdown">
          <ActionIcon onClick={exportMarkdown} style={{ marginLeft: "8px" }}>
            <IconDownload size={18} />
          </ActionIcon>
        </Tooltip>
      </RichTextEditor.Toolbar>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};

export default TextEditor;
