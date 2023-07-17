"use client";

import {
  useEffect,
  useState,
  useRef,
  MouseEvent,
  useMemo,
  useCallback,
} from "react";
import { useRecipesStore } from "../store/recipes.store";
import { type IRecipe } from "./types/global.types";
import { type IRecipesStore } from "../store/store.types";
import BeerCard from "./components/BeerCard/BeerCard";
import css from "./styles.module.css";
import Link from "next/link";

import { useInView, InView } from "react-intersection-observer";

export default function Home() {
  const [loadedRecipes, setLoadedRecipes] = useState<IRecipe[]>(
    useMemo(() => [], [])
  );
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>(
    useMemo(() => [], [])
  );
  const [page, setPage] = useState(1);
  const [lastIdx, setLastIdx] = useState(15);
  const [isLoading, setIsLoading] = useState(false);

  const list = useRef<HTMLUListElement>(null);

  const { recipes, setRecipes } = useRecipesStore() as IRecipesStore;

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "250px",
    root: list.current,
  });

  useEffect(() => {
    if (inView) {
      if (lastIdx <= recipes.length) {
        const newRecipes = recipes.slice(lastIdx, lastIdx + 5);

        setLoadedRecipes((prev) => {
          if (prev.length > 15) {
            return [...prev.slice(5)];
          } else {
            setLastIdx((prev) => prev + 5);
            return [...prev, ...newRecipes];
          }
        });
      }
    }
  }, [inView, recipes, lastIdx]);

  async function fetchRecipes(page: number) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.punkapi.com/v2/beers?page=${page}`
      );
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipes(page);
  }, [page]);

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

  const handleDelete = useCallback(
    (selectedRecipes: number[]) => {
      const isNewFetch = selectedRecipes.length === recipes.length;
      const updatedRecipes = recipes.filter(
        (recipe: IRecipe) => !selectedRecipes.includes(recipe.id)
      );
      setRecipes(updatedRecipes);
      setSelectedRecipes([]);
      if (isNewFetch) {
        setPage((prev) => prev + 1);
        fetchRecipes(page + 1);
        setLastIdx(15);
      }
    },
    [recipes, page]
  );

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

      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <ul className={css.list} ref={list}>
          {loadedRecipes.map((recipe: IRecipe, index: number) => (
            <li
              key={recipe.id}
              ref={index === loadedRecipes.length - 1 ? ref : null}
              onContextMenu={(e) => handleRecipeClick(e, recipe.id)}
              className={
                selectedRecipes.includes(recipe.id) ? css.selected : css.card
              }
            >
              <Link href={`/recipe/${recipe.id}`}>
                <BeerCard recipe={recipe} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
