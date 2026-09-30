import { useState, useCallback, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { getRecipe } from "../api/recipes";
import { getMealById } from "../api/meals";
// import { toggleLike } from "../api/likes";
import { isLocalRecipeId } from "../utils/isLocalId";
// import { isLocalRecipeId } from "../utils/isLocalId";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useLikedRecipes } from "../hooks/useLikedRecipes";
import { getFavorites } from "../API/likes";
import RatingInput from "../components/RatingInput";
import { rateRecipe, deleteRecipe } from "../API/recipes";
import { createComment, getComments, updateComment } from "../API/comments";
import CommentsSection from "../components/commentsSection";
import LoadingPage from "../components/LoadingPage";
import ConfirmModal from "../components/ConfirmModel";

const fakeRating = () => (Math.random() * (4.9 - 4.0) + 4.0).toFixed(1);

const genericDescriptions = [
  "A delicious recipe to try at home for you, your friends, and your family.",
  "A comforting dish that's just as fun to make as it is to eat.",
  "A crowd-pleasing recipe worth adding to your regular rotation.",
];
const pickGenericDescription = () =>
  genericDescriptions[Math.floor(Math.random() * genericDescriptions.length)];

const Page = styled.div`
  max-width: 95rem;
  margin: 0 auto;
  padding: 24px 48px 64px;
  font-family: "Inter", sans-serif;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const BackLink = styled.button`
  font-family: "Fraunces", Georgia, serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #db5f00;
  text-transform: upperCase;
  display: flex;
  gap: 4px;
  cursor: pointer;
  display: inline-flex;
  &:hover {
    color: #e8590c;
    text-shadow: 1px 1px 12px #ff620d58;
  }
`;

const TopActions = styled.div`
  display: flex;
  gap: 16px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.$active ? "#e03131" : "#2B2620")};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const EditRecipeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 0.8rem 1.2rem;
  border: 1px solid #e8e0d4;
  border-radius: 999px;
  color: #4a4238;
  font-size: 1.3rem;
  font-weight: 600;
  text-decoration: none;
  &:hover { background: #f5efe4; }
`;

const DeleteRecipeButton = styled.button`
  padding: 0.8rem 1.2rem;
  border: 1px solid #f0d4cc;
  border-radius: 999px;
  background: #fff8f5;
  color: #a33d31;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #fff0eb; }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
`;

const RecipeImage = styled.img`
  width: 90%;
  border-radius: 16px;
  aspect-ratio: 4/3;
  object-fit: cover;
  background: #f0e9dc;
`;

const Title = styled.h1`
  font-family: "Fraunces", Georgia, serif;
  font-size: 30px;
  margin: 0 0 10px;
  color: #2b2620;
`;

const RatingRow = styled.div`
  color: #c1592a;
  font-size: 14px;
  margin-bottom: 12px;
`;

const Badges = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 14px;
`;

const Badge = styled.span`
  background: #f5efe4;
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 13px;
  color: #6b6255;
`;

const Description = styled.p`
  color: #4a4238;
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const AuthorRow = styled.div`
  margin-top: 3rem;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 1.3rem;
  color: #373737;
  font-weight: 500;
`;

const InfoBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rem;
  background: #f5efe4c7;
  /* box-shadow: 1px 1px 9px #33333337; */
  border: 1px solid #e8e0d4;
  border-radius: 12px;
  padding: 16px;
  margin: 28px 0;
  font-size: 14px;
  color: #4a4238;
`;

const VideoPrompt = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #c1592a;
  font-weight: 500;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.6fr;
  gap: 40px;
  margin-top: 20px;
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-family: "Inter", sans-serif;
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 14px;
  color: #2b2620;
`;

const IngredientItem = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #4a4238;
  margin-bottom: 10px;
`;

const InstructionsText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: #4a4238;
  white-space: pre-line;
`;
const AuthorLink = styled(Link)`
  color: #cc5312;
  font-weight: 500;
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
    text-shadow: 0.5px 0px 1px #cc531276;
  }
`;

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [recipe, setRecipe] = useState(null);
  const [isLocal, setIsLocal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingRating, setExistingRating] = useState(null);
  const [existingComment, setExistingComment] = useState(null);
  const { likedIds, setLikedIds, handleToggleLike } = useLikedRecipes();
  const liked = likedIds.has(id);
  const [allRatings, setAllRatings] = useState();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isOwner =
    isLocal &&
    user &&
    String(recipe?.createdBy?._id ?? recipe?.createdBy) === String(user._id);
  // fetch the recipe itself (local vs external)
  useEffect(() => {
    const local = isLocalRecipeId(id);
    setIsLocal(local);
    setLoading(true);

    const fetchRecipe = local ? getRecipe(id) : getMealById(id);

    fetchRecipe
      .then((res) => {
        const data = res.data;
        if (!local) {
          data.rating = fakeRating();
          data.description = pickGenericDescription();
        }
        setRecipe(data);
        // allRatings = zrecipe.ratings;
        // setAllRatings(recipe.ratings);
        setAllRatings(data.ratings ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // seed liked status from the user's real favorites, if logged in
  useEffect(() => {
    if (!user) return;

    getFavorites()
      .then((res) => {
        const ids = res.data.map((like) =>
          like.isLocalRecipe ? like.localRecipeId?._id : like.mealDBId,
        );
        setLikedIds(new Set(ids));
      })
      .catch(() => {});
  }, [user]);

  const handleLike = () => handleToggleLike(id);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Couldn't copy link!");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRecipe(id);
      toast.success("Recipe deleted");
      navigate("/discover", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Could not delete recipe");
    } finally {
      setConfirmDelete(false);
    }
  };

  const handleRatingSubmit = async ({ value, comment }) => {
    try {
      if (value) await rateRecipe(id, value);
      if (comment) await createComment(id, { text: comment.trim() });
      toast.success("Thanks for your feedback!");
      // re-fetch the recipe here to show the updated averageRating
      const newRecipe = await getRecipe(id);
      setRecipe(newRecipe.data);
    } catch (err) {
      toast.error("Could not save your rating");
    }
  };

  useEffect(() => {
    if (!user || !recipe) {
      setExistingRating(null);
      return;
    }
    const found = recipe.ratings?.find(
      (el) => String(el.user?._id ?? el.user) === String(user._id),
    );
    const find = recipe.ratings;
    setAllRatings(find);
    setExistingRating(found ?? null);
  }, [user, recipe]);

  const fetchComments = useCallback(async () => {
    if (!user) {
      setExistingComment(null);
      return;
    }

    const result = await getComments(id);
    const comments = result.data;

    if (!comments || comments.length === 0) {
      setExistingComment(null);
      return;
    }

    const foundC = comments.find(
      (el) => String(el.user?._id ?? el.user) === String(user._id),
    );

    setExistingComment(foundC ?? null);
  }, [id, user]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, recipe]);

  if (loading) return <LoadingPage message="We’re bringing this recipe to the table." />;
  if (!recipe) return <p style={{ padding: "48px" }}>Recipe not found.</p>;

  return (
    <Page className="bg-stone-0">
      <TopBar>
        <BackLink onClick={() => navigate(-1)}>← Back</BackLink>
        <TopActions>
          {isOwner && (
            <>
              <EditRecipeButton to={`/recipe/${id}/edit`}>Edit</EditRecipeButton>
              <DeleteRecipeButton onClick={() => setConfirmDelete(true)}>
                Delete
              </DeleteRecipeButton>
            </>
          )}
          <ActionButton $active={liked} onClick={handleLike}>
            {liked ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#e03131"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                <p> saved </p>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-8"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                <p> save </p>
              </>
            )}
          </ActionButton>
          <ActionButton onClick={handleShare}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
              />
            </svg>
            <p>Share</p>
          </ActionButton>
        </TopActions>
      </TopBar>

      <MainGrid>
        <RecipeImage src={recipe.image} alt={recipe.title} />

        <div>
          <Title>{recipe.title}</Title>

          {isLocal ? (
            recipe.averageRating > 0 ? (
              <RatingRow>
                ★ {recipe.averageRating.toFixed(1)} (
                {recipe.ratings?.length ?? 0} reviews)
              </RatingRow>
            ) : (
              <RatingRow style={{ color: "#A69C8C" }}>No ratings yet</RatingRow>
            )
          ) : (
            <RatingRow>★ {recipe.rating}</RatingRow>
          )}

          <Badges>
            <Badge>{recipe.category}</Badge>
            <Badge>{recipe.area}</Badge>
          </Badges>

          <Description>{recipe.description}</Description>

          {/* <AuthorRow>
            {isLocal
              ? `created By ${recipe.createdBy?.name}?? "a FiFood user".`
              : "Coming from TheMealDB website"}
          </AuthorRow> */}
          <AuthorRow>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.75"
              stroke="currentColor"
              class="size-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            {isLocal ? (
              recipe.createdBy &&
              recipe.createdBy._id &&
              recipe.createdBy.name ? (
                <>
                  Created by{" "}
                  <AuthorLink to={`/profile/${recipe.createdBy._id}`}>
                    {recipe.createdBy.name}
                  </AuthorLink>
                </>
              ) : (
                "Created by a FiFood user"
              )
            ) : (
              "Coming from TheMealDB website"
            )}
          </AuthorRow>
        </div>
      </MainGrid>

      <InfoBar>
        {isLocal ? (
          <>
            <span className="flex gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              {recipe.time ? `${recipe.time} min` : "N/A"}
            </span>
            <span className="flex gap-2 items-center">
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
                  d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                />
              </svg>
              {recipe.servings ? `${recipe.servings} servings` : "N/A"}
            </span>
            <span className="flex gap-2 items-center">
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
                  d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                />
              </svg>
              {recipe.difficulty ?? "N/A"}
            </span>
          </>
        ) : recipe.youtube ? (
          <VideoPrompt href={recipe.youtube} target="_blank" rel="noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-10"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
              />
            </svg>
            Want more details? Watch a video on how to make it
          </VideoPrompt>
        ) : (
          <span>No video available for this recipe.</span>
        )}
      </InfoBar>
      <ContentGrid>
        <div>
          <SectionTitle>Ingredients</SectionTitle>
          {recipe.ingredients?.map((ing, i) => (
            <IngredientItem key={i}>
              <input type="checkbox" /> {ing}
            </IngredientItem>
          ))}
        </div>

        <div>
          <SectionTitle>Instructions</SectionTitle>
          <InstructionsText>{recipe.instructions}</InstructionsText>
        </div>
      </ContentGrid>
      {isLocal && (
        <RatingInput
          key={existingRating?._id ?? "new"}
          existingRating={existingRating}
          existingComment={existingComment}
          onSubmit={handleRatingSubmit}
        />
      )}
      <CommentsSection
        // onEditComment={onEditComment}
        recipeId={id}
        refetch={handleRatingSubmit}
        allRatings={allRatings}
      />
      {confirmDelete && (
        <ConfirmModal
          message="This will permanently remove your recipe. This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </Page>
  );
}

export default RecipeDetail;
