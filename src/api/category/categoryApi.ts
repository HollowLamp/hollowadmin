import { axiosInstance } from "../config";
import { Category, CreateCategoryDto, UpdateCategoryDto } from "./types";

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

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>("/admin/categories/");
  return response.data;
};
