import { useState, useEffect, useMemo, useContext } from "react";
import styled from "styled-components";
import { getFavorites, toggleLike } from "../api/likes";
import toast from "react-hot-toast";
import RecipeCard from "../components/RecipeCard";
import ConfirmModal from "../components/ConfirmModel";
import LoadingPage from "../components/LoadingPage";
import { AuthContext } from "../context/AuthContext";

const fakeRating = () => (Math.random() * (4.9 - 4.0) + 4.0).toFixed(1);
const FAVORITES_CACHE_TTL = 30_000;
const favoritesCache = new Map();

const LINE_ONE = ["All", "Breakfast", "Lunch", "Dinner", "Dessert"];
const LINE_TWO = ["All", "Vegetarian", "Beef", "Seafood"];

const Page = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 48px 64px;
  font-family: "Inter", sans-serif;
`;

const Title = styled.h1`
  font-family: "Fraunces", Georgia, serif;
  font-size: 28px;
  margin: 0 0 4px;
  color: #2b2620;
`;

const Subtitle = styled.p`
  color: #8a7f6e;
  margin: 0 0 20px;
`;

const FilterLine = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
`;

const Pill = styled.button`
  font-size: 13px;
  padding: 7px 16px;
  border-radius: 999px;
  border: 1px solid ${(props) => (props.$active ? "#4A4238" : "#E8E0D4")};
  background: ${(props) => (props.$active ? "#4A4238" : "none")};
  color: ${(props) => (props.$active ? "#fff" : "#4A4238")};
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.$active ? "#4A4238" : "#F5EFE4")};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

const Empty = styled.p`
  color: #8a7f6e;
  padding: 40px 0;
  font-size: 1.5rem;
`;

function normalizeFavorite(like) {
  if (like.isLocalRecipe && like.localRecipeId) {
    return {
      id: like.localRecipeId._id,
      title: like.localRecipeId.title,
      image: like.localRecipeId.image,
      category: like.localRecipeId.category,
      area: like.localRecipeId.area,
      time: like.localRecipeId.time,
      rating:
        like.localRecipeId.averageRating > 0
          ? like.localRecipeId.averageRating.toFixed(1)
          : null,
    };
  }
  return {
    id: like.mealDBId,
    title: like.title,
    image: like.image,
    category: like.category,
    area: like.area,
    time: null,
    rating: fakeRating(),
  };
}

function Favorites() {
  const { user } = useContext(AuthContext);
  const cacheKey = user?._id ?? "anonymous";
  const cachedFavorites = favoritesCache.get(cacheKey);
  const initialFavorites =
    cachedFavorites && Date.now() - cachedFavorites.cachedAt < FAVORITES_CACHE_TTL
      ? cachedFavorites.data
      : null;
  const [favorites, setFavorites] = useState(initialFavorites ?? []);
  const [loading, setLoading] = useState(!initialFavorites);
  const [activeFilter, setActiveFilter] = useState("All");
  const [pendingRemoveId, setPendingRemoveId] = useState(null);

  useEffect(() => {
    const cached = favoritesCache.get(cacheKey);
    if (cached && Date.now() - cached.cachedAt < FAVORITES_CACHE_TTL) {
      setFavorites(cached.data);
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);
    getFavorites()
      .then((res) => {
        const data = res.data.map(normalizeFavorite);
        favoritesCache.set(cacheKey, { data, cachedAt: Date.now() });
        if (isCurrent) setFavorites(data);
      })
      .catch(() => {
        if (isCurrent) setFavorites([]);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [cacheKey]);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return favorites;
    return favorites.filter(
      (f) => f.category?.toLowerCase() === activeFilter.toLowerCase(),
    );
  }, [favorites, activeFilter]);

  const handleConfirmRemove = async () => {
    const id = pendingRemoveId;
    try {
      await toggleLike(id);
      setFavorites((prev) => {
        const next = prev.filter((f) => f.id !== id);
        favoritesCache.set(cacheKey, { data: next, cachedAt: Date.now() });
        return next;
      });
      setPendingRemoveId(null);
      toast.success("Removed from favorites");
    } catch (err) {
      toast.error("Could not remove recipe");
    }
  };
  if (loading) return <LoadingPage />;

  return (
    <Page>
      <Title className="flex gap-3 items-center">
        My Cookbook{" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#fa5252"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#fa5252"
          class="size-12"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </Title>
      <Subtitle>Recipes you want to cook later.</Subtitle>

      <FilterLine>
        {LINE_ONE.map((label) => (
          <Pill
            key={label}
            $active={activeFilter === label}
            onClick={() => setActiveFilter(label)}
          >
            {label}
          </Pill>
        ))}
      </FilterLine>

      <FilterLine>
        {LINE_TWO.map((label) => (
          <Pill
            key={label}
            $active={activeFilter === label}
            onClick={() => setActiveFilter(label)}
          >
            {label}
          </Pill>
        ))}
      </FilterLine>

      {filtered.length === 0 ? (
        <Empty>
          No favorites match this filter yet.
          <div className="text-4xl mt-26 text-stone-600">
            start Adding{" "}
            <a
              href="/discover"
              className="text-[#e8590c] border-b hover:text-shadow-[1px_1px_6px_rgba(255,98,13,0.5)]"
            >
              new recipes!
            </a>{" "}
          </div>
        </Empty>
      ) : (
        <Grid>
          {filtered.map((meal) => (
            <RecipeCard
              key={meal.id}
              id={meal.id}
              title={meal.title}
              image={meal.image}
              rating={meal.rating}
              liked={true}
              onToggleLike={(id) => setPendingRemoveId(id)}
            />
          ))}
        </Grid>
      )}
      {pendingRemoveId && (
        <ConfirmModal
          message="Remove this recipe from your favorites?"
          onConfirm={handleConfirmRemove}
          onCancel={() => setPendingRemoveId(null)}
        />
      )}
    </Page>
  );
}

export default Favorites;
