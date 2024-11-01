import {
  useQuery,
  useMutation,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticles,
  createNote,
  updateNote,
  deleteNote,
  getAllNotes,
  createThought,
  updateThought,
  deleteThought,
  getAllThoughts,
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
import { PaginatedResponse } from "@/api/config";

export const useArticles = (
  page: number = 1,
  limit: number = 10,
  status?: string,
  categoryId?: number,
  sortField: string = "createdAt",
  sortOrder: string = "desc",
  search?: string
) => {
  const queryClient = useQueryClient();

  const getAll = useQuery<PaginatedResponse<Article>>({
    queryKey: [
      "allArticles",
      page,
      limit,
      status,
      categoryId,
      sortField,
      sortOrder,
      search,
    ],
    queryFn: () =>
      getAllArticles(
        page,
        limit,
        status,
        categoryId,
        sortField,
        sortOrder,
        search
      ),
    placeholderData: keepPreviousData,
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

  return { getAll, create, update, remove, refetch: getAll.refetch };
};

export const useNotes = (
  page: number = 1,
  limit: number = 10,
  status?: string,
  sortField: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
  search?: string
) => {
  const queryClient = useQueryClient();

  const getAll = useQuery<PaginatedResponse<Note>>({
    queryKey: ["allNotes", page, limit, status, sortField, sortOrder, search],
    queryFn: () =>
      getAllNotes(page, limit, status, sortField, sortOrder, search),
    placeholderData: keepPreviousData,
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

  return { getAll, create, update, remove, refetch: getAll.refetch };
};

export const useThoughts = (
  page: number = 1,
  limit: number = 10,
  status?: string,
  sortOrder: "asc" | "desc" = "desc",
  search?: string
) => {
  const queryClient = useQueryClient();

  const getAll = useQuery<PaginatedResponse<Thought>>({
    queryKey: ["allThoughts", page, limit, status, sortOrder, search],
    queryFn: () => getAllThoughts(page, limit, status, sortOrder, search),
    placeholderData: keepPreviousData,
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

  return { getAll, create, update, remove, refetch: getAll.refetch };
};
