import Image from "next/image";
import { IRecipe } from "@/app/types/global.types";
import css from "./BeerCard.module.css";

export default function BeerCard({ recipe }: { recipe: IRecipe }) {
  return (
    <div className={css.container}>
      <Image
        src={recipe.image_url}
        alt={recipe.name}
        width={150}
        height={150}
      />
      <p className={css.title}>{recipe.name}</p>
      <p className={css.description}>{recipe.description}</p>
    </div>
  );
}
