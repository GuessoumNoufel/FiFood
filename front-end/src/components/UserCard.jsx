import { Link } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  border: 1px solid #e8e0d4;
  border-radius: 14px;
  padding: 1rem 2.2rem;
  padding-top: 0;
  text-align: center;
  font-family: "Inter", sans-serif;
`;

const Avatar = styled.img`
  width: ${({ $image }) => ($image ? "8.5rem" : "13rem")};
  height: ${({ $image }) => ($image ? "8.5rem" : "13rem")};
  margin-bottom: ${({ $image }) => ($image ? "2rem" : "0")};
  margin-top: ${({ $image }) => ($image ? "2rem" : "0")};
  border-radius: 50%;
  object-fit: cover;
  background: #f0e9dc;

  /* margin-bottom: 10px; */
`;

const Name = styled(Link)`
  display: block;
  font-weight: 600;
  color: #2b2620;
  text-decoration: none;
  font-size: 1.5rem;

  &:hover {
    color: #c1592a;
  }
`;

const RecipeCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: #6b6255;
  margin: 10px 0;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 14px;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2b2620;
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: #a69c8c;
`;

const FollowButton = styled.button`
  width: 100%;
  padding: 9px 0;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid ${(props) => (props.$active ? "#C1592A" : "#E8E0D4")};
  background: ${(props) => (props.$active ? "#C1592A" : "#fff")};
  color: ${(props) => (props.$active ? "#fff" : "#4A4238")};

  &:hover {
    background: ${(props) => (props.$active ? "#A64A22" : "#F5EFE4")};
  }
`;

function UserCard({ user, onToggleFollow }) {
  const label = user.amFollowing
    ? "Following"
    : user.followsMe
      ? "Follow back"
      : "Follow";

  return (
    <Card>
      <Avatar
        $image={!user.photo.includes("default-profile-img")}
        src={user.photo}
        alt={user.name}
      />
      <Name to={`/profile/${user._id}`}>{user.name}</Name>
      <RecipeCount>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          role="img"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          style={{
            color: "rgb(74, 85, 101)",
            opacity: 1,
            transform: "rotate(0deg)",
          }}
        >
          <g
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.5"
          >
            <path d="M5 14.584C3.2341 13.8124 2 12.0503 2 10C2 7.23858 4.23858 5 7 5C7.25052 5 7.49673 5.01842 7.73736 5.05399"></path>
            <path d="M19 14.584V18C19 19.8856 19 20.8285 18.4142 21.4142C17.8284 22 16.8856 22 15 22H9C7.11438 22 6.17157 22 5.58579 21.4142C5 20.8285 5 19.8856 5 18V14.584"></path>
            <path d="M16.2627 5.05399C16.5033 5.01842 16.7495 5 17.0001 5C19.7615 5 22.0001 7.23858 22.0001 10C22.0001 12.0503 20.766 13.8124 19.0001 14.584"></path>
            <path d="M16.5 7V6.5C16.5 5.99416 16.4165 5.50782 16.2626 5.05399C15.6604 3.27806 13.9794 2 12 2C10.0206 2 8.33962 3.27806 7.73736 5.05399C7.58346 5.50782 7.5 5.99416 7.5 6.5V7"></path>
            <path stroke-linejoin="round" d="M5 18H19"></path>
          </g>
        </svg>{" "}
        {user.recipesCount} Recipes
      </RecipeCount>
      <StatsRow>
        <Stat>
          <StatValue>{user.followersCount}</StatValue>
          <StatLabel>Followers</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{user.followingCount}</StatValue>
          <StatLabel>Following</StatLabel>
        </Stat>
      </StatsRow>
      <FollowButton
        $active={user.amFollowing}
        onClick={() => onToggleFollow(user._id)}
      >
        {label}
      </FollowButton>
    </Card>
  );
}

export default UserCard;
