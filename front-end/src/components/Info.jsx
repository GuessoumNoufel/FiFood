// import { useEffect } from "react";
// import { getComments } from "../API/comments";
// import { useParams } from "react-router-dom";
import styled from "styled-components";

const CommentInfo = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: 3px;
  cursor: pointer;
  text-decoration: underline #aaa;
  &:hover {
    color: #f8610a;
    text-shadow: 0.9px 0px 2px #f8610a8d;
  }
  &:hover .comment-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
`;

// const InfoIcon = styled.div`
//   width: 1.45rem;
//   height: 1.45rem;
//   padding: 5px;
//   border: 1px solid #8d8375;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   color: #8d8375;
//   font-size: 12px;
//   font-weight: 500;
//   &:hover {
//     color: #f8610a;
//   }
// `;

const CommentTooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(5px);

  width: 280px;
  padding: 14px 16px;

  /* background: #fffdf9; */
  background: #ffffff;
  border: 1px solid #e8e0d4;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(60, 40, 20, 0.12);

  opacity: 0;
  visibility: hidden;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;

  z-index: 20;
`;

const TooltipTitle = styled.div`
  font-size: 12px;
  /* font-weight: 500; */
  color: #000000a6;
  text-shadow: 1px 0 0px #3333337f;
  margin-bottom: 7px;
  text-transform: uppercase;
`;

const TooltipText = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  text-shadow: 1px 0 0px #3333337f;
  color: #000;
`;

const TooltipDate = styled.span`
  display: flex;
  margin-top: 8px;
  font-size: 11px;
  color: #a69c8cdc;
`;

function MyCommentInfo({ comment }) {
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // DO IT LATER /////////////////////////////////////////////////////////////////////////////////////
  // const { id } = useParams();
  // useEffect(() => {
  //   getComments(id);
  // }, comment.results);
  // console.log(comment.results);

  const commentReady = `${comment.text.length >= 65 ? `${comment.text.slice(0, 65)}...` : comment.text}`;
  if (!comment) return null;
  return (
    <CommentInfo>
      {/* <InfoIcon>i</InfoIcon> */}
      <div className="flex items-center gap-0.5 mt-1.5">
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
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
        <span>comment</span>
      </div>
      <CommentTooltip className="comment-tooltip">
        <TooltipTitle>Your comment</TooltipTitle>

        <TooltipText>"{commentReady}"</TooltipText>

        <TooltipDate>
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
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          {comment.createdAt}
        </TooltipDate>
      </CommentTooltip>
    </CommentInfo>
  );
}

export default MyCommentInfo;
