import { type IIngredients } from "../recipe/[id]/beer-details.types";
import { type IMethod } from "../recipe/[id]/beer-details.types";

export interface IRecipe {
  id: number;
  name: string;
  tagline: string;
  description: string;
  image_url: string;
  abv?: number;
  ibu?: number;
  ingredients: IIngredients;
  first_brewed?: string;
  method?: IMethod
}
