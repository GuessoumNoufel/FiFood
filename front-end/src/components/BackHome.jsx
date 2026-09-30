import { Link } from "react-router-dom";
import styled from "styled-components";

const BackHome = styled(Link)`
  font-family: "Fraunces", Georgia, serif;
  font-size: 1.4rem;
  font-weight: 600;
  color: #db5f00;
  text-transform: uppercase;
  display: inline-flex;
  gap: 4px;
  cursor: pointer;
  &:hover {
    color: #e8590c;
    text-shadow: 1px 1px 12px #ff620dae;
  }
`;

export default BackHome;
