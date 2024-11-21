import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  deleteComment,
  getAllComments,
  getIndependentComments,
  getCommentsByArticleSlug,
  getCommentsByNoteId,
  getCommentsByThoughtId,
} from "@/api/comment/commentApi";
import { Comment } from "@/api/comment/types";
import { PaginatedResponse } from "@/api/config";

export const useGetAllComments = (
  page: number = 1,
  limit: number = 10,
  search?: string,
  filterType?: string,
  sortOrder: "asc" | "desc" = "desc"
) => {
  return useQuery<PaginatedResponse<Comment>>({
    queryKey: ["allComments", page, limit, search, filterType, sortOrder],
    queryFn: () => getAllComments(page, limit, search, filterType, sortOrder),
    placeholderData: keepPreviousData,
  });
};

export const useGetIndependentComments = (
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<PaginatedResponse<Comment>>({
    queryKey: ["independentComments", page, limit],
    queryFn: () => getIndependentComments(page, limit),
    placeholderData: keepPreviousData,
  });
};

export const useGetCommentsByArticleSlug = (
  slug: string,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<PaginatedResponse<Comment>>({
    queryKey: ["articleComments", slug, page, limit],
    queryFn: () => getCommentsByArticleSlug(slug, page, limit),
    placeholderData: keepPreviousData,
    enabled: !!slug,
  });
};

export const useGetCommentsByNoteId = (
  noteId: number,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<PaginatedResponse<Comment>>({
    queryKey: ["noteComments", noteId, page, limit],
    queryFn: () => getCommentsByNoteId(noteId, page, limit),
    placeholderData: keepPreviousData,
    enabled: !!noteId,
  });
};

export const useGetCommentsByThoughtId = (
  thoughtId: number,
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<PaginatedResponse<Comment>>({
    queryKey: ["thoughtComments", thoughtId, page, limit],
    queryFn: () => getCommentsByThoughtId(thoughtId, page, limit),
    placeholderData: keepPreviousData,
    enabled: !!thoughtId,
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allComments"] });
    },
  });
};
