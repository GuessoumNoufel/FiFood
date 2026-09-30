import { useState, useEffect, useCallback, useContext } from "react";
import styled from "styled-components";
import toast from "react-hot-toast";
import { getAllUsers, toggleFollow } from "../API/users";
import UserCard from "../components/UserCard";
import LoadingPage from "../components/LoadingPage";
import { AuthContext } from "../context/authContext";
import { isCacheFresh } from "../utils/cache";

const FRIENDS_CACHE_TTL = 30_000;
const friendsCache = new Map();

const Page = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 40px 48px 72px;
  font-family: "Inter", sans-serif;
`;

const Title = styled.h1`
  font-family: "Fraunces", Georgia, serif;
  font-size: 30px;
  margin: 0 0 4px;
  color: #2b2620;
`;

const Subtitle = styled.p`
  color: #8a7f6e;
  margin: 0 0 24px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

const SortTabs = styled.div`
  display: flex;
  gap: 8px;
`;

const Tab = styled.button`
  padding: 9px 18px;
  border-radius: 999px;
  font-size: 13px;
  border: 1px solid ${(props) => (props.$active ? "#C1592A" : "#E8E0D4")};
  background: ${(props) => (props.$active ? "#C1592A" : "#fff")};
  color: ${(props) => (props.$active ? "#fff" : "#4A4238")};
  cursor: pointer;

  &:hover {
    background: ${(props) => (props.$active ? "#A64A22" : "#F5EFE4")};
  }
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  border: 1px solid #d1cabf;
  border-radius: 999px;
  font-size: 13px;
  outline: none;
  min-width: 40rem;

  &:focus {
    border-color: #c1592a;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 28px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.4rem;
  align-content: start;
`;

const FilterBox = styled.div`
  background: #fff;
  border: 1px solid #e8e0d4;
  border-radius: 12px;
  padding: 18px;
  height: fit-content;
`;

const FilterTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #2b2620;
`;

const FilterOption = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: ${(props) => (props.$active ? "#C1592A" : "transparent")};
  color: ${(props) => (props.$active ? "#fff" : "#4A4238")};
  font-size: 13px;
  cursor: pointer;
  margin-bottom: 4px;

  &:hover {
    background: ${(props) => (props.$active ? "#A64A22" : "#F5EFE4")};
  }
`;

const ShowMoreButton = styled.button`
  display: block;
  margin: 28px auto 0;
  padding: 11px 28px;
  border-radius: 999px;
  border: 1px solid #e8e0d4;
  background: #fff;
  color: #c1592a;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #f5efe4;
  }
`;

const Empty = styled.p`
  color: #8a7f6e;
  padding: 40px 0;
  grid-column: 1 / -1;
`;

function DiscoverFriends() {
  const { user } = useContext(AuthContext);
  const [sort, setSort] = useState("recipes");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const cacheKey = JSON.stringify([
    user?._id ?? "anonymous",
    sort,
    filter,
    search.trim(),
  ]);
  const cachedFriends = friendsCache.get(cacheKey);
  const initialFriends =
    isCacheFresh(cachedFriends, FRIENDS_CACHE_TTL)
      ? cachedFriends
      : null;
  const [users, setUsers] = useState(initialFriends?.users ?? []);
  const [page, setPage] = useState(initialFriends?.page ?? 1);
  const [totalResults, setTotalResults] = useState(
    initialFriends?.totalResults ?? 0,
  );
  const [loading, setLoading] = useState(!initialFriends);

  const loadUsers = useCallback(
    (pageToLoad, replace) => {
      const cached = friendsCache.get(cacheKey);
      if (
        replace &&
        cached &&
        isCacheFresh(cached, FRIENDS_CACHE_TTL)
      ) {
        setUsers(cached.users);
        setPage(cached.page);
        setTotalResults(cached.totalResults);
        setLoading(false);
        return;
      }

      setLoading(true);
      getAllUsers({
        sort,
        filter,
        search: search.trim() || undefined,
        page: pageToLoad,
      })
        .then((res) => {
          const nextUsers = replace
            ? res.data
            : [...(friendsCache.get(cacheKey)?.users ?? []), ...res.data];
          const data = {
            users: nextUsers,
            totalResults: res.totalResults,
            page: pageToLoad,
            cachedAt: Date.now(),
          };
          friendsCache.set(cacheKey, data);
          setUsers(nextUsers);
          setTotalResults(res.totalResults);
        })
        .finally(() => setLoading(false));
    },
    [sort, filter, search, cacheKey],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start loading results for the current filter and search key.
    loadUsers(1, true);
  }, [sort, filter, search, loadUsers]);

  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadUsers(nextPage, false);
  };

  const handleToggleFollow = async (id) => {
    try {
      const res = await toggleFollow(id);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id
            ? {
                ...u,
                amFollowing: res.following,
                followersCount:
                  res.followersCount ??
                  u.followersCount + (res.following ? 1 : -1),
              }
          : u,
        ),
      );
      const cached = friendsCache.get(cacheKey);
      if (cached) {
        friendsCache.set(cacheKey, {
          ...cached,
          users: cached.users.map((u) =>
            u._id === id
              ? {
                  ...u,
                  amFollowing: res.following,
                  followersCount:
                    res.followersCount ??
                    u.followersCount + (res.following ? 1 : -1),
                }
              : u,
          ),
          cachedAt: Date.now(),
        });
      }
    } catch {
      toast.error("Could not update follow");
    }
  };

  const hasMore = users.length < totalResults;

  if (loading) return <LoadingPage message="Loading cooks" />;

  return (
    <Page>
      <Title>Join our community</Title>
      {/* <Title>Discover Cooks</Title> */}
      <Subtitle>
        Find amazing cooks, follow your favorites, and get inspired by their
        recipes.
      </Subtitle>

      <Controls>
        <SortTabs>
          <Tab $active={sort === "recipes"} onClick={() => { setPage(1); setSort("recipes"); }}>
            Most Recipes
          </Tab>
          <Tab
            $active={sort === "followers"}
            onClick={() => { setPage(1); setSort("followers"); }}
          >
            Most Followers
          </Tab>
          <Tab
            $active={sort === "following"}
            onClick={() => { setPage(1); setSort("following"); }}
          >
            Most Following
          </Tab>
        </SortTabs>
        <SearchInput
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
        />
      </Controls>

      <Layout>
        <div>
          <Grid>
            {users.length === 0 && !loading ? (
              <Empty>No users match this filter.</Empty>
            ) : (
              users.map((u) => (
                <UserCard
                  key={u._id}
                  user={u}
                  onToggleFollow={handleToggleFollow}
                />
              ))
            )}
          </Grid>

          {hasMore && (
            <ShowMoreButton onClick={handleShowMore}>
              Show more
            </ShowMoreButton>
          )}
        </div>

        <FilterBox>
          <FilterTitle>Filter By</FilterTitle>
          <FilterOption
            $active={filter === "all"}
            onClick={() => { setPage(1); setFilter("all"); }}
          >
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
                d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
              />
            </svg>
            All Users
          </FilterOption>
          <FilterOption
            $active={filter === "following"}
            onClick={() => { setPage(1); setFilter("following"); }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              width="16"
              height="16"
              viewBox="0 0 2048 2048"
              style={{
                color: "currentColor",
                opacity: 1,
                transform: "rotate(0deg)",
              }}
            >
              <path
                fill="currentColor"
                d="M1397 1550q-21-114-78-210t-141-166t-189-110t-221-40q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-117 35-229t101-207t157-169t203-113q-56-36-100-83t-76-103t-47-119t-17-129q0-106 40-199t109-163T568 40T768 0t199 40t163 109t110 163t40 200q0 66-16 129t-48 119t-75 103t-101 83q99 38 183 100t147 143t105 177t54 202l-57 58zM384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149m1645 941l-557 558l-269-270l90-90l179 178l467-466z"
              ></path>
            </svg>{" "}
            Following
          </FilterOption>
          <FilterOption
            $active={filter === "followers"}
            onClick={() => { setPage(1); setFilter("followers"); }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              style={{
                color: "currentColor",
                opacity: 1,
                transform: "rotate(0deg)",
              }}
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              >
                <path
                  stroke-miterlimit="10"
                  d="M9.432 10.57a4.718 4.718 0 1 0 0-9.436a4.718 4.718 0 0 0 0 9.436m-8.384 9.277c1.096-3.59 4.49-6.282 8.387-6.282c2.455 0 4.71 1.068 6.317 2.755"
                ></path>
                <path d="M12.923 19.433h10.03m-3.434-3.436l3.434 3.434l-3.434 3.434"></path>
              </g>
            </svg>
            Followers
          </FilterOption>
        </FilterBox>
      </Layout>
    </Page>
  );
}

export default DiscoverFriends;
