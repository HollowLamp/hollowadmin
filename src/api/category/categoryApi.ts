import { axiosInstance } from "../config";
import { Category, CreateCategoryDto, UpdateCategoryDto } from "./types";
import { PaginatedResponse } from "../config";

export const createCategory = async (
  categoryData: CreateCategoryDto
): Promise<Category> => {
  const response = await axiosInstance.post<Category>(
    "/admin/categories",
    categoryData
  );
  return response.data;
};

export const updateCategory = async (
  id: number,
  categoryData: UpdateCategoryDto
): Promise<Category> => {
  const response = await axiosInstance.put<Category>(
    `/admin/categories/${id}`,
    categoryData
  );
  return response.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/categories/${id}`);
};

export const getAllCategories = async (
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Category>> => {
  const response = await axiosInstance.get<PaginatedResponse<Category>>(
    `/admin/categories?page=${page}&limit=${limit}`
  );
  return response.data;
};
