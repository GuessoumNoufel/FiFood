import styled from "styled-components";
import { Link } from "react-router-dom";
// import loginBackground from "../assets/login-background.png";
import loginBackground from "../assets/login.png";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: #fbf7f1; */
  font-family: "Inter", sans-serif;
  /* margin-top: 2rem; */
  padding-top: 0;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  /* background: #fff; */
  background-image: url(${loginBackground});
  /* background-size: calc(102%); */
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #e8e0d4;
  border-radius: 16px;
  padding: 36px 32px;
  padding-top: 0;
  /* &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.26);
    border-radius: inherit;
    z-index: 0;
    height: 100%;
  }

  & > * {
    position: relative;
    z-index: 1;
  } */
`;

const Brand = styled.div`
  text-align: center;
  width: 13rem;
  margin: 0 auto;
  transform: translateX(-1rem);
`;
// const Brand = styled.h1`
//   font-family: "Fraunces", Georgia, serif;
//   font-size: 24px;
//   text-align: center;
//   color: #2b2620;
//   margin: 0 0 20px;
// `;

const Heading = styled.h2`
  font-family: "Fraunces", Georgia, serif;
  font-size: 20px;
  text-align: center;
  color: #2b2620;
  margin: 0 0 4px;
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 13px;
  color: #8a7f6e;
  margin: 0 0 24px;
`;

const Field = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #2b2620;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid #e8e0d4;
  border-radius: 8px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #c1592a;
  }
`;

const ForgotLink = styled(Link)`
  display: block;
  text-align: right;
  font-size: 12px;
  color: #c1592a;
  text-decoration: none;
  margin: -8px 0 16px;

  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #c1592a;
  color: #fff;
  border: none;
  padding: 13px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background: #a64a22;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  color: #a69c8c;
  font-size: 13px;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e8e0d4;
  }
`;

const FooterText = styled.p`
  text-align: center;
  font-size: 13px;
  color: #534b41;
  margin-top: 20px;
  background-color: #ffffff1a;
`;

const FooterLink = styled(Link)`
  color: #c1592a;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export {
  Wrapper,
  Card,
  Brand,
  Heading,
  Subtitle,
  Field,
  Label,
  Input,
  SubmitButton,
  Divider,
  FooterText,
  FooterLink,
  ForgotLink,
};
