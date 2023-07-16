import Image from "next/image";
import { type IRecipe } from "../../types/global.types";
import css from "./styles.module.css";

type Props = {
  params: {
    id: string;
  };
};

const fetchDetails = async (id: string) => {
  try {
    const response = await fetch(`https://api.punkapi.com/v2/beers/${id}`);
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

export default async function RecipeDetails({ params: { id } }: Props) {
  const data = await fetchDetails(id);
  const recipe: IRecipe = data[0];

  return (
    <div className={css.box}>
      <Image
        src={recipe.image_url}
        alt={recipe.name}
        width={200}
        height={300}
      />
      <div className={css.info}>
        <p className={css.title}>{recipe.name}</p>
        <p className={css.description}>{recipe.description}</p>

        <div className={css.info}>
          <h2>Ingredients</h2>

          <ul>
            <li>
              <h3>Malt</h3>
              <ul className={css["ingredients-list"]}>
                {recipe.ingredients.malt.map((i, index) => (
                  <li key={index}>{i.name} - {i.amount.value} {i.amount.unit}</li>
                ))}
              </ul>
            </li>
            <li>
              <h3>Hops</h3>
              <ul className={css["ingredients-list"]}>
                {recipe.ingredients.hops.map((i, index) => (
                  <li key={index}>{i.name} - {i.amount.value} {i.amount.unit}</li>
                ))}
              </ul>
            </li>
            <li>
              <h3>Yeast</h3>
              <p className={css["ingredients-list"]}>{recipe.ingredients.yeast}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
