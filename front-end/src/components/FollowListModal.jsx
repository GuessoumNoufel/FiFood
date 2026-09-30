import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { getUserFollowers, getUserFollowing, toggleFollow } from "../API/users";

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: rgba(32, 27, 22, 0.42);
  backdrop-filter: blur(4px);
`;

const Dialog = styled.section`
  width: min(100%, 42rem);
  max-height: min(70vh, 58rem);
  overflow: hidden;
  border: 1px solid #eee6da;
  border-radius: 1.8rem;
  background: #fffdf9;
  box-shadow: 0 2rem 6rem rgba(24, 20, 16, 0.22);
`;

const Heading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.8rem 2rem;
  border-bottom: 1px solid #eee6da;
  h2 {
    margin: 0;
    color: #2b2620;
    font:
      700 2rem "Fraunces",
      Georgia,
      serif;
  }
`;

const CloseButton = styled.button`
  display: grid;
  place-items: center;
  width: 3.6rem;
  height: 3.6rem;
  border: 0;
  border-radius: 50%;
  background: #f6f0e7;
  color: #5a5147;
  font-size: 2.2rem;
  cursor: pointer;
  &:hover {
    background: #eee3d3;
  }
`;

const List = styled.div`
  max-height: calc(min(70vh, 58rem) - 7rem);
  overflow-y: auto;
  padding: 0.6rem 1rem 1rem;
`;

const Person = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem;
  border-radius: 1.2rem;
  &:hover {
    background: #f8f1e7;
  }
  strong {
    display: block;
    font-size: 1.4rem;
  }
  span {
    display: block;
    margin-top: 0.3rem;
    color: #8a7f6e;
    font-size: 1.2rem;
  }
`;

const PersonLink = styled(Link)`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 1.2rem;
  color: #2b2620;
  text-decoration: none;
`;

const Avatar = styled.img`
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 50%;
  object-fit: cover;
  background: #f0e9dc;
`;

const InitialAvatar = styled.div`
  display: grid;
  place-items: center;
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 50%;
  background: #f6e8d7;
  color: #a9471f;
  font:
    700 1.8rem "Fraunces",
    Georgia,
    serif;
`;

const Status = styled.p`
  margin: 0;
  padding: 2.8rem 2rem;
  color: #82796d;
  font-size: 1.4rem;
  text-align: center;
`;

const FollowButton = styled.button`
  flex: 0 0 auto;
  min-width: 9rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid ${(props) => (props.$following ? "#e8e0d4" : "#c1592a")};
  border-radius: 999px;
  background: ${(props) => (props.$following ? "#fff" : "#c1592a")};
  color: ${(props) => (props.$following ? "#51483e" : "#fff")};
  font-size: 1.2rem;
  font-weight: 650;
  cursor: pointer;
  &:hover:not(:disabled) {
    background: ${(props) => (props.$following ? "#fff2ec" : "#a9471f")};
    border-color: ${(props) => (props.$following ? "#e6c4b1" : "#a9471f")};
  }
  &:disabled { opacity: 0.55; cursor: wait; }
`;

const LoginLink = styled(Link)`
  flex: 0 0 auto;
  color: #a9471f;
  font-size: 1.2rem;
  font-weight: 650;
  text-decoration: none;
`;

function FollowListModal({ userId, type, onClose }) {
  const { user: currentUser } = useContext(AuthContext);
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [pendingIds, setPendingIds] = useState(() => new Set());
  const title = type === "followers" ? "Followers" : "Following";

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setFailed(false);
    const request = type === "followers" ? getUserFollowers : getUserFollowing;
    request(userId)
      .then((response) => {
        if (isCurrent) setPeople(response.data ?? []);
      })
      .catch(() => {
        if (isCurrent) setFailed(true);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      isCurrent = false;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [userId, type, onClose]);

  const handleToggleFollow = async (personId) => {
    setPendingIds((current) => new Set(current).add(personId));
    try {
      const result = await toggleFollow(personId);
      window.dispatchEvent(
        new CustomEvent("fifood:follow-change", {
          detail: {
            userId: personId,
            following: result.following,
            followersCount: result.followersCount,
          },
        }),
      );
      setPeople((current) =>
        current.map((person) =>
          person._id === personId
            ? { ...person, amFollowing: result.following }
            : person,
        ),
      );
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Could not update follow");
    } finally {
      setPendingIds((current) => {
        const next = new Set(current);
        next.delete(personId);
        return next;
      });
    }
  };

  return (
    <Overlay
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby="follow-list-title"
      >
        <Heading>
          <h2 id="follow-list-title">{title}</h2>
          <CloseButton type="button" aria-label="Close" onClick={onClose}>
            ×
          </CloseButton>
        </Heading>
        <List>
          {loading ? (
            <Status>Loading {title.toLowerCase()}…</Status>
          ) : failed ? (
            <Status>Could not load this list. Please try again.</Status>
          ) : people.length === 0 ? (
            <Status>No {title.toLowerCase()} yet.</Status>
          ) : (
            people.map((person) => (
              <Person key={person._id}>
                <PersonLink to={`/profile/${person._id}`} onClick={onClose}>
                  {person.photo ? (
                    <Avatar src={person.photo} alt="" />
                  ) : (
                    <InitialAvatar aria-hidden="true">
                      {person.name?.[0] ?? "?"}
                    </InitialAvatar>
                  )}
                  <div>
                    <strong>{person.name}</strong>
                    <span>View profile</span>
                  </div>
                </PersonLink>
                {currentUser ? (
                  person._id === currentUser._id ? (
                    <FollowButton type="button" disabled>You</FollowButton>
                  ) : (
                    <FollowButton
                      type="button"
                      $following={person.amFollowing}
                      disabled={pendingIds.has(person._id)}
                      onClick={() => handleToggleFollow(person._id)}
                    >
                      {pendingIds.has(person._id)
                        ? "Saving…"
                        : person.amFollowing
                          ? "Following"
                          : "Follow"}
                    </FollowButton>
                  )
                ) : (
                  <LoginLink to="/login">Sign in to follow</LoginLink>
                )}
              </Person>
            ))
          )}
        </List>
      </Dialog>
    </Overlay>
  );
}

export default FollowListModal;
