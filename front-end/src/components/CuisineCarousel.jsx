import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// import indianImg from "../assets/cuisine-imgs/Indian.png";
import italianImg from "../assets/cuisine-imgs/italian.png";
import algerianImg from "../assets/cuisine-imgs/Algerian.png";
import japaneseImg from "../assets/cuisine-imgs/Japanese.png";
import mexicanImg from "../assets/cuisine-imgs/Mexican.png";
import chineseImg from "../assets/cuisine-imgs/Chinese.png";
import greekImg from "../assets/cuisine-imgs/Greek.png";
import thaiImg from "../assets/cuisine-imgs/Thai.png";
import spanishImg from "../assets/cuisine-imgs/Spanish.png";
import moroccanImg from "../assets/cuisine-imgs/Moroccan.png";
import egyptianImg from "../assets/cuisine-imgs/egyptian.png";

const cuisines = [
  { area: "Italian", image: italianImg },
  { area: "Algerian", image: algerianImg },
  { area: "Japanese", image: japaneseImg },
  { area: "Egyptian", image: egyptianImg },
  { area: "Mexican", image: mexicanImg },
  { area: "Chinese", image: chineseImg },
  { area: "Greek", image: greekImg },
  { area: "Thai", image: thaiImg },
  { area: "Spanish", image: spanishImg },
  { area: "Moroccan", image: moroccanImg },
];

const Section = styled.section`
  padding: 1rem 0;
  overflow: hidden;
  font-family: "Inter", sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 28px;
  margin-bottom: 4px;
`;

const Title = styled.h2`
  font-family: "Fraunces", Georgia, serif;
  font-size: 2.7rem;
  color: #2b2620;
  margin: 0;
`;

const ViewAll = styled(Link)`
  font-size: 14px;
  color: #c1592a;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #8a7f6e;
  padding: 0 28px;
  margin: 0 0 20px;
`;

const scroll = keyframes`
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
`;

const Track = styled.div`
  display: flex;
  gap: 16px;
  width: max-content;
  padding: 0 28px;
  animation: ${scroll} 45s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const CuisineCard = styled(Link)`
  flex-shrink: 0;
  width: 20rem;
  background: #fff;
  border: 1px solid #e8e0d4;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const CuisineImage = styled.img`
  width: 100%;
  height: 14rem;
  object-fit: cover;
  display: block;
  background: #f0e9dc;
`;

const CuisineName = styled.p`
  text-align: center;
  font-size: 14px;
  color: #2b2620;
  margin: 0;
  padding: 12px 8px;
`;

// duplicated so the -50% scroll loops seamlessly
const looped = [...cuisines, ...cuisines];

function CuisineCarousel() {
  return (
    <Section id="cuisines">
      <Header>
        <Title>Explore by Cuisine</Title>
        <ViewAll to="/cuisines">View all</ViewAll>
      </Header>
      <Subtitle>Find recipes from your favorite culinary traditions.</Subtitle>

      <Track>
        {looped.map((c, i) => (
          <CuisineCard key={`${c.area}-${i}`} to={`/discover?area=${c.area}`}>
            <CuisineImage src={c.image} alt={c.area} />
            <CuisineName>{c.area}</CuisineName>
          </CuisineCard>
        ))}
      </Track>
    </Section>
  );
}

export default CuisineCarousel;
