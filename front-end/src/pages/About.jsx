import { Link } from "react-router-dom";
import styled from "styled-components";

export default function About() {
  return (
    <Page>
      <Hero>
        <Eyebrow>OUR STORY</Eyebrow>
        <Title>Good food brings us together.</Title>
        <Intro>
          FiFood is a place to find recipes worth making, share the dishes you
          love, and learn from the people who make them.
        </Intro>
        <ExploreLink to="/discover">Explore recipes</ExploreLink>
      </Hero>
      <Story>
        <StoryTitle>Made for everyday cooking</StoryTitle>
        <StoryText>
          From quick weeknight dinners to family favorites, FiFood helps home
          cooks discover ideas that fit their table. Browse by cuisine or
          category, save recipes for later, and follow cooks whose recipes you
          want to try.
        </StoryText>
        <Values>
          <Value>
            <ValueTitle>Discover</ValueTitle>
            <ValueText>Find inspiration from kitchens around the world.</ValueText>
          </Value>
          <Value>
            <ValueTitle>Share</ValueTitle>
            <ValueText>Keep your favorite recipes and pass them along.</ValueText>
          </Value>
          <Value>
            <ValueTitle>Cook together</ValueTitle>
            <ValueText>Connect with people who love good food.</ValueText>
          </Value>
        </Values>
      </Story>
    </Page>
  );
}

const Page = styled.main`
  min-height: 65vh;
  padding: 5rem 2rem 6rem;
  background: #fbf7f1;
  color: #2b2620;
  font-family: "Inter", sans-serif;
`;

const Hero = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 2rem 5rem;
  text-align: center;
  background: #f5efe4;
  border-radius: 28px;
`;

const Eyebrow = styled.p`
  margin: 0 0 1rem;
  color: #c1592a;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.16em;
`;

const Title = styled.h1`
  max-width: 720px;
  margin: 0 auto 1.2rem;
  font-family: "Fraunces", Georgia, serif;
  font-size: clamp(2.6rem, 6vw, 4.7rem);
  line-height: 1.06;
`;

const Intro = styled.p`
  max-width: 630px;
  margin: 0 auto 2rem;
  color: #756b5e;
  font-size: 1.1rem;
  line-height: 1.8;
`;

const ExploreLink = styled(Link)`
  display: inline-flex;
  padding: 0.9rem 1.5rem;
  border-radius: 999px;
  background: #c1592a;
  color: white;
  font-weight: 600;
  text-decoration: none;

  &:hover { background: #a64a22; }
`;

const Story = styled.section`
  max-width: 900px;
  margin: 4.5rem auto 0;
`;

const StoryTitle = styled.h2`
  margin: 0 0 1rem;
  font-family: "Fraunces", Georgia, serif;
  font-size: 2.3rem;
`;

const StoryText = styled.p`
  max-width: 760px;
  margin: 0;
  color: #756b5e;
  line-height: 1.8;
`;

const Values = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const Value = styled.article`
  padding: 1.5rem;
  border: 1px solid #e8e0d4;
  border-radius: 16px;
  background: white;
`;

const ValueTitle = styled.h3`
  margin: 0 0 0.6rem;
  color: #c1592a;
  font-size: 1.1rem;
`;

const ValueText = styled.p`
  margin: 0;
  color: #756b5e;
  line-height: 1.6;
`;
