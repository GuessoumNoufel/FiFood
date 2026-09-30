import { Link } from "react-router-dom";
import styled from "styled-components";
import { cuisines } from "../data/cuisines";

const Page = styled.div`
  max-width: 1100px;
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
  margin: 0 0 32px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
`;

const CuisineCard = styled(Link)`
  background: #fff;
  border: 1px solid #e8e0d4;
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-3px);
  }
`;

const CuisineImage = styled.img`
  width: 100%;
  height: 140px;
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

function Cuisines() {
  return (
    <Page>
      <Title>Explore Cuisines</Title>
      <Subtitle>
        Find something delicious from every corner of the world.
      </Subtitle>
      <Grid>
        {cuisines.map((c) => (
          <CuisineCard key={c.area} to={`/discover?area=${c.area}`}>
            <CuisineImage src={c.image} alt={c.area} />
            <CuisineName>{c.area}</CuisineName>
          </CuisineCard>
        ))}
      </Grid>
    </Page>
  );
}

export default Cuisines;
