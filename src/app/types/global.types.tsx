import { type IIngredients } from "../recipe/[id]/ingredients.types";

export interface IRecipe {
  id: number;
  name: string;
  tagline: string;
  description: string;
  image_url: string;
  abv?: number;
  ibu?: number;
  ingredients: IIngredients;
}
