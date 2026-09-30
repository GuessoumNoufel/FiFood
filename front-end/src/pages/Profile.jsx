import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import { getUserProfile, getUserRecipes, toggleFollow } from "../api/users";
import { getFavorites } from "../api/likes";
import RecipeCard from "../components/RecipeCard";
import { AuthContext } from "../context/AuthContext";
import { useLikedRecipes } from "../hooks/useLikedRecipes";
import LoadingPage from "../components/LoadingPage";
import FollowListModal from "../components/FollowListModal";

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto 64px;
  font-family: "Inter", sans-serif;
`;

const Cover = styled.div`
  height: 200px;
  background: #e8e0d4 url(${(props) => props.$src}) center/cover no-repeat;
  border-radius: 0 0 16px 16px;
`;

const HeaderRow = styled.div`
  display: flex;
  gap: 24px;
  padding: 0 32px;
  margin-top: -50px;
`;

const Avatar = styled.img`
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  border: 4px solid #fbf7f1;
  object-fit: cover;
  background: #f0e9dc;
  flex-shrink: 0;
`;

const Identity = styled.div`
  padding-top: 56px;
  width: 100%;
`;

const Name = styled.h1`
  font-family: "Fraunces", Georgia, serif;
  font-size: 28px;
  margin: 0 0 4px;
  color: #2b2620;
`;

const Meta = styled.p`
  font-size: 14px;
  color: #8a7f6e;
  margin: 0 0 12px;
`;

const Bio = styled.p`
  font-size: 14px;
  color: #4a4238;
  line-height: 1.55;
  max-width: 520px;
  margin: 0 0 20px;
`;

const StatsRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* gap: 120px; */
  margin-bottom: 8px;
`;

const Stat = styled.div`
  text-align: center;
`;

const ClickableStat = styled.button`
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: pointer;
  &:hover > div:first-child { color: #c1592a; }
  &:focus-visible { outline: 2px solid #c1592a; outline-offset: 4px; border-radius: 4px; }
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #2b2620;
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #8a7f6e;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
  align-items: center;
`;

const OutlineButton = styled(Link)`
  border: 1px solid #e8e0d4;
  border-radius: 999px;
  padding: 9px 20px;
  font-size: 14px;
  /* color: #4a4238; */
  color: white;
  text-decoration: none;
  background-color: #544b49;

  &:hover {
    /* background: #f5efe4; */
    background: #3d3a39;
    font-weight: 500;
  }
`;
const OutlineButtonUpdate = styled(Link)`
  border: 1px solid #e8e0d4;
  border-radius: 999px;
  padding: 9px 20px;
  font-size: 14px;
  color: #4a4238;
  /* color: white; */
  text-decoration: none;
  /* background-color: #544b49; */

  &:hover {
    background: #f5efe4;
    /* background: #3d3a39; */
  }
`;

const SolidButton = styled.button`
  border: none;
  border-radius: 999px;
  padding: 10px 22px;
  font-size: 14px;
  color: #fff;
  background: ${(props) => (props.$following ? "#8A7F6E" : "#C1592A")};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 28px;
  border-bottom: 1px solid #e8e0d4;
  margin: 32px 32px 0;
`;

const Tab = styled.button`
  background: none;
  border: none;
  border-bottom: 2px solid
    ${(props) => (props.$active ? "#C1592A" : "transparent")};
  color: ${(props) => (props.$active ? "#2B2620" : "#8A7F6E")};
  font-size: 15px;
  padding: 0 0 12px;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 28px 32px 0;
`;

const Empty = styled.p`
  color: #8a7f6e;
  padding: 40px 32px;
`;

const NotFoundPage = styled.main`
  min-height: 55vh;
  display: grid;
  place-items: center;
  padding: 4rem 2.4rem;
  text-align: center;
`;

const NotFoundContent = styled.div`
  max-width: 48rem;
`;

const NotFoundCode = styled.p`
  margin: 0 0 0.8rem;
  color: #c1592a;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const NotFoundTitle = styled.h1`
  margin: 0 0 1.2rem;
  color: #2b2620;
  font: 700 3.6rem/1.15 "Fraunces", Georgia, serif;
`;

const NotFoundMessage = styled.p`
  margin: 0 0 2.4rem;
  color: #746b5f;
  font-size: 1.6rem;
  line-height: 1.6;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  padding: 1.1rem 2rem;
  border-radius: 999px;
  background: #c1592a;
  color: white;
  font-size: 1.4rem;
  font-weight: 600;
  text-decoration: none;

  &:hover { background: #a9471f; }
`;

const fakeRating = () => (Math.random() * (4.9 - 4.0) + 4.0).toFixed(1);
const PROFILE_CACHE_TTL = 30_000;
const profileCache = new Map();

function Profile() {
  const { id } = useParams();
  const { user: me } = useContext(AuthContext);
  const isMe = me && me._id === id;
  const profileCacheKey = `${id}:${me?._id ?? "public"}`;
  const cachedProfile = profileCache.get(profileCacheKey);
  const cachedData =
    cachedProfile && Date.now() - cachedProfile.cachedAt < PROFILE_CACHE_TTL
      ? cachedProfile
      : null;

  const [profile, setProfile] = useState(cachedData?.profile ?? null);
  const [recipesCount, setRecipesCount] = useState(cachedData?.recipesCount ?? 0);
  const [recipes, setRecipes] = useState(cachedData?.recipes ?? []);
  const [favorites, setFavorites] = useState([]);
  const [following, setFollowing] = useState(
    cachedData?.profile?.amFollowing ?? false,
  );
  const [followListType, setFollowListType] = useState(null);
  const [activeTab, setActiveTab] = useState("recipes");
  const [loading, setLoading] = useState(!cachedData);
  // const [favoritesNum, setFavoriteNum] = useState(favorites.length);

  const {
    likedIds,
    setLikedIds,
    handleToggleLike: baseToggleLike,
  } = useLikedRecipes();

  useEffect(() => {
    const cached = profileCache.get(profileCacheKey);
    if (cached && Date.now() - cached.cachedAt < PROFILE_CACHE_TTL) {
      setProfile(cached.profile);
      setRecipesCount(cached.recipesCount);
      setRecipes(cached.recipes);
      setFollowing(Boolean(cached.profile.amFollowing));
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);
    Promise.all([getUserProfile(id), getUserRecipes(id)])
      .then(([profileRes, recipesRes]) => {
        const data = {
          profile: profileRes.data.user,
          recipesCount: profileRes.data.recipesCount,
          recipes: recipesRes.data,
          cachedAt: Date.now(),
        };
        if (data.profile) profileCache.set(profileCacheKey, data);
        if (isCurrent) {
          setProfile(data.profile);
          setRecipesCount(data.recipesCount);
          setRecipes(data.recipes);
          setFollowing(Boolean(data.profile?.amFollowing));
        }
      })
      .catch(() => {
        if (isCurrent) setProfile(null);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [id, profileCacheKey]);

  useEffect(() => {
    if (!isMe) return;
    getFavorites()
      .then((res) => {
        setFavorites(res.data);
        const ids = res.data.map((like) =>
          like.isLocalRecipe ? like.localRecipeId?._id : like.mealDBId,
        );
        setLikedIds(new Set(ids));
      })
      .catch(() => setFavorites([]));
  }, [isMe, setLikedIds]);

  useEffect(() => {
    const syncFollowChange = (event) => {
      const { userId, following: isFollowing, followersCount } = event.detail;
      const targetCacheKey = `${userId}:${me?._id ?? "public"}`;
      const cached = profileCache.get(targetCacheKey);
      if (cached?.profile) {
        profileCache.set(targetCacheKey, {
          ...cached,
          profile: {
            ...cached.profile,
            amFollowing: isFollowing,
            followersCount:
              followersCount ?? cached.profile.followersCount,
          },
          cachedAt: Date.now(),
        });
      }

      if (String(userId) === String(id)) {
        setFollowing(isFollowing);
        setProfile((current) =>
          current
            ? {
                ...current,
                amFollowing: isFollowing,
                followersCount: followersCount ?? current.followersCount,
              }
            : current,
        );
      }
    };

    window.addEventListener("fifood:follow-change", syncFollowChange);
    return () =>
      window.removeEventListener("fifood:follow-change", syncFollowChange);
  }, [id, me?._id]);

  // useEffect(() => {
  //   getFavorites().then((res) => {
  //     setFavorites(res.data);
  //   });
  //   setFavoriteNum(favorites.length);
  //   console.log(favorites);
  // }, [handleToggleLike]);

  const handleFollow = async () => {
    try {
      const res = await toggleFollow(id);
      setFollowing(res.following);
      setProfile((current) => {
        if (!current) return current;
        const updated = {
          ...current,
          amFollowing: res.following,
          followersCount:
            res.followersCount ??
            Math.max(0, current.followersCount + (res.following ? 1 : -1)),
        };
        const cached = profileCache.get(profileCacheKey);
        if (cached) {
          profileCache.set(profileCacheKey, {
            ...cached,
            profile: updated,
            cachedAt: Date.now(),
          });
        }
        return updated;
      });
      toast.success(res.following ? `Following ${profile.name}` : "Unfollowed");
    } catch {
      toast.error("Could not update follow");
    }
  };
  const closeFollowList = useCallback(() => setFollowListType(null), []);
  const handleToggleLike = async (id) => {
    const wasLiked = likedIds.has(id);
    await baseToggleLike(id);

    if (wasLiked) {
      setFavorites((prev) =>
        prev.filter(
          (f) => (f.isLocalRecipe ? f.localRecipeId?._id : f.mealDBId) !== id,
        ),
      );
    }
    if (!wasLiked) {
      const res = await getFavorites();
      setFavorites(res.data);
    }
  };
  if (loading) return <LoadingPage message="Loading profile" />;
  if (!profile) {
    return (
      <NotFoundPage>
        <NotFoundContent>
          <NotFoundCode>404 · Profile unavailable</NotFoundCode>
          <NotFoundTitle>User not found</NotFoundTitle>
          <NotFoundMessage>
            This profile may have been removed, or the link may be incorrect.
          </NotFoundMessage>
          <HomeButton to="/">Back to home</HomeButton>
        </NotFoundContent>
      </NotFoundPage>
    );
  }

  return (
    <Page>
      <Cover $src={profile.coverImage} />

      <HeaderRow>
        <Avatar src={profile.photo} alt={profile.name} />
        <Identity>
          <Name>{profile.name}</Name>
          <div className="flex gap-8">
            {profile.country ? (
              <>
                <div className="flex gap-1 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6 mt-1"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                  <span>
                    {profile.country ? <Meta>{profile.country}</Meta> : null}
                  </span>
                </div>
              </>
            ) : (
              <Meta>Home cook</Meta>
            )}
          </div>
          <Bio>{profile.bio}</Bio>

          <StatsRow>
            <div className="flex gap-12">
              <Stat>
                <StatValue>{recipesCount}</StatValue>
                <StatLabel>Recipes</StatLabel>
              </Stat>
              <ClickableStat
                type="button"
                aria-label={`View ${profile.followersCount} followers`}
                onClick={() => setFollowListType("followers")}
              >
                <StatValue>{profile.followersCount}</StatValue>
                <StatLabel>Followers</StatLabel>
              </ClickableStat>
              <ClickableStat
                type="button"
                aria-label={`View ${profile.followingCount} following`}
                onClick={() => setFollowListType("following")}
              >
                <StatValue>{profile.followingCount}</StatValue>
                <StatLabel>Following</StatLabel>
              </ClickableStat>
            </div>
            <div>
              <Actions>
                {isMe ? (
                  <>
                    <OutlineButtonUpdate to="/edit-profile">
                      Edit Profile
                    </OutlineButtonUpdate>
                    <OutlineButton to="/create-recipe">
                      + Add Recipe
                    </OutlineButton>
                  </>
                ) : me ? (
                  <SolidButton $following={following} onClick={handleFollow}>
                    {following ? "Following" : "Follow"}
                  </SolidButton>
                ) : null}
              </Actions>
            </div>
          </StatsRow>
        </Identity>
      </HeaderRow>

      <Tabs>
        <Tab
          $active={activeTab === "recipes"}
          onClick={() => setActiveTab("recipes")}
        >
          My Recipes
        </Tab>
        {isMe && (
          <>
            <Tab
              $active={activeTab === "favorites"}
              onClick={() => {
                setActiveTab("favorites");
              }}
            >
              Favorites({favorites.length})
            </Tab>
            <Tab
              $active={activeTab === "ratings"}
              onClick={() => setActiveTab("ratings")}
            >
              My Ratings
            </Tab>
          </>
        )}
      </Tabs>

      {activeTab === "recipes" &&
        (recipes.length === 0 ? (
          <Empty>No recipes posted yet.</Empty>
        ) : (
          <Grid>
            {recipes.map((r) => (
              <RecipeCard
                key={r._id}
                id={r._id}
                title={r.title}
                image={r.image}
                category={r.category}
                rating={r.averageRating > 0 ? r.averageRating.toFixed(1) : null}
                liked={likedIds.has(r._id)}
                onToggleLike={handleToggleLike}
              />
            ))}
          </Grid>
        ))}

      {activeTab === "favorites" &&
        (favorites.length === 0 ? (
          <Empty>No favorites yet.</Empty>
        ) : (
          <Grid>
            {favorites.map((like) => {
              const local = like.isLocalRecipe && like.localRecipeId;
              return (
                <RecipeCard
                  key={like._id}
                  id={local ? like.localRecipeId._id : like.mealDBId}
                  title={local ? like.localRecipeId.title : like.title}
                  image={local ? like.localRecipeId.image : like.image}
                  category={local ? like.localRecipeId.category : like.category}
                  rating={local ? null : fakeRating()}
                  liked
                  liked={likedIds.has(
                    local ? like.localRecipeId._id : like.mealDBId,
                  )}
                  onToggleLike={handleToggleLike}
                />
              );
            })}
          </Grid>
        ))}

      {activeTab === "ratings" && (
        <Empty>You haven't rated any recipes yet.</Empty>
      )}
      {followListType && (
        <FollowListModal
          userId={id}
          type={followListType}
          onClose={closeFollowList}
        />
      )}
    </Page>
  );
}

export default Profile;
