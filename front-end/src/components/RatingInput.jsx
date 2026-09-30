import { useState } from "react";
import styled from "styled-components";
import MyCommentInfo from "../components/Info";

const Wrapper = styled.div`
  background: #fff;
  box-shadow: 1px 1px 10px #e5e5e5;
  border: 1px solid #e8e0d4;
  border-radius: 12px;
  padding: 20px 24px;
  margin: 20px 0;
  font-family: "Inter", sans-serif;
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #2b2620;
  margin: 0 0 4px;
`;

const Subtitle = styled.p`
  font-size: 13px;
  color: #8a7f6e;
  margin: 0 0 14px;
`;

const StarRow = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
`;

const Star = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 3.5rem;
  line-height: 1;
  color: ${(props) => (props.$filled ? "#C1592A" : "#E8E0D4")};

  &:hover {
    color: #c1592a;
  }
`;

const CommentField = styled.textarea`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e8e0d4;
  border-radius: 8px;
  font-size: 14px;
  min-height: 70px;
  resize: vertical;
  outline: none;
  font-family: "Inter", sans-serif;
  margin-bottom: 14px;

  &:focus {
    border-color: #c1592a;
  }
`;

const SubmitButton = styled.button`
  background: #c1592a;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #a64a22;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ExistingNote = styled.p`
  display: flex;
  gap: 0.6rem;
  align-items: center;
  font-size: 13px;
  color: #8a7f6e;
  margin: 0 0 14px;
`;

function RatingInput({ existingRating, existingComment, onSubmit }) {
  const [value, setValue] = useState(existingRating?.value ?? 0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState(existingRating?.comment ?? "");

  const handleSubmit = () => {
    onSubmit?.({ value, comment });
    setComment("");
  };

  return (
    <Wrapper>
      <Title>
        {existingRating ? "Update your rating" : "Rate this recipe"}
      </Title>
      <Subtitle>Let others know what you thought.</Subtitle>

      {existingRating && (
        <ExistingNote>
          You previously rated this{" "}
          <span className="flex gap-0.5 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#f59f00"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
            {existingRating.value}
          </span>
          {existingComment ? (
            <div className="flex items-center">
              and gave a
              <span className="mx-1">
                <MyCommentInfo comment={existingComment} />
              </span>
            </div>
          ) : null}
        </ExistingNote>
      )}

      <StarRow>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            type="button"
            $filled={star <= (hovered || value)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setValue(star)}
          >
            ★
          </Star>
        ))}
      </StarRow>

      <CommentField
        placeholder="Add a comment (optional)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <SubmitButton onClick={handleSubmit} disabled={value === 0}>
        {existingRating ? "Update Rating" : "Submit Rating"}
      </SubmitButton>
    </Wrapper>
  );
}

export default RatingInput;
