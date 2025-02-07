import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, deleteCategory } from "../api/categories";
import { Category, CreateCategoryInput } from "../types/types";
import { api } from "../api/axiosConfig";
import { toast } from "sonner";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: false,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData: CreateCategoryInput) => createCategory(categoryData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.setQueryData(["categories"], (oldCategories: Category[]) => {
        return [...oldCategories, data];
      });
      toast.success("Category created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.setQueryData(["categories"], (oldCategories: Category[]) => {
        return oldCategories.filter((category) => category.id !== id);
      });
      toast.success("Category deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
};

export const useAddCategoryToOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ offerId, categoryId }: { offerId: number; categoryId: number }) => {
      const { data } = await api.put(`/categories/${categoryId}`, { offerId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Category added to offer");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error adding category to offer");
    },
  });
};

export const useRemoveCategoryFromOffer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offerId: number) => {
      const { data } = await api.delete(`/offers/${offerId}/category`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Category removed from offer");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Error removing category from offer");
    },
  });
};