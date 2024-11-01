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

export const getAllArticles = async (): Promise<Article[]> => {
  const response = await axiosInstance.get<Article[]>("/admin/articles");
  return response.data;
};

export const getPublishedArticles = async (): Promise<Article[]> => {
  const response = await axiosInstance.get<Article[]>("/articles");
  return response.data;
};

export const getHiddenArticles = async (): Promise<Article[]> => {
  const response = await axiosInstance.get<Article[]>("/admin/articles/hidden");
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

export const getAllNotes = async (): Promise<Note[]> => {
  const response = await axiosInstance.get<Note[]>("/admin/notes");
  return response.data;
};

export const getPublishedNotes = async (): Promise<Note[]> => {
  const response = await axiosInstance.get<Note[]>("/notes");
  return response.data;
};

export const getHiddenNotes = async (): Promise<Note[]> => {
  const response = await axiosInstance.get<Note[]>("/admin/notes/hidden");
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

export const getAllThoughts = async (): Promise<Thought[]> => {
  const response = await axiosInstance.get<Thought[]>("/admin/thoughts");
  return response.data;
};

export const getPublishedThoughts = async (): Promise<Thought[]> => {
  const response = await axiosInstance.get<Thought[]>("/thoughts");
  return response.data;
};

export const getHiddenThoughts = async (): Promise<Thought[]> => {
  const response = await axiosInstance.get<Thought[]>("/admin/thoughts/hidden");
  return response.data;
};
