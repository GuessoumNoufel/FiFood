import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getAllLocalRecipes } from "../API/recipes";
import RecipeCard from "./RecipeCard";
import { useLikedRecipes } from "../hooks/useLikedRecipes";
import { getFavorites } from "../API/likes";

const RESULT_COUNT = 5;

// Lower score = quicker + fewer ingredients = "easier".
// Missing `time` falls back to 0, which slightly favors recipes that never
// set a time — acceptable for now since your CreateRecipe form always asks
// for it, but worth revisiting if that ever stops being true.
function easeScore(recipe) {
  const ingredientCount = recipe.ingredients?.length ?? 100;
  const time = recipe.time ?? 100;
  return ingredientCount * 2 + time;
}

export default function QuickAndEasy() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    likedIds,
    setLikedIds,
    handleToggleLike: baseToggleLike,
  } = useLikedRecipes();

  useEffect(() => {
    let cancelled = false;
    getAllLocalRecipes()
      .then((res) => {
        if (cancelled) return;
        const all = res.data.data ?? res.data;
        const ranked = [...all]
          .sort((a, b) => easeScore(a) - easeScore(b))
          .slice(0, RESULT_COUNT);
        setRecipes(ranked);
      })
      .catch((err) => {
        console.error("ERROR:", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    getFavorites()
      .then((res) => {
        const ids = res.data.map((like) =>
          like.isLocalRecipe ? like.localRecipeId?._id : null,
        );
        setLikedIds(new Set(ids));
      })
      .catch((err) => console.error("ERROR:", err));
  }, [setLikedIds]);

  if (!loading && recipes.length === 0) return null;

  return (
    // <Section>
    //   <Header>
    //     <div>
    //       <Title>Quick & Easy</Title>
    //       <Subtitle>Minimal ingredients, minimal time</Subtitle>
    //     </div>
    //     <ViewAll to="/discover">View all</ViewAll>
    //   </Header>

    //   <Grid>
    //     {loading
    //       ? Array.from({ length: RESULT_COUNT }).map((_, i) => (
    //           <SkeletonCard key={i} />
    //         ))
    //       : recipes.map((recipe) => (
    //           <RecipeCard key={recipe._id} recipe={recipe} />
    //         ))}
    //   </Grid>
    // </Section>
    <Section id="quick-and-easy">
      <Header>
        <div>
          <Title>Quick & Easy </Title>
          <Subtitle>Minimal ingredients, minimal time, easy to make</Subtitle>
        </div>
        <ViewAll to="/discover">Explore more</ViewAll>
      </Header>

      <Grid>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : recipes.map((recipe) => {
              const {
                _id: id,
                title,
                image,
                category,
                averageRating,
                time,
              } = recipe;
              const rating = averageRating.toFixed(2);
              return (
                <RecipeCard
                  key={id}
                  id={id}
                  title={title}
                  image={image}
                  category={category}
                  rating={rating}
                  onToggleLike={baseToggleLike}
                  liked={likedIds?.has(recipe._id)}
                  time={time}
                />
              );
            })}
      </Grid>
    </Section>
  );
}

const Section = styled.section`
  max-width: 100%;
  margin: 0 auto;
  padding: 3.2rem 3.5rem;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-family: "Fraunces", Georgia, serif;
  font-size: 2.8rem;
  color: #2b2620;
  margin: 0 0 4px;
`;

const Subtitle = styled.p`
  color: #8a7a6a;
  /* font-size: 0.9rem; */
  margin: 0;
  font-size: 1.26rem;
`;

const ViewAll = styled(Link)`
  color: #db5f00;
  font-weight: 600;
  font-size: 1.2rem;
  margin-top: 2rem;
  text-decoration: none;
  white-space: nowrap;
  border: 0.1px solid #db5f0050;
  padding: 5px 10px;
  border-radius: 22px;
  &:hover {
    text-decoration: underline;
  }
`;

const Grid = styled.div`
  width: 94%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  /* justify-self: center; */
  align-self: center;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 520px) {
    grid-auto-flow: column;
    grid-auto-columns: 78%;
    grid-template-columns: none;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 4px;

    & > * {
      scroll-snap-align: start;
    }
  }
`;

const SkeletonCard = styled.div`
  aspect-ratio: 4 / 3.6;
  border-radius: 14px;
  background: #f0e9dc;
`;
