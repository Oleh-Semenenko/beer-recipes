export interface IIngredients {
  malt: IMalt[];
  hops: IHops[];
  yeast: string;
}

interface IBaseIngredient {
  name: string;
  amount: {
    value: number;
    unit: string;
  };
}

interface IMalt extends IBaseIngredient {}

interface IHops extends IBaseIngredient {
  add: string;
  attribute: string;
}