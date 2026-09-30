import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import heroImage from "../assets/hero-bg3.png";
import SearchBar from "./SearchBar";

const Section = styled.section`
  display: flex;
  background-image: url(${heroImage});
  background-size: calc(90%);
  background-position: right;
  background-repeat: no-repeat;
  align-items: center;
  position: right;
  justify-content: space-between;
  background:
    linear-gradient(to left, rgba(251, 247, 241, 0), #dddddd18),
    url(${heroImage}) center/cover no-repeat;
  height: 50rem;
  width: 100vw;
  gap: 48px;
  padding: 64px 48px;
  /* background: #fbf7f1; */
`;
const TextBlock = styled.div`
  max-width: 480px;
`;

const Headline = styled.h1`
  font-family: "Fraunces", Georgia, serif;
  font-size: 42px;
  font-weight: 600;
  line-height: 1.15;
  color: #2b2620;
  margin: 0 0 16px;
`;

const Subtext = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 16px;
  color: #6b6255;
  margin: 0 0 28px;
  line-height: 1.5;
`;

const ExploreButton = styled.button`
  font-family: "Inter", sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  background: #e8590c;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #cc5624;
  }
`;

// const ImageBlock = styled.div`
//   flex: 1;
//   max-width: 520px;
// `;

// const HeroImage = styled.img`
//   width: 100%;
//   border-radius: 16px;
//   display: block;
// `;

function Hero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/discover?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <Section>
      <TextBlock>
        <Headline>Discover your next favorite recipe.</Headline>
        <Subtext>
          Explore thousands of recipes from cuisines around the world.
        </Subtext>
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
        />
        <ExploreButton onClick={() => navigate("/discover")}>
          Explore Recipes
        </ExploreButton>
      </TextBlock>

      {/* <ImageBlock>
        {/* <DivImage src={heroImage} alt="Featured recipe" /> 
      </ImageBlock> */}
    </Section>
  );
}

export default Hero;
