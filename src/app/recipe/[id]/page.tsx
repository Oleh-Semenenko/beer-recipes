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
      <div className={css.flex}>
        <div className={css["title-wrapper"]}>
          <p className={css.title}>{recipe.name}</p>
          <p className={css.brewing}>First brewed: {recipe.first_brewed}</p>
        </div>
        <p className={css.description}>{recipe.description}</p>

        <div className={css.wrapper}>
          <div className={css.flex}>
            <h2>Ingredients</h2>
            
            <div className={css.flex}>
              <div className={css.flex}>
                <h3>Malt</h3>
                <ul className={css["ingredients-list"]}>
                  {recipe.ingredients.malt.map((i, index) => (
                    <li key={index}>
                      {i.name} - {i.amount.value} {i.amount.unit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={css.flex}>
                <h3>Hops</h3>
                <ul className={css["ingredients-list"]}>
                  {recipe.ingredients.hops.map((i, index) => (
                    <li key={index}>
                      {i.name} - {i.amount.value} {i.amount.unit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={css.flex}>
                <h3>Yeast</h3>
                <p className={css["ingredients-list"]}>
                  {recipe.ingredients.yeast}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2>Method</h2>
            <div className={css.method}>
              <ul className={css["mash-list"]}>
                <h3>Mash temp</h3>
                {recipe.method?.mash_temp.map((item, index) => (
                  <li key={index}>
                    <p>
                      Temperature - {item.temp.value} {item.temp.unit}
                    </p>
                    <p>Duration - {item.duration}</p>
                  </li>
                ))}
              </ul>

              <div>
                <h3 className={css["fermentation-title"]}>Fermentation </h3>
                {recipe.method?.fermentation.temp.value}{" "}
                {recipe.method?.fermentation.temp.unit}
              </div>

              <p className={css.twist}>{recipe.method?.twist}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
