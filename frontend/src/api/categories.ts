import { api, apiWithoutAuth } from "./axiosConfig";
import { Category } from "../types/types";

export const getCategories = async () => {
  const { data } = await apiWithoutAuth.get<Category[]>("/categories");
  return data;
};

export const createCategory = async (categoryData: Category) => {
  const { data } = await api.post<Category>("/categories", categoryData);
  return data;
};

export const deleteCategory = async (id: number) => {
  await api.delete(`/categories/${id}`);
};