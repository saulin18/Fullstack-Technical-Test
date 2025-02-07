import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../api/categories";
import { Category, CreateCategoryInput } from "../types/types";
import { api } from "../api/axiosConfig";

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
        const newCategories = [...oldCategories, data];
        return newCategories;   
       
      })
     
    },
    onError: (error) => {
      console.error("Category creation error:", error);
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
    },
    onError: (error) => {
      console.error("Category deletion error:", error);
    },
  });
};

export const useAddCategoryToOffer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ offerId, categoryId }: { 
      offerId: number; 
      categoryId: number 
    }) => {
     
      const { data } = await api.put(`/categories/${categoryId}`, {
        offerId 
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
    }
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
    }
  });
};