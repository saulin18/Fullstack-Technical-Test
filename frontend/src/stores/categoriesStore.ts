import { create } from "zustand";
import { Category } from "../types/types";


interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
}

interface CategoriesActions {
  setCategories: (categories: Category[]) => void;
}

const useCategoriesStore = create<CategoriesState & CategoriesActions>((set) => ({
  categories: [],
  isLoading: false,
  setCategories: (categories: Category[]) => set({ categories }),

}));

export default useCategoriesStore;