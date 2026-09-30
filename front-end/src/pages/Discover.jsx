import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  discoverMeals,
  searchMealsByName,
  filterMealsByArea,
} from "../API/meals";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/pagination";
import SearchBar from "../components/SearchBar";
import discoverCover from "../assets/discover-cover.webp";
import { useLikedRecipes } from "../hooks/useLikedRecipes";
import LoadingPage from "../components/LoadingPage";
import BackHome from "../components/BackHome";
import { isCacheFresh } from "../utils/cache";

const SearchBarOnDiscover = styled(SearchBar)`
  margin-bottom: 0;
  max-width: 600px;
  min-width: 500px;
  &:focus-within {
    box-shadow: 2px 2px 13px rgba(255, 111, 0, 0.308);
  }
`;

const MineHeading = styled.h1`
  font-size: 3.9rem;
  font-weight: 700;
  font-family: "Fraunces", Georgia, serif;
  color: white;
  /* height: 100%; */
  margin: 0;
`;

const fakeRating = () => (Math.random() * (4.9 - 4.0) + 4.0).toFixed(1);
const LIMIT = 15;
const DISCOVER_CACHE_TTL = 30_000;
const discoverCache = new Map();

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  /* grid-template-columns: repeat(4, 1fr); */
  gap: 20px;
  padding: 40px 48px;
`;

const Heading = styled.h1`
  font-family: "Fraunces", Georgia, serif;
  font-size: 28px;
  /* padding: 32px 48px 0; */
  margin: 0;
  color: #2b2620;
`;
const HeadingCover = styled.div`
  background-image: url(${discoverCover});
  background-size: calc(100%);
  background-position: center;
  background-repeat: no-repeat;
  align-items: center;
  width: 100%;
  height: 28rem;
  margin-top: -0.6rem;
  /* z-index: -33; */
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search");
  const page = Number(searchParams.get("page")) || 1;
  const area = searchParams.get("area");
  const cacheKey = JSON.stringify([search ?? "", area ?? "", page]);
  const cachedResults = discoverCache.get(cacheKey);
  const initialResults =
    isCacheFresh(cachedResults, DISCOVER_CACHE_TTL)
      ? cachedResults
      : null;
  const [meals, setMeals] = useState(initialResults?.meals ?? []);
  const [results, setResults] = useState(initialResults?.results ?? 0);
  const [loading, setLoading] = useState(!initialResults);
  const [totalResults, setTotalResults] = useState(
    initialResults?.totalResults ?? 0,
  );
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  // const [likedIds, setLikedIds] = useState(new Set());
  // const handleToggleLike = async (id) => {
  //   try {
  //     await toggleLike(id);

  //     const wasLiked = likedIds.has(id);

  //     setLikedIds((prev) => {
  //       const next = new Set(prev);
  //       if (wasLiked) next.delete(id);
  //       else next.add(id);
  //       return next;
  //     });

  //     toast.success(
  //       wasLiked ? "Removed from favorites" : "Added to favorites!",
  //     );
  //   } catch (err) {
  //     toast.error("Please log in to save recipes");
  //   }
  // };
  const { likedIds, setLikedIds, handleToggleLike } = useLikedRecipes();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/discover?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };
  useEffect(() => {
    const cached = discoverCache.get(cacheKey);
    if (isCacheFresh(cached, DISCOVER_CACHE_TTL)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate this URL key from its in-memory cache.
      setMeals(cached.meals);
      setResults(cached.results);
      setTotalResults(cached.totalResults);
      setLikedIds(new Set(cached.likedMealIds));
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);

    let request;

    if (search) request = searchMealsByName(search, page);
    else if (area) request = filterMealsByArea(area, page);
    else request = discoverMeals(page);

    request
      .then((res) => {
        const data = {
          meals: res.data.map((meal) => ({ ...meal, rating: fakeRating() })),
          results: res.totalResults,
          totalResults: res.totalResults,
          likedMealIds: res.likedMealIds ?? [],
          cachedAt: Date.now(),
        };
        discoverCache.set(cacheKey, data);
        if (isCurrent) {
          setMeals(data.meals);
          setResults(data.results);
          setTotalResults(data.totalResults);
          setLikedIds(new Set(data.likedMealIds));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [search, page, area, cacheKey, setLikedIds]);

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", newPage);
      return next;
    });
    window.scrollTo(0, 0);
  };

  if (loading) return <LoadingPage message="We’re finding recipes worth gathering around." />;

  const totalPages = Math.ceil(totalResults / LIMIT);

  return (
    <>
      <div className="bg-stone-100">
        <HeadingCover>
          <div>
            <MineHeading>Find your next meal</MineHeading>
            <SearchBarOnDiscover
              query={query}
              setQuery={setQuery}
              handleSearch={handleSearch}
            />
          </div>
        </HeadingCover>

        <div className="flex justify-between items-center pl-15 pr-22 border-b border-stone-300 py-3">
          <div className="">
            <BackHome to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-7"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
              back home{" "}
            </BackHome>
            {/* <Heading>
              {search ? (
                <>
                  <span className=" font-stretch-50% ">{results}</span> Results
                  for "{search}"
                </>
              ) : (
                <Heading>Start Discovering</Heading>
              )}
            </Heading> */}
            <Heading>
              {search ? (
                <>
                  {results} Results for "{search}"
                </>
              ) : area ? (
                <>{area} recipes</>
              ) : (
                <Heading>Start Discovering</Heading>
              )}
            </Heading>
          </div>
        </div>
        <Grid>
          {meals.map((meal) => (
            <RecipeCard
              key={meal.mealDBId}
              id={meal.mealDBId}
              title={meal.title}
              image={meal.image}
              rating={meal.rating}
              liked={likedIds.has(meal.mealDBId)}
              onToggleLike={handleToggleLike}
            />
          ))}
        </Grid>
        {!area ? (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : null}
      </div>
    </>
  );
}

export default Discover;
