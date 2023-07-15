import {type IRecipe} from "../app/types/global.types"

export interface IRecipesStore {
  recipes: IRecipe[]
  setRecipes: (data: IRecipe[]) => void
}