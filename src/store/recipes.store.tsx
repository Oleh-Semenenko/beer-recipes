import { create } from "zustand";
import { type IRecipe } from "../app/types/global.types";

export const useRecipesStore = create((set) => ({
  recipes: [] as IRecipe[],
  setRecipes: (data: IRecipe) => set(() => ({ recipes: data })),
}));
