"use client";

import { useEffect, useState, useRef, MouseEvent } from "react";
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
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);

  const { recipes, setRecipes } = useRecipeStore() as {
    recipes: IRecipe[];
    setRecipes: (data: IRecipe[]) => void;
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch("https://api.punkapi.com/v2/beers?page=1");
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    const totalRecipes = recipes.length;
    if (totalRecipes > 15) {
      setLoadedRecipes(recipes.slice(0, 15));
      setLoadMore(true);
    } else {
      setLoadedRecipes(recipes);
      setLoadMore(false);
    }
  }, [recipes]);

  const handleRecipe = (e: MouseEvent, id: number) => {
    e.preventDefault();

    if (e.button === 2) {
      if (selectedRecipes.includes(id)) {
        setSelectedRecipes((prevSelectedRecipes) =>
          prevSelectedRecipes.filter((recipeId) => recipeId !== id)
        );
      } else {
        setSelectedRecipes((prevSelectedRecipes) => {
          console.log(prevSelectedRecipes);
          return [...prevSelectedRecipes, id];
        });
      }
    }
  };

  const handleDelete = (selectedRecipes: number[]) => {
    const updatedRecipes = recipes.filter((recipe: IRecipe) => !selectedRecipes.includes(recipe.id))
    setRecipes(updatedRecipes)
    setSelectedRecipes([]);
  };

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h1>Beer recipes</h1>

        {selectedRecipes.length > 0 && (
          <button
            className={css.deleteButton}
            onClick={() => handleDelete(selectedRecipes)}
          >
            Delete
          </button>
        )}
      </div>

      <ul className={css.list}>
        {loadedRecipes.map((recipe: IRecipe) => (
          <li
            key={recipe.id}
            onContextMenu={(e) => handleRecipe(e, recipe.id)}
            className={selectedRecipes.includes(recipe.id) ? css.selected : ""}
          >
            <BeerCard recipe={recipe} />
          </li>
        ))}
      </ul>
    </div>
  );
}
