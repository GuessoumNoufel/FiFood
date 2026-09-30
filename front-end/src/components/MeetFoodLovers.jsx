import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFeaturedUsers } from "../api/users";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

// Uses the "Caveat" Google Font for the script-style heading/names — add it
// alongside your existing Fraunces/Playfair Display font import if it's not
// already loaded, e.g. in index.html:
// <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" rel="stylesheet">

// Decorative brush-stroke arcs behind each avatar. One entry per position in
// the row (cycles if you ever show more than 5). `rotate` moves where the arc
// starts around the circle, `length` is how much of the circle it covers.
const ACCENTS = [
  [
    { color: "#b7cfa3", rotate: 195, length: 85 },
    { color: "#f3d78a", rotate: 75, length: 55 },
  ],
  [{ color: "#f2a99b", rotate: 105, length: 95 }],
  [
    { color: "#f2a99b", rotate: 120, length: 90 },
    { color: "#b7cfa3", rotate: 300, length: 50 },
  ],
  [
    { color: "#b7cfa3", rotate: 215, length: 80 },
    { color: "#aaa3cf", rotate: 20, length: 70 },
  ],
  [
    { color: "#f3d78a", rotate: 100, length: 85 },
    { color: "#f2a99b", rotate: 250, length: 45 },
  ],
];

function AvatarAccents({ index }) {
  const arcs = ACCENTS[index % ACCENTS.length];
  const r = 52;
  const circumference = 2 * Math.PI * r;

  return (
    <AccentSvg viewBox="0 0 120 120" aria-hidden="true">
      {arcs.map((arc, i) => (
        <circle
          key={i}
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke={arc.color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${arc.length} ${circumference - arc.length}`}
          transform={`rotate(${arc.rotate} 60 60)`}
        />
      ))}
    </AccentSvg>
  );
}

export default function MeetFoodLovers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const Navigate = useNavigate();
  const { user: me } = useContext(AuthContext);
  // console.log(me);

  useEffect(() => {
    let cancelled = false;
    // const x = AuthProvider();
    // console.log("x", x);

    getFeaturedUsers()
      .then((res) => {
        if (!cancelled) setUsers(res.data.data ?? res.data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // nothing flagged as featured yet — skip the section rather than show a gap
  if (!loading && users.length === 0) return null;

  return (
    <Band>
      <Section>
        <Eyebrow>— Meet —</Eyebrow>
        <Heading>Food Lovers</Heading>
        <Subtitle>
          Real people. Real food. A community of passionate food lovers sharing
          recipes, tips and delicious moments from around the world.
        </Subtitle>

        <Row>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <SkeletonPerson key={i} />
              ))
            : users.map((user, i) => (
                <Person
                  key={user._id}
                  onClick={() => Navigate(`/profile/${user._id}`)}
                >
                  <AvatarWrap>
                    <AvatarAccents index={i} />
                    <Avatar src={user.photo} alt={user.name} />
                  </AvatarWrap>
                  <Name>{user.name}</Name>
                  {user.bio && <Quote>&ldquo;{user.bio}&rdquo;</Quote>}
                </Person>
              ))}
        </Row>

        <CTA
          // onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          to={me ? "/discover-friends" : "/signup"}
        >
          Join Our Community
        </CTA>
      </Section>
    </Band>
  );
}

const Band = styled.div`
  position: relative;
  overflow: hidden;
  background-color: #fbf6ec18;
  background-image:
    radial-gradient(circle at 94% 6%, #fbefc9df 0, transparent 24%),
    radial-gradient(circle at 6% 94%, #fbefc9 0, transparent 24%),
    /* radial-gradient(circle at 16% 44%, #fbc9c9a7 0, transparent 64%); */
    radial-gradient(circle at 41% 51%, #dfc9fb 0, transparent 64%);

  /* radial-gradient(circle at 84% 74%, #fbe5c9 0, transparent 54%); */

  /* soft sage blob, top-left */
  /* &::before {
    content: "";
    position: absolute;
    top: -110px;
    left: -100px;
    width: 340px;
    height: 380px;
    background: #e3ecd888;
    border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
    opacity: 0.85;
  } */

  /* soft peach blob, bottom-right */
  /* &::after {
    content: "";
    position: absolute;
    bottom: -120px;
    right: -90px;
    width: 360px;
    height: 280px;
    background: #fae4da84;
    border-radius: 45% 55% 40% 60% / 55% 45% 60% 40%;
    opacity: 0.9;
  } */
`;

const Section = styled.section`
  position: relative;
  z-index: 1;
  /* max-width: 100%; */
  max-width: 70rem;
  margin: 0 auto;
  padding: 44px 24px;
  padding-bottom: 7rem;
  text-align: center;
`;

const Eyebrow = styled.p`
  font-size: 1.4rem;
  letter-spacing: 3px;
  color: #7a8a6f;
  text-transform: uppercase;
  margin: 0 0 6px;
`;

const Heading = styled.h2`
  font-family: "Caveat", cursive;
  font-size: 4.7rem;
  font-weight: 700;
  color: #3f6b3f;
  margin: 0 0 16px;
  line-height: 1;
`;

const Subtitle = styled.p`
  max-width: 38rem;
  margin: 0 auto 2rem;
  color: #7a7267;
  font-size: 1.3rem;
  line-height: 1.6;
`;

const Row = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 36px;
  margin-bottom: 44px;
`;

const Avatar = styled.img`
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  object-fit: cover;
  background: #f0e9dc;
  transition: transform 0.33s ease;
`;

const Name = styled.p`
  font-family: "Caveat", cursive;
  font-weight: 700;
  font-size: 1.5rem;
  color: #3f6b3f;
  margin: 0 0 6px;
`;

const Person = styled.div`
  width: 15rem;
  cursor: pointer;
  &:hover ${Name} {
    text-decoration: underline;
  }
  &:hover ${Avatar} {
    transform: scale(1.03); /* 10% bigger */
  }
`;

const AvatarWrap = styled.div`
  position: relative;
  width: 14.5rem;
  height: 14.5rem;
  margin: 0 auto 6px;
`;

const AccentSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const Quote = styled.p`
  font-size: 0.85rem;
  color: #8a7a6a;
  font-style: italic;
  line-height: 1.4;
  margin: 0;
`;

const SkeletonPerson = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #f0e9dc;
  margin: 0 auto;
`;

const CTA = styled(Link)`
  display: inline-block;
  background: #3f6b3f;
  color: #fff;
  padding: 12px 32px;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.15s ease;

  &:hover {
    background: #345c34;
  }
`;
