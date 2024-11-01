import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export const useGetAllCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["allCategories"],
    queryFn: getAllCategories,
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
