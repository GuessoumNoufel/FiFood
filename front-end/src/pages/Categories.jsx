import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { filterMealsByCategory } from "../API/meals";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/pagination";
import LoadingPage from "../components/LoadingPage";
import { useLikedRecipes } from "../hooks/useLikedRecipes";

const CATEGORIES = [
  {
    name: "Beef",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        >
          <circle cx="8" cy="10" r="2"></circle>
          <path d="M2 10a6 6 0 0 0 8.917 5.245C13.189 13.978 14 13 18 12c2.232-.558 4-1.79 4-4a4 4 0 0 0-4-4H8a6 6 0 0 0-6 6"></path>
          <path d="M2 10v4a6 6 0 0 0 8.917 5.245C13.189 17.978 14 17 18 16c2.232-.558 4-1.79 4-4V8"></path>
        </g>
      </svg>
    ),
  },
  {
    name: "Breakfast",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 2048 2048"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <path
          fill="currentColor"
          d="M1408 592q-26 0-45-19t-19-45q0-51 19-98t56-83l79-80q38-38 38-91q0-26 19-45t45-19t45 19t19 45q0 51-19 98t-56 83l-79 80q-38 38-38 91q0 26-19 45t-45 19m-384 0q-26 0-45-19t-19-45q0-51 19-98t56-83l79-80q38-38 38-91q0-26 19-45t45-19t45 19t19 45q0 51-19 98t-56 83l-79 80q-38 38-38 91q0 26-19 45t-45 19m832 176q40 0 75 15t61 41t41 61t15 75v384q0 40-15 75t-41 61t-61 41t-75 15h-57q-2 7-3 13t-4 12v39q0 66-25 124t-69 102t-102 69t-124 25h-384q-78 0-144-35t-110-93H334q-66 0-124-25t-102-68t-69-102t-25-125v-64h256q0-79 30-149t83-122t122-83t149-30q30 0 58 5t56 14V640h1024v128zM654 1152q-53 0-99 20t-82 55t-55 81t-20 100h370v-228q-26-13-54-20t-60-8m-320 512h441q-7-29-7-64v-64H153q10 28 28 51t41 41t52 26t60 10m463 67v1l1 2v-1zm867-131V768H896v832q0 40 15 75t41 61t61 41t75 15h384q40 0 75-15t61-41t41-61t15-75m256-256V960q0-26-19-45t-45-19h-64v512h64q26 0 45-19t19-45"
        ></path>
      </svg>
    ),
  },
  {
    name: "Chicken",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <g fill="none">
          <path d="M17.429 2.936c1.477-.437 1.966 1.544 1.966 1.544s1.956-.559 2.32.93c.365 1.49-1.455 1.944-2.51 2.226l-1.74 3.011a5 5 0 0 0-2.9-.629l2.191-3.796c-.284-1.062-.804-2.85.673-3.286"></path>
          <path
            stroke="currentColor"
            strokeLinecap="square"
            strokeWidth="2"
            d="M3 19.999h18m-9-14h-1.999a7 7 0 0 0-.001 14h5a5 5 0 0 0 5-5c0-2.917-2.575-5.216-5.436-4.98l-.092.008c-2.527.25-4.472 2.38-4.472 4.972m9.395-10.52s-.49-1.98-1.967-1.543s-.957 2.224-.672 3.286l-2.192 3.796a5 5 0 0 1 2.9.629l1.741-3.01c1.054-.283 2.875-.736 2.51-2.226s-2.32-.931-2.32-.931Z"
          ></path>
        </g>
      </svg>
    ),
  },
  {
    name: "Dessert",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 1024 1024"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <path
          fill="currentColor"
          d="M128 416v-48a144 144 0 0 1 168.6-141.9a224.1 224.1 0 0 1 430.8 0A144 144 0 0 1 896 368v48a384 384 0 0 1-352 382.7V896h-64v-97.3A384 384 0 0 1 128 416m287.1-32h193.8a144 144 0 0 1 58.9-132.8a160 160 0 0 0-311.6 0A144 144 0 0 1 415.1 384m-72.9 0a72 72 0 1 0-140.5 0zm339.6 0h140.4a72 72 0 1 0-140.5 0zM512 736a320 320 0 0 0 318.4-288H193.6A320 320 0 0 0 512 736M384 896h256a32 32 0 1 1 0 64H384a32 32 0 1 1 0-64"
        ></path>
      </svg>
    ),
  },
  {
    name: "Goat",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 14 14"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 12a6.51 6.51 0 0 0 6.48-6a.5.5 0 0 0-.48-.5H1a.5.5 0 0 0-.48.5A6.51 6.51 0 0 0 7 12Zm-2.95-.71L3.5 13.5m6.45-2.21l.55 2.21M3.5 3V2m7 1V2M7 3V.5"
        ></path>
      </svg>
    ),
  },
  {
    name: "Lamb",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <path
          fill="currentColor"
          d="M15.71 4c.83 0 1.62.22 2.29.66c1.14.74 1.84 1.87 2 3.18a4.37 4.37 0 0 1-1.25 3.47c-.7.69-1.59 1.13-2.57 1.23c-1.91.2-3.59.96-4.84 2.23a.81.81 0 0 1-1.13 0l-.99-.99a.74.74 0 0 1-.22-.53c0-.25.11-.47.32-.68c1.21-1.22 1.95-2.84 2.13-4.7c.13-1.33.84-2.47 2-3.22c.66-.43 1.44-.65 2.26-.65m0-2c-1.17 0-2.34.32-3.35.97c-1.76 1.13-2.73 2.89-2.9 4.71c-.13 1.32-.63 2.55-1.55 3.47l-.03.03c-1.16 1.16-1.16 2.93-.07 4.01l.99.99c.55.55 1.26.82 1.97.82s1.43-.27 1.98-.82c.97-.97 2.25-1.5 3.64-1.65c1.37-.15 2.71-.75 3.77-1.8A6.27 6.27 0 0 0 19.09 3c-1.01-.67-2.19-1-3.38-1M6.26 19.86c.27.56.18 1.24-.29 1.7a1.49 1.49 0 0 1-2.55-.98a1.49 1.49 0 0 1-.98-2.55c.46-.46 1.15-.56 1.7-.29l2.48-2.43c.14.19.3.41.48.59l.99.99c.21.2.41.37.67.52z"
        ></path>
      </svg>
    ),
  },
  {
    name: "Miscellaneous",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 48 48"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        >
          <path d="M45.5 4c-11.046 0-20 8.954-20 20s8.954 20 20 20"></path>
          <path d="M45.5 12c-6.627 0-12 5.373-12 12s5.373 12 12 12M19.945 6.358c.46 2.718 1.104 7.467 1.052 12.538c-.026 2.617-1.774 4.962-4.522 5.578c-.568.127-1.173.242-1.805.331l1.784 13.933c.314 2.451-1.195 4.88-3.645 5.2c-.303.039-.58.062-.809.062a7 7 0 0 1-.81-.063c-2.45-.32-3.958-2.748-3.644-5.199L9.33 24.805a23 23 0 0 1-1.804-.33c-2.749-.617-4.497-2.963-4.524-5.58c-.051-5.07.591-9.818 1.051-12.536C4.287 4.974 5.499 4 6.903 4h10.192c1.405 0 2.616.973 2.85 2.358M9.5 4L9 15m5.5-11l.5 11"></path>
        </g>
      </svg>
    ),
  },
  {
    name: "Pasta",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        >
          <path d="M17.031.75c1.437 2.873-2.9 3.881-.75 6.75M12.531.75c1.437 2.873-2.9 3.881-.75 6.75M8.031.75c1.437 2.873-2.9 3.881-.75 6.75M.75 12.75c0 .796 1.185 1.559 3.295 2.121s4.971.879 7.955.879s5.845-.316 7.955-.879s3.295-1.325 3.295-2.121s-1.185-1.559-3.295-2.121S14.984 9.75 12 9.75s-5.845.316-7.955.879S.75 11.954.75 12.75"></path>
          <path d="M23.25 12.75c0 5.8-5.037 10.5-11.25 10.5S.75 18.549.75 12.75"></path>
        </g>
      </svg>
    ),
  },
  {
    name: "Pork",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <path
          fill="currentColor"
          d="m8.22 13.92l.52-.15c1.06-.31 1.92-1.1 2.32-2.13a5.58 5.58 0 0 1 3.63-3.33l.52-.15c1.06-.31 1.92-1.1 2.32-2.13l.74-1.91l-2.16-1.87c-.25-.21-.58-.29-.9-.21s-.57.31-.69.61l-.69 1.8c-.32.84-1.03 1.49-1.89 1.73l-.45.13a4.89 4.89 0 0 0-3.2 2.94c-.32.84-1.03 1.48-1.89 1.73l-.45.13a4.89 4.89 0 0 0-3.2 2.94l-.69 1.8c-.15.39-.04.84.28 1.11l1.77 1.53l.48-1.24a5.58 5.58 0 0 1 3.63-3.33m11.66-8.41l-.48 1.24a5.58 5.58 0 0 1-3.63 3.33l-.52.15c-1.06.31-1.92 1.1-2.32 2.13a5.58 5.58 0 0 1-3.63 3.33l-.52.15c-1.06.31-1.92 1.1-2.32 2.13l-.74 1.91l2.16 1.87c.18.16.42.24.66.24c.08 0 .16 0 .24-.03c.32-.08.57-.31.69-.61l.69-1.8c.32-.84 1.03-1.49 1.89-1.73l.45-.13a4.89 4.89 0 0 0 3.2-2.94c.32-.84 1.03-1.48 1.89-1.73l.45-.13a4.89 4.89 0 0 0 3.2-2.94l.69-1.8c.15-.39.04-.84-.28-1.11z"
        ></path>
      </svg>
    ),
  },
  {
    name: "Seafood",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <path fill="currentColor" d="M16 10a1 1 0 1 0 0 2a1 1 0 1 0 0-2"></path>
        <path
          fill="currentColor"
          d="M1.99 15v2c1.29 0 3.41-.58 4.43-2.48C7.7 16.11 9.97 18 13.5 18c5.95 0 8.32-5.38 8.42-5.61c.11-.25.11-.54 0-.79c-.1-.23-2.47-5.61-8.42-5.61c-3.53 0-5.8 1.89-7.08 3.48C5.4 7.56 3.28 6.99 2 6.99v2c.5 0 3 .18 3 3s-2.5 2.99-3.01 3ZM13.5 8c3.83 0 5.79 2.91 6.38 4c-.6 1.09-2.55 4-6.38 4s-5.79-2.92-6.38-4c.6-1.09 2.55-4 6.38-4"
        ></path>
      </svg>
    ),
  },
  {
    name: "Side",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        >
          <path d="M20.387 6.573a2.094 2.094 0 0 0-.014-2.945a2.09 2.09 0 0 0-2.943-.015a2.09 2.09 0 0 0-3.485.885a2.091 2.091 0 0 0-2.938 2.521a2.094 2.094 0 0 0-1.395 3.571a2.69 2.69 0 0 1 .74 2.41H18.3a2.095 2.095 0 0 0 1.203-2.94a2.095 2.095 0 0 0 .884-3.487M17 7l-6 6m2.889 8H10.11A7.11 7.11 0 0 1 3 13.889c0-.491.398-.889.889-.889H20.11c.491 0 .889.398.889.889A7.11 7.11 0 0 1 13.889 21"></path>
          <path d="M5.671 13A4.5 4.5 0 0 1 11 5.758"></path>
        </g>
      </svg>
    ),
  },
  {
    name: "Starter",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          d="M3.25 2.75v7a3 3 0 0 0 3 3h1m4-10v7a3 3 0 0 1-3 3h-1m0-10v10m0 0v8.5m13.5 0v-6.5m0 0V3.286a.536.536 0 0 0-.536-.536a4.464 4.464 0 0 0-4.464 4.464v5.536a2 2 0 0 0 2 2z"
        ></path>
      </svg>
    ),
  },
  {
    name: "Vegan",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <path
          fill="currentColor"
          d="M10.5 10a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7"
        ></path>
        <path
          fill="currentColor"
          d="M17.73 2.05c-1.13-.16-2.24.05-3.22.61a26.2 26.2 0 0 1-6.33 2.66c-3.17.89-5.55 3.55-6.07 6.76c-.45 2.76.42 5.47 2.38 7.42a8.42 8.42 0 0 0 6 2.49c.47 0 .94-.04 1.42-.12c3.22-.52 5.87-2.9 6.76-6.06l.03-.11c.56-2.09 1.45-4.18 2.63-6.23c.56-.97.77-2.08.61-3.22a4.985 4.985 0 0 0-4.21-4.21Zm1.87 6.43c-1.27 2.2-2.22 4.46-2.85 6.79c-.67 2.39-2.75 4.25-5.16 4.64c-2.12.34-4.19-.32-5.69-1.82s-2.16-3.57-1.81-5.69c.39-2.41 2.26-4.49 4.72-5.18c2.25-.61 4.51-1.56 6.71-2.83c.45-.26.96-.4 1.48-.4q.225 0 .45.03c1.28.18 2.33 1.24 2.52 2.52c.1.68-.03 1.35-.36 1.93Z"
        ></path>
      </svg>
    ),
  },
  {
    name: "Vegetarian",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style={{ color: "#4a5565", opacity: 1, transform: "rotate(0deg)" }}
      >
        <g
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        >
          <path d="M5 21c.5-4.5 2.5-8 7-10"></path>
          <path d="M9 18c6.218 0 10.5-3.288 11-12V4h-4.014c-9 0-11.986 4-12 9c0 1 0 3 2 5z"></path>
        </g>
      </svg>
    ),
  },
];
const PAGE_SIZE = 15;

const Page = styled.main`
  min-height: 65vh;
  padding: 3.6rem clamp(1.6rem, 5vw, 6.4rem) 7rem;
  background: #fbf8f2;
  font-family: "Inter", sans-serif;
`;

const Content = styled.div`
  width: min(100%, 124rem);
  margin: 0 auto;
`;

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  padding: clamp(2.8rem, 5vw, 5.6rem);
  border: 1px solid #f0e2d1;
  border-radius: 2.4rem;
  background: linear-gradient(120deg, #fff7eb 0%, #f9ead8 56%, #f6e2cc 100%);

  &::after {
    content: "";
    position: absolute;
    right: -4rem;
    bottom: -11rem;
    width: 30rem;
    height: 30rem;
    border: 1px solid rgba(193, 89, 42, 0.14);
    border-radius: 50%;
    box-shadow:
      0 0 0 3rem rgba(193, 89, 42, 0.035),
      0 0 0 6rem rgba(193, 89, 42, 0.025);
    pointer-events: none;
  }
`;

const Eyebrow = styled.p`
  position: relative;
  z-index: 1;
  margin: 0 0 1.2rem;
  color: #a95626;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const Title = styled.h1`
  position: relative;
  z-index: 1;
  max-width: 65rem;
  margin: 0;
  color: #2b2620;
  font:
    700 clamp(3.2rem, 5vw, 5.4rem)/1.08 "Fraunces",
    Georgia,
    serif;
`;

const Subtitle = styled.p`
  position: relative;
  z-index: 1;
  max-width: 55rem;
  margin: 1.4rem 0 0;
  color: #746b5f;
  font-size: 1.5rem;
  line-height: 1.65;
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 2rem;
  margin: 3.6rem 0 1.8rem;
  @media (max-width: 640px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  color: #2b2620;
  font:
    700 2.5rem/1.2 "Fraunces",
    Georgia,
    serif;
`;

const SectionText = styled.p`
  margin: 0.5rem 0 0;
  color: #8a7f6e;
  font-size: 1.3rem;
`;

const SearchWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: min(100%, 30rem);
  padding: 0 1.4rem;
  border: 1px solid #e8e0d4;
  border-radius: 999px;
  background: #fff;
  color: #8a7f6e;
  &:focus-within {
    border-color: #c1592a;
    box-shadow: 0 0 0 3px #c1592a16;
  }
  svg {
    width: 1.8rem;
    height: 1.8rem;
    flex: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.2rem 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #2b2620;
  font:
    1.3rem "Inter",
    sans-serif;
  &::placeholder {
    color: #a69c8c;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14.5rem, 1fr));
  gap: 1.2rem;
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  /* min-height: 7rem; */
  min-width: min-content;
  padding: 1.2rem;
  border: 1px solid ${(props) => (props.$active ? "#c1592a" : "#eee6da")};
  border-radius: 1.4rem;
  background: ${(props) => (props.$active ? "#fff1e5" : "#fffdf9")};
  color: #3f382f;
  text-align: left;
  cursor: pointer;
  transition:
    transform 150ms ease,
    box-shadow 150ms ease,
    border-color 150ms ease;
  &:hover {
    transform: translateY(-2px);
    border-color: #dba47f;
    box-shadow: 0 0.8rem 2rem rgba(72, 48, 27, 0.08);
    font-weight: 650;
  }
`;

const CategoryIcon = styled.span`
  display: grid;
  place-items: center;
  width: 3.8rem;
  height: 3.8rem;
  flex: none;
  border-radius: 1.2rem;
  background: #fbf1e4;
  color: #c1592a;

  svg {
    display: block;
    width: 2.2rem;
    height: 2.2rem;
  }
`;

const CategoryName = styled.span`
  font-size: 1.3rem;
  font-weight: 550;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin: 4.2rem 0 0;
`;

const ResultCount = styled.p`
  margin: 0;
  color: #8a7f6e;
  font-size: 1.3rem;
`;

const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(21rem, 1fr));
  gap: 1.8rem;
  padding: 2rem 0 0;
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  margin-top: 2rem;
  padding: 4rem 2rem;
  border: 1px dashed #e1d5c5;
  border-radius: 1.6rem;
  color: #81776a;
  background: #fffdf9;
  font-size: 1.4rem;
  text-align: center;
`;

function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const category =
    CATEGORIES.find(
      (item) => item.name.toLowerCase() === categoryParam.toLowerCase(),
    )?.name ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const [categoryQuery, setCategoryQuery] = useState("");
  const [meals, setMeals] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(Boolean(category));
  const [error, setError] = useState("");
  const { likedIds, setLikedIds, handleToggleLike } = useLikedRecipes();

  const visibleCategories = useMemo(
    () =>
      CATEGORIES.filter((item) =>
        item.name.toLowerCase().includes(categoryQuery.trim().toLowerCase()),
      ),
    [categoryQuery],
  );

  useEffect(() => {
    if (!category) {
      setMeals([]);
      setTotalResults(0);
      setLoading(false);
      setError("");
      return undefined;
    }

    let isCurrent = true;
    setLoading(true);
    setError("");
    filterMealsByCategory(category, page)
      .then((response) => {
        if (!isCurrent) return;
        setMeals(response.data ?? []);
        setTotalResults(response.totalResults ?? response.data?.length ?? 0);
        setLikedIds(new Set(response.likedMealIds ?? []));
      })
      .catch((requestError) => {
        if (!isCurrent) return;
        const message = requestError.response?.data?.message;
        setError(message ?? "We couldn’t load meals in this category.");
        setMeals([]);
        setTotalResults(0);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [category, page, setLikedIds]);

  const chooseCategory = (name) => {
    setSearchParams({ category: name, page: "1" });
  };

  const changePage = (nextPage) => {
    setSearchParams({ category, page: String(nextPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Page>
      <Content>
        <Hero>
          <Eyebrow>Find your next favorite</Eyebrow>
          <Title>What are you in the mood for?</Title>
          <Subtitle>
            Browse meals by category and find something delicious to cook. Pick
            a category to see its recipes.
          </Subtitle>
        </Hero>

        <CategoryHeader>
          <div>
            <SectionTitle>Browse categories</SectionTitle>
            <SectionText>Choose a collection to explore its meals.</SectionText>
          </div>
          <SearchWrap>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              aria-hidden="true"
            >
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path strokeLinecap="round" d="m16 16 4.5 4.5" />
            </svg>
            <SearchInput
              type="search"
              aria-label="Search categories"
              placeholder="Find a category..."
              value={categoryQuery}
              onChange={(event) => setCategoryQuery(event.target.value)}
            />
          </SearchWrap>
        </CategoryHeader>

        {visibleCategories.length ? (
          <CategoryGrid>
            {visibleCategories.map((item) => (
              <CategoryButton
                key={item.name}
                type="button"
                $active={category === item.name}
                aria-pressed={category === item.name}
                onClick={() => chooseCategory(item.name)}
              >
                <CategoryIcon aria-hidden="true">{item.icon}</CategoryIcon>
                <CategoryName>{item.name}</CategoryName>
              </CategoryButton>
            ))}
          </CategoryGrid>
        ) : (
          <EmptyState>No categories match “{categoryQuery}”.</EmptyState>
        )}

        {category && (
          <section aria-live="polite">
            <ResultsHeader>
              <SectionTitle>{category} recipes</SectionTitle>
              <ResultCount>
                {totalResults} {totalResults === 1 ? "recipe" : "recipes"}
              </ResultCount>
            </ResultsHeader>
            {loading ? (
              <LoadingPage message={`Loading ${category} recipes`} />
            ) : error ? (
              <EmptyState>{error}</EmptyState>
            ) : meals.length === 0 ? (
              <EmptyState>No recipes found in this category.</EmptyState>
            ) : (
              <RecipeGrid>
                {meals.map((meal) => (
                  <RecipeCard
                    key={meal.mealDBId}
                    id={meal.mealDBId}
                    title={meal.title}
                    image={meal.image}
                    category={category}
                    liked={likedIds.has(meal.mealDBId)}
                    onToggleLike={handleToggleLike}
                  />
                ))}
              </RecipeGrid>
            )}
            {!loading && !error && (
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(totalResults / PAGE_SIZE)}
                onPageChange={changePage}
              />
            )}
          </section>
        )}
      </Content>
    </Page>
  );
}

export default Categories;
