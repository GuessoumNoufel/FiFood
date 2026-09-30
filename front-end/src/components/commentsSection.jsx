import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../context/authContext";
import {
  getComments,
  deleteComment,
  toggleCommentLike,
  updateComment,
} from "../API/comments";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModel";

// Adjust these three imports if your project's actual paths/exports differ:
// - AuthContext: assumed to expose { user } directly via useContext(AuthContext)
// - api/comments: assumed to export getComments(recipeId), deleteComment(id), toggleCommentLike(id)
// - onEditComment prop: call it with the full comment object; wire it up to your existing comment input in edit mode

const PAGE_SIZE = 10;
const TRUNCATE_AT = 340;
const MAX_LENGTH = 500;

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [label, secondsInUnit] of units) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) return `${value} ${label}${value > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

export default function CommentsSection({ recipeId, refetch, allRatings }) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [confirmModel, setConfirmModel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [commentId, setCommentId] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [draftText, setDraftText] = useState("");

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the loading state while comments for this recipe are fetched.
    setLoading(true);
    getComments(recipeId)
      .then((res) => {
        if (!cancelled) setComments(res.data);
      })
      .catch(() => {
        // if (!cancelled) toast.error("Couldn't load comments");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [recipeId, refetch]);

  const toggleExpanded = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleLike = async (commentId) => {
    if (!user) return;
    const target = comments.find((c) => c._id === commentId);
    const alreadyLiked = target?.likes.includes(user._id);

    setComments((prev) =>
      prev.map((c) =>
        c._id === commentId
          ? {
              ...c,
              likes: alreadyLiked
                ? c.likes.filter((id) => id !== user._id)
                : [...c.likes, user._id],
              likesCount: alreadyLiked ? c.likesCount - 1 : c.likesCount + 1,
            }
          : c,
      ),
    );

    try {
      await toggleCommentLike(commentId);
    } catch {
      toast.error("Something went wrong, try again");
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? {
                ...c,
                likes: alreadyLiked
                  ? [...c.likes, user._id]
                  : c.likes.filter((id) => id !== user._id),
                likesCount: alreadyLiked ? c.likesCount + 1 : c.likesCount - 1,
              }
            : c,
        ),
      );
    }
  };

  const handleDelete = async (commentId) => {
    const previous = comments;
    setComments((prev) => prev.filter((c) => c._id !== commentId));
    try {
      await deleteComment(commentId);
      const newComments = await getComments(recipeId);
      setComments(newComments.data);
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
      setComments(previous);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setDraftText(comment.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftText("");
  };

  const handleSaveEdit = async (id) => {
    const trimmed = draftText.trim();
    if (!trimmed) return;

    const previous = comments;
    setComments((prev) =>
      prev.map((c) => (c._id === id ? { ...c, text: trimmed } : c)),
    );
    setEditingId(null);
    setDraftText("");

    try {
      await updateComment(id, trimmed);
      toast.success("Comment updated");
    } catch {
      toast.error("Failed to update comment");
      setComments(previous);
    }
  };

  useEffect(() => {
    if (!confirmModel) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, [confirmModel]);

  const visibleComments = comments?.slice(0, visibleCount);

  return (
    <Wrapper>
      <>
        <Header>
          <Title>
            Comments <Count>{comments.length}</Count>
          </Title>
          <Subtitle>
            Share your thoughts, tips, or your experience with this recipe.
          </Subtitle>
        </Header>

        {loading ? (
          <StateText>Loading comments…</StateText>
        ) : comments.length === 0 ? (
          <StateText>
            No comments yet — be the first to share your thoughts.
          </StateText>
        ) : (
          <List>
            {visibleComments.map((comment) => {
              const isOwn = user && comment.user._id === user._id;
              const isEditing = editingId === comment._id;
              const isLong = comment.text.length > TRUNCATE_AT;
              const isExpanded = expandedIds.has(comment._id);
              const displayText =
                isLong && !isExpanded
                  ? comment.text.slice(0, TRUNCATE_AT).trimEnd() + "…"
                  : comment.text;
              const isLiked = !!user && comment.likes.includes(user._id);

              return (
                <Card key={comment._id}>
                  <Avatar src={comment.user.photo} alt={comment.user.name} />
                  <Body>
                    <Meta>
                      <Author>{isOwn ? "You" : comment.user.name}</Author>
                      <div>
                        {(() => {
                          const rating = allRatings.find((el) => {
                            return el.user === comment.user._id;
                          });
                          return rating ? (
                            <RT className="flex gap-0.5">
                              {rating.value}{" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="#fcc419"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="#fcc419"
                                class="size-5"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                />
                              </svg>
                            </RT>
                          ) : null;
                        })()}
                      </div>
                      <div className="flex justify-center items-center gap-1 mt-0.5">
                        <Dot>·</Dot>
                        <Time>{timeAgo(comment.createdAt)}</Time>
                      </div>
                    </Meta>

                    {isEditing ? (
                      <EditBox>
                        <EditTextarea
                          value={draftText}
                          onChange={(e) =>
                            setDraftText(e.target.value.slice(0, MAX_LENGTH))
                          }
                          maxLength={MAX_LENGTH}
                          rows={3}
                          autoFocus
                        />
                        <EditFooter>
                          <CharCount>
                            {draftText.length}/{MAX_LENGTH}
                          </CharCount>
                          <EditActions>
                            <ActionButton type="button" onClick={cancelEdit}>
                              Cancel
                            </ActionButton>
                            <SaveButton
                              type="button"
                              disabled={!draftText.trim()}
                              onClick={() => handleSaveEdit(comment._id)}
                            >
                              Save
                            </SaveButton>
                          </EditActions>
                        </EditFooter>
                      </EditBox>
                    ) : (
                      <>
                        <Text>
                          {displayText}{" "}
                          {isLong && (
                            <ToggleLink
                              onClick={() => toggleExpanded(comment._id)}
                            >
                              {isExpanded ? "Show less" : "Show more"}
                            </ToggleLink>
                          )}
                        </Text>

                        <Actions>
                          <LikeButton
                            type="button"
                            $liked={isLiked}
                            onClick={() => handleLike(comment._id)}
                          >
                            <HeartIcon $liked={isLiked} viewBox="0 0 24 24">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill={isLiked}
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke={isLiked}
                                class="size-6"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                />
                              </svg>
                            </HeartIcon>
                            {comment.likesCount}
                          </LikeButton>

                          {isOwn && (
                            <OwnerActions>
                              <ActionButton
                                type="button"
                                onClick={() => startEdit(comment)}
                              >
                                Edit
                              </ActionButton>
                              <ActionButton
                                type="button"
                                $danger
                                onClick={() => {
                                  setCommentId(comment._id);
                                  setConfirmModel(true);
                                }}
                              >
                                Delete
                              </ActionButton>
                            </OwnerActions>
                          )}
                        </Actions>
                      </>
                    )}
                  </Body>
                </Card>
              );
            })}
          </List>
        )}

        {visibleCount < comments.length && (
          <ShowMoreButton
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
          >
            Show more
          </ShowMoreButton>
        )}
      </>
      {confirmModel && (
        <ConfirmModal
          onCancel={() => setConfirmModel(false)}
          onConfirm={async () => {
            await handleDelete(commentId);
            setConfirmModel(false);
          }}
          message={"delete this comment ?"}
        />
      )}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  max-width: 100%;
  margin: 0 auto;
`;

const Header = styled.div`
  border-bottom: 1px solid #efe2d2;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  margin-top: 2.5rem;
`;

const Title = styled.h2`
  font-family: "Playfair Display", Georgia, serif;
  font-size: 3.3rem;
  color: #3a2a1c;
  display: flex;
  font-weight: 500;
  align-items: center;
  gap: 12px;
  margin: 0 0 8px;
`;

const Count = styled.span`
  font-family: system-ui, sans-serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #b5541f;
  background: #f6ddb9;
  /* padding: 4px 14px; */
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 999px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Subtitle = styled.p`
  color: #8a7a6a;
  font-size: 1.1rem;
  margin: 0;
`;
const RT = styled.div`
  color: #f08c00;
  font-size: 1.1rem;
  margin: 0;
  display: flex;
  /* justify-content: center; */
  align-items: center;
  margin-left: 5px;
`;

const StateText = styled.p`
  font-size: 1.2rem;
  color: #8a7a6a;
  padding: 24px 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
`;

const Card = styled.div`
  display: flex;
  gap: 14px;
  /* background: #fffdf9; */
  border: 1px solid #868e9657;
  box-shadow: 1px 1px 10px #868e9678;
  border-radius: 14px;
  padding: 1.8rem 2rem;
`;

const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

const Author = styled.span`
  font-weight: 700;
  font-size: 1.2rem;
  color: #3a2a1cdf;
`;

const Dot = styled.span`
  color: #b8a896;
  font-size: 3rem;
  /* display: flex; */
  /* align-items: baseline; */
  margin-top: auto;
`;

const Time = styled.span`
  font-size: 0.96rem;
  color: #a5947f;
`;

const Text = styled.p`
  color: #4a3b2c;
  line-height: 1.55;
  margin: 0 0 10px;
  word-break: break-word;
  font-size: 1.25rem;
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: #b5541f;
  font-weight: 600;
  cursor: pointer;
  font-size: inherit;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LikeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${(p) => (p.$liked ? "#c1502e" : "#a5947f")};
  font-weight: 600;
  padding: 0;
`;

const HeartIcon = styled.svg`
  width: 18px;
  height: 18px;
  fill: ${(p) => (p.$liked ? "#c1502e" : "none")};
  stroke: ${(p) => (p.$liked ? "#c1502e" : "#a5947f")};
  stroke-width: 1.8;
`;

const OwnerActions = styled.div`
  display: flex;
  gap: 14px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  /* font-weight: 550; */
  text-shadow: 0.5px 1px 1px ${(p) => (p.$danger ? "#c0392b" : "#8a7a6a")};
  padding: 0;
  color: ${(p) => (p.$danger ? "#c0392b" : "#8a7a6a")};
`;

const ShowMoreButton = styled.button`
  display: block;
  font-size: 1.3rem;
  margin: 24px auto 0;
  padding: 10px 28px;
  background: none;
  border: 1.7px solid #e3cda8;
  border-radius: 999px;
  color: #8a5a2b;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #fbf0df;
  }
`;

const EditBox = styled.div`
  margin-bottom: 10px;
`;

const EditTextarea = styled.textarea`
  width: 100%;
  resize: vertical;
  font-family: inherit;
  font-size: 1.1rem;
  line-height: 1.5;
  color: #4a3b2c;
  border: 1.5px solid #e3cda8;
  border-radius: 10px;
  padding: 10px 12px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #b5541f;
  }
`;

const EditFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
`;

const CharCount = styled.span`
  font-size: 0.85rem;
  color: #a5947f;
`;

const EditActions = styled.div`
  display: flex;
  gap: 16px;
`;

const SaveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  padding: 0;
  color: #b5541f;

  &:disabled {
    color: #d8c7b3;
    cursor: not-allowed;
  }
`;
