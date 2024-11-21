import { axiosInstance } from "../config";
import { Comment } from "./types";
import { PaginatedResponse } from "../config";

export const deleteComment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/comments/${id}`);
};

export const getAllComments = async (
  page = 1,
  limit = 10,
  search?: string,
  filterType?: string,
  sortOrder: "asc" | "desc" = "desc"
): Promise<PaginatedResponse<Comment>> => {
  const response = await axiosInstance.get<PaginatedResponse<Comment>>(
    `/admin/comments`,
    {
      params: {
        page,
        limit,
        search,
        filterType,
        sortOrder,
      },
    }
  );
  return response.data;
};

export const getIndependentComments = async (
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Comment>> => {
  const response = await axiosInstance.get<PaginatedResponse<Comment>>(
    `/comments/independent?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getCommentsByArticleSlug = async (
  slug: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Comment>> => {
  const response = await axiosInstance.get<PaginatedResponse<Comment>>(
    `/comments/article/${slug}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getCommentsByNoteId = async (
  id: number,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Comment>> => {
  const response = await axiosInstance.get<PaginatedResponse<Comment>>(
    `/comments/note/${id}?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getCommentsByThoughtId = async (
  id: number,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Comment>> => {
  const response = await axiosInstance.get<PaginatedResponse<Comment>>(
    `/comments/thought/${id}?page=${page}&limit=${limit}`
  );
  return response.data;
};
