import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticles,
  getHiddenArticles,
  getPublishedArticles,
  createNote,
  updateNote,
  deleteNote,
  getAllNotes,
  getHiddenNotes,
  getPublishedNotes,
  createThought,
  updateThought,
  deleteThought,
  getAllThoughts,
  getHiddenThoughts,
  getPublishedThoughts,
} from "@/api/content/contentApi";
import {
  Article,
  Note,
  Thought,
  CreateArticleDto,
  UpdateArticleDto,
  CreateNoteDto,
  UpdateNoteDto,
  CreateThoughtDto,
  UpdateThoughtDto,
} from "@/api/content/types";

export const useArticles = () => {
  const queryClient = useQueryClient();

  const getAll = useQuery<Article[]>({
    queryKey: ["allArticles"],
    queryFn: getAllArticles,
  });

  const getHidden = useQuery<Article[]>({
    queryKey: ["hiddenArticles"],
    queryFn: getHiddenArticles,
  });

  const getPublished = useQuery<Article[]>({
    queryKey: ["publishedArticles"],
    queryFn: getPublishedArticles,
  });

  const create = useMutation<Article, Error, CreateArticleDto>({
    mutationFn: createArticle,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allArticles"] }),
  });

  const update = useMutation<
    Article,
    Error,
    { id: number; data: UpdateArticleDto }
  >({
    mutationFn: ({ id, data }) => updateArticle(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allArticles"] }),
  });

  const remove = useMutation<void, Error, number>({
    mutationFn: deleteArticle,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allArticles"] }),
  });

  return { getAll, getHidden, getPublished, create, update, remove };
};

export const useNotes = () => {
  const queryClient = useQueryClient();

  const getAll = useQuery<Note[]>({
    queryKey: ["allNotes"],
    queryFn: getAllNotes,
  });

  const getHidden = useQuery<Note[]>({
    queryKey: ["hiddenNotes"],
    queryFn: getHiddenNotes,
  });

  const getPublished = useQuery<Note[]>({
    queryKey: ["publishedNotes"],
    queryFn: getPublishedNotes,
  });

  const create = useMutation<Note, Error, CreateNoteDto>({
    mutationFn: createNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allNotes"] }),
  });

  const update = useMutation<Note, Error, { id: number; data: UpdateNoteDto }>({
    mutationFn: ({ id, data }) => updateNote(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allNotes"] }),
  });

  const remove = useMutation<void, Error, number>({
    mutationFn: deleteNote,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["allNotes"] }),
  });

  return { getAll, getHidden, getPublished, create, update, remove };
};

export const useThoughts = () => {
  const queryClient = useQueryClient();

  const getAll = useQuery<Thought[]>({
    queryKey: ["allThoughts"],
    queryFn: getAllThoughts,
  });

  const getHidden = useQuery<Thought[]>({
    queryKey: ["hiddenThoughts"],
    queryFn: getHiddenThoughts,
  });

  const getPublished = useQuery<Thought[]>({
    queryKey: ["publishedThoughts"],
    queryFn: getPublishedThoughts,
  });

  const create = useMutation<Thought, Error, CreateThoughtDto>({
    mutationFn: createThought,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allThoughts"] }),
  });

  const update = useMutation<
    Thought,
    Error,
    { id: number; data: UpdateThoughtDto }
  >({
    mutationFn: ({ id, data }) => updateThought(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allThoughts"] }),
  });

  const remove = useMutation<void, Error, number>({
    mutationFn: deleteThought,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allThoughts"] }),
  });

  return { getAll, getHidden, getPublished, create, update, remove };
};
