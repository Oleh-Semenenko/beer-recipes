"use client";

import { useEffect, useState, useRef, MouseEvent } from "react";
import { useRecipesStore } from "../store/recipes.store";
import { type IRecipe } from "./types/global.types";
import { type IRecipesStore } from "../store/store.types";
import BeerCard from "./components/BeerCard/BeerCard";
import css from "./styles.module.css";
import Link from "next/link";

export default function Home() {
  const [loadedRecipes, setLoadedRecipes] = useState<IRecipe[]>([]);
  const [loadMore, setLoadMore] = useState(false);
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
  const [page, setPage] = useState(1)

  const { recipes, setRecipes } = useRecipesStore() as IRecipesStore;

  async function fetchRecipes(page: number) {
    try {
      const response = await fetch(
        `https://api.punkapi.com/v2/beers?page=${page}`
      );
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchRecipes(page);
  }, []);

  useEffect(() => {
    const totalRecipes = recipes.length;
    if (totalRecipes > 15) {
      setLoadedRecipes(recipes.slice(0, 15));
    } else {
      setLoadedRecipes(recipes);
    }
  }, [recipes]);

  const handleRecipeClick = (e: MouseEvent, id: number) => {
    e.preventDefault();

    if (e.button === 2) {
      if (selectedRecipes.includes(id)) {
        setSelectedRecipes((prevSelectedRecipes) =>
          prevSelectedRecipes.filter((recipeId) => recipeId !== id)
        );
      } else {
        setSelectedRecipes((prevSelectedRecipes) => [
          ...prevSelectedRecipes,
          id,
        ]);
      }
    }
  };

  const handleDelete = (selectedRecipes: number[]) => {
    const updatedRecipes = recipes.filter(
      (recipe: IRecipe) => !selectedRecipes.includes(recipe.id)
    );
    setRecipes(updatedRecipes);
    setSelectedRecipes([]);
    if (recipes.length === 1) {
      setPage((prev) => prev + 1)
      fetchRecipes(page + 1);
    }
  };

  return (
    <div>
      <div className={css.header}>
        <h1>Beer recipes</h1>

        {selectedRecipes.length > 0 && (
          <button
            className={css["delete-button"]}
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
            onContextMenu={(e) => handleRecipeClick(e, recipe.id)}
            className={selectedRecipes.includes(recipe.id) ? css.selected : ""}
          >
            <Link href={`/recipe/${recipe.id}`}>
              <BeerCard recipe={recipe} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
