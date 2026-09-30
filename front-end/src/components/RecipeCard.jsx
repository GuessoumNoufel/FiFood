import { Link } from "react-router-dom";
import styled from "styled-components";

// const Card = styled(Link)`
//   display: block;
//   background: #f5fffa;
//   border: 1px solid #e8e0d4;
//   border-radius: 12px;
//   overflow: hidden;
//   text-decoration: none;
//   color: inherit;
//   transition: transform 0.3s ease;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.13);

//   &:hover {
//     transform: translateY(-3px);
//     box-shadow: 0 7px 8px rgba(0, 0, 0, 0.07);
//   }
// `;

// const ImageWrap = styled.div`
//   position: relative;
//   width: 100%;
//   aspect-ratio: 4 / 3;
//   background: #f0e9dc;
// `;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const HeartButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 3.2rem;
  height: 3.2rem;
  cursor: pointer;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(255, 255, 255, 0.87);
    transition: transform 0.1s ease;
  }
  .heartIcon {
    transition:
      fill 0.2s ease,
      stroke 0.2s ease,
      color 0.2s ease;
  }

  &:hover .heartIcon {
    fill: red;
    stroke: red;
    color: red;
  }
`;

// const Info = styled.div`
//   display: flex;
//   flex-direction: column;
//   padding: 12px 14px;
//   padding-bottom: 0rem;
// `;

// const Title = styled.p`
//   font-family: "Inter", sans-serif;
//   font-size: 14px;
//   font-weight: 500;
//   color: #2b2620;
//   margin: 0 0 6px;
//   margin-bottom: 0;
// `;

// const MetaRow = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   font-family: "Inter", sans-serif;
//   font-size: 13px;
//   color: #8a7f6e;
//   margin-top: 3rem;
//   /* margin-top: auto; */
//   padding: 0rem;
// `;

// const Rating = styled.span`
//   color: #c1592a;
//   display: flex;
//   /* justify-content:center */
//   gap: 0.3rem;
//   font-weight: 500;
// `;
const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  /* background: #f5fffa; */
  border: 1px solid #e8e0d4;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.13);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 7px 8px rgba(0, 0, 0, 0.07);
  }
`;

const ImageWrap = styled.div`
  position: relative;
  width: 100%;
  height: 17rem;
  aspect-ratio: 4 / 3;
  background: #f0e9dc;
  flex-shrink: 0;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 12px 14px;
  min-height: 85px;
`;

const Title = styled.p`
  font-family: "Inter", sans-serif;
  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  font-weight: 500;
  color: #2b2620;
  margin: 0;
  margin-bottom: 1.6rem;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: auto;

  font-family: "Inter", sans-serif;
  font-size: 13px;
  color: #8a7f6e;
`;

const Rating = styled.span`
  color: #c1592a;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
`;
const Time = styled.span`
  display: flex;
  gap: 4px;
  align-items: center;
  font-family: "Inter", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: #696763;
  margin: 0;
  margin-left: 0.4rem;
`;
function RecipeCard({
  id,
  title,
  image,
  category,
  rating,
  liked,
  onToggleLike,
  time,
}) {
  return (
    <Card to={`/recipe/${id}`}>
      <ImageWrap>
        <Image src={image} alt={title} />
        <HeartButton
          onClick={(e) => {
            e.preventDefault();
            onToggleLike?.(id);
          }}
        >
          {liked ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="red"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="red"
              class="size-6"
              className="heartIcon flex items-center justify-center h-8 w-8 "
            >
              {/* cursor-pointer transition-colors hover:fill-red-600 hover:stroke-red-400 hover:text-red-600 */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              class="size-6"
              className="heartIcon flex items-center justify-center h-8 w-8 "
            >
              {/* cursor-pointer transition-colors hover:fill-red-600 hover:stroke-red-400 hover:text-red-600 */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
              />
            </svg>
          )}
        </HeartButton>
      </ImageWrap>
      <Info>
        <Title>
          {title}
          {time != null && time !== "" && (
            <Time>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              {time} min
            </Time>
          )}
        </Title>
        <MetaRow>
          <span>{category}</span>
          {rating && (
            <Rating>
              {rating > 0 ? (
                <>
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
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                  {rating}
                </>
              ) : (
                <span className="text-[12px]">no ratings yet</span>
              )}
            </Rating>
          )}
        </MetaRow>
      </Info>
    </Card>
  );
}

export default RecipeCard;
