import { axiosInstance } from "../config";
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
} from "./types";
import { PaginatedResponse } from "../config";

export const createArticle = async (
  data: CreateArticleDto
): Promise<Article> => {
  const response = await axiosInstance.post<Article>("/admin/articles", data);
  return response.data;
};

export const updateArticle = async (
  id: number,
  data: UpdateArticleDto
): Promise<Article> => {
  const response = await axiosInstance.put<Article>(
    `/admin/articles/${id}`,
    data
  );
  return response.data;
};

export const deleteArticle = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/articles/${id}`);
};

export const getAllArticles = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  categoryId?: number,
  sortField: string = "createdAt",
  sortOrder: string = "desc",
  search?: string
): Promise<PaginatedResponse<Article>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) params.append("status", status);
  if (categoryId) params.append("categoryId", categoryId.toString());
  if (sortField) params.append("sortField", sortField);
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (search) params.append("search", search);

  const response = await axiosInstance.get<PaginatedResponse<Article>>(
    `/admin/articles?${params.toString()}`
  );
  return response.data;
};

export const createNote = async (data: CreateNoteDto): Promise<Note> => {
  const response = await axiosInstance.post<Note>("/admin/notes", data);
  return response.data;
};

export const updateNote = async (
  id: number,
  data: UpdateNoteDto
): Promise<Note> => {
  const response = await axiosInstance.put<Note>(`/admin/notes/${id}`, data);
  return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/notes/${id}`);
};

export const getAllNotes = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  sortField: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
  search?: string
): Promise<PaginatedResponse<Note>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) params.append("status", status);
  if (sortField) params.append("sortField", sortField);
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (search) params.append("search", search);

  const response = await axiosInstance.get<PaginatedResponse<Note>>(
    `/admin/notes?${params.toString()}`
  );
  return response.data;
};

export const createThought = async (
  data: CreateThoughtDto
): Promise<Thought> => {
  const response = await axiosInstance.post<Thought>("/admin/thoughts", data);
  return response.data;
};

export const updateThought = async (
  id: number,
  data: UpdateThoughtDto
): Promise<Thought> => {
  const response = await axiosInstance.put<Thought>(
    `/admin/thoughts/${id}`,
    data
  );
  return response.data;
};

export const deleteThought = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/thoughts/${id}`);
};

export const getAllThoughts = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
  sortOrder: "asc" | "desc" = "desc",
  search?: string
): Promise<PaginatedResponse<Thought>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) params.append("status", status);
  if (sortOrder) params.append("sortOrder", sortOrder);
  if (search) params.append("search", search);

  const response = await axiosInstance.get<PaginatedResponse<Thought>>(
    `/admin/thoughts?${params.toString()}`
  );
  return response.data;
};
