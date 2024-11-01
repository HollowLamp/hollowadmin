import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} from "@/api/category/categoryApi";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/api/category/types";
import { PaginatedResponse } from "@/api/config";

export const useGetAllCategories = (page: number = 1, limit: number = 10) => {
  return useQuery<PaginatedResponse<Category>>({
    queryKey: ["allCategories", page, limit],
    queryFn: () => getAllCategories(page, limit),
    placeholderData: keepPreviousData,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, CreateCategoryDto>({
    mutationFn: (categoryData: CreateCategoryDto) =>
      createCategory(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCategories"] });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<
    Category,
    Error,
    { id: number; categoryData: UpdateCategoryDto }
  >({
    mutationFn: ({ id, categoryData }) => updateCategory(id, categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCategories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCategories"] });
    },
  });
};
