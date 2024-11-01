import { useLocation, useParams } from "react-router-dom";
import PageHeader from "@/components/pageheader/PageHeader";
import { Button, Select, TextInput, Card, Group, Switch } from "@mantine/core";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import style from "./style.module.css";
import TextEditor from "./texteditor/TextEditor";
import { useArticles, useNotes, useThoughts } from "@/hooks/use-content";
import { useGetAllCategories } from "@/hooks/use-category";
import {
  CreateArticleDto,
  UpdateArticleDto,
  CreateNoteDto,
  UpdateNoteDto,
  CreateThoughtDto,
  UpdateThoughtDto,
} from "@/api/content/types";

const CreateContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const {
    contentType: initialContentType,
    title,
    slug,
    categoryId,
    content,
    status,
  } = location.state || {};

  const [contentType, setContentType] = useState<
    "article" | "note" | "thought"
  >(initialContentType || "article");
  const [isHidden, setIsHidden] = useState(status === "hidden");
  const [contentTitle, setTitle] = useState(title || "");
  const [contentSlug, setSlug] = useState(slug || "");
  const [contentCategoryId, setCategoryId] = useState<number | null>(
    categoryId || null
  );
  const [contentText, setContent] = useState(content || "");

  const { create: createArticle, update: updateArticle } = useArticles();
  const { create: createNote, update: updateNote } = useNotes();
  const { create: createThought, update: updateThought } = useThoughts();
  const { data: categories, isLoading: loadingCategories } =
    useGetAllCategories();

  const handleSubmit = () => {
    const status = isHidden ? "hidden" : "published";

    if (contentType === "article") {
      if (!contentTitle || !contentSlug || !contentCategoryId || !contentText) {
        alert("请填写所有必填字段");
        return;
      }

      if (id) {
        const articleData: UpdateArticleDto = {
          title: contentTitle,
          slug: contentSlug,
          categoryId: contentCategoryId,
          content: contentText,
          status,
        };
        updateArticle.mutate(
          { id: Number(id), data: articleData },
          {
            onSuccess: () => {
              notifications.show({
                title: "成功",
                message: "文章更新成功！",
                color: "green",
                position: "bottom-left",
              });
            },
          }
        );
      } else {
        const articleData: CreateArticleDto = {
          title: contentTitle,
          slug: contentSlug,
          categoryId: contentCategoryId,
          content: contentText,
          status,
        };
        createArticle.mutate(articleData, {
          onSuccess: () => {
            notifications.show({
              title: "成功",
              message: "文章创建成功！",
              color: "green",
              position: "bottom-left",
            });
          },
        });
      }
    } else if (contentType === "note") {
      if (!contentTitle || !contentText) {
        alert("请填写所有必填字段");
        return;
      }

      if (id) {
        const noteData: UpdateNoteDto = {
          title: contentTitle,
          content: contentText,
          status,
        };
        updateNote.mutate(
          { id: Number(id), data: noteData },
          {
            onSuccess: () => {
              notifications.show({
                title: "成功",
                message: "随笔更新成功！",
                color: "green",
                position: "bottom-left",
              });
            },
          }
        );
      } else {
        const noteData: CreateNoteDto = {
          title: contentTitle,
          content: contentText,
          status,
        };
        createNote.mutate(noteData, {
          onSuccess: () => {
            notifications.show({
              title: "成功",
              message: "随笔创建成功！",
              color: "green",
              position: "bottom-left",
            });
          },
        });
      }
    } else if (contentType === "thought") {
      if (!contentText) {
        alert("请填写内容字段");
        return;
      }

      if (id) {
        const thoughtData: UpdateThoughtDto = {
          content: contentText,
          status,
        };
        updateThought.mutate(
          { id: Number(id), data: thoughtData },
          {
            onSuccess: () => {
              notifications.show({
                title: "成功",
                message: "说说更新成功！",
                color: "green",
                position: "bottom-left",
              });
            },
          }
        );
      } else {
        const thoughtData: CreateThoughtDto = {
          content: contentText,
          status,
        };
        createThought.mutate(thoughtData, {
          onSuccess: () => {
            notifications.show({
              title: "成功",
              message: "说说创建成功！",
              color: "green",
              position: "bottom-left",
            });
          },
        });
      }
    }
  };

  const renderFormFields = () => {
    switch (contentType) {
      case "article":
        return (
          <>
            <TextInput
              label="标题"
              required
              placeholder="文章标题"
              value={contentTitle}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
            <TextInput
              label="Slug"
              required
              placeholder="文章别名 (Slug)"
              value={contentSlug}
              onChange={(e) => setSlug(e.currentTarget.value)}
            />
            <Select
              label="类型"
              required
              placeholder="选择分类"
              data={
                loadingCategories || !categories?.data
                  ? []
                  : categories.data.map((category) => ({
                      value: category.id.toString(),
                      label: category.name,
                    }))
              }
              value={contentCategoryId?.toString() || null}
              onChange={(value) => setCategoryId(Number(value))}
            />
            <label className={style.label}>内容</label>
            <TextEditor content={contentText} setContent={setContent} />
          </>
        );
      case "note":
        return (
          <>
            <TextInput
              label="标题"
              required
              placeholder="随笔标题"
              value={contentTitle}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
            <label className={style.label}>内容</label>
            <TextEditor content={contentText} setContent={setContent} />
          </>
        );
      case "thought":
        return (
          <>
            <label className={style.label}>内容</label>
            <TextEditor content={contentText} setContent={setContent} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <PageHeader title={id ? "编辑内容" : "创建内容"} />
      <Card shadow="sm" padding="lg" classNames={{ root: style.card }}>
        <Select
          label="内容类型"
          value={contentType}
          onChange={(value) =>
            setContentType(value as "article" | "note" | "thought")
          }
          data={[
            { value: "article", label: "文章" },
            { value: "note", label: "随笔" },
            { value: "thought", label: "说说" },
          ]}
          clearable={false}
          disabled={!!id}
        />
        <div>{renderFormFields()}</div>
        <Group mt="md">
          <Switch
            label="是否隐藏"
            checked={isHidden}
            onChange={(event) => setIsHidden(event.currentTarget.checked)}
          />
          <Button onClick={handleSubmit}>{id ? "更新内容" : "创建内容"}</Button>
        </Group>
      </Card>
    </>
  );
};

export default CreateContent;
