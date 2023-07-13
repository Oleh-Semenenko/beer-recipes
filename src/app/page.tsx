"use client";

import { useEffect, useState } from "react";
import create from "zustand";
import { type IRecipe } from "./types/global.types";
import BeerCard from "./components/BeerCard/BeerCard";
import css from "./styles.module.css";

const useRecipeStore = create((set) => ({
  recipes: [] as IRecipe[],
  setRecipes: (data: IRecipe) => set(() => ({ recipes: data })),
}));

export default function Home() {
  const [loadedRecipes, setLoadedRecipes] = useState<IRecipe[]>([]);
  const [loadMore, setLoadMore] = useState(false);

  const { recipes, setRecipes } = useRecipeStore() as {
    recipes: IRecipe[];
    setRecipes: (data: IRecipe[]) => void;
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch("https://api.punkapi.com/v2/beers?page=1");
      const data = await response.json();
      setRecipes(data);
      setLoadedRecipes(data.slice(0, 15));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRecipes();

    const totalRecipes = recipes.length;
    if (totalRecipes > 15) {
      setLoadedRecipes(recipes.slice(15, 25));
      setLoadMore(true);
    } else {
      setLoadedRecipes([]);
      setLoadMore(false);
    }
  }, [recipes]);
  return (
    <main className={css.container}>
      <h1>Beer recipes</h1>

      <ul className={css.list}>
        {recipes.slice(0, 15).map((recipe: IRecipe) => (
          <li key={recipe.id}>
            <BeerCard recipe={recipe} />
          </li>
        ))}
        {loadMore &&
          loadedRecipes.map((recipe: IRecipe) => (
            <li key={recipe.id}>
              <BeerCard recipe={recipe} />
            </li>
          ))}
      </ul>
    </main>
  );
}
