import { Category } from "../category/types";

export interface Article {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  status: "published" | "hidden";
  likesCount: number;
  views: number;
  slug: string;
  categoryId: number;
  category: Category;
}

export interface Note {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  status: "published" | "hidden";
  views: number;
  likesCount: number;
}

export interface Thought {
  id: number;
  createdAt: string;
  status: "published" | "hidden";
  content: string;
  likesCount: number;
}

export interface CreateArticleDto {
  title: string;
  content: string;
  status: "published" | "hidden";
  categoryId: number;
  slug: string;
}

export interface UpdateArticleDto {
  title?: string;
  content?: string;
  status?: "published" | "hidden";
  categoryId?: number;
  slug?: string;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  status: "published" | "hidden";
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  status?: "published" | "hidden";
}

export interface CreateThoughtDto {
  content: string;
  status: "published" | "hidden";
}

export interface UpdateThoughtDto {
  content?: string;
  status?: "published" | "hidden";
}
