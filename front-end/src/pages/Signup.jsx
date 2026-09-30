import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signup as signupApi } from "../API/auth";
import { AuthContext } from "../context/authContext";
import GoogleButton from "../components/GoogleButton";
import styled from "styled-components";
import signupBackground from "../assets/signup.png";

// reuse the same styled components as Login — in practice, move these into
// src/components/AuthLayout.jsx and import both here and in Login.jsx
import {
  // Wrapper,
  // Card,
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
} from "../components/AuthLayout";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: #fbf7f1; */
  font-family: "Inter", sans-serif;
  margin-top: 2rem;
  padding-top: 0;
`;
const Card = styled.div`
  width: 100%;
  max-width: 40rem;
  /* background: #fff; */
  background-image: url(${signupBackground});
  /* background-size: calc(100%); */
  background-size: 100% 100%;
  object-fit: fill;
  background-position: top;
  background-repeat: no-repeat;
  border: 1px solid #e8e0d4;
  border-radius: 16px;
  padding: 36px 32px;
  padding-top: 0;
`;

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const res = await signupApi({ name, email, password, confirmPassword });
      login(res.user);
      toast.success("Account created!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create account");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <Brand>
          <img src="src/assets/logo2.png" alt="our logo" />
        </Brand>
        <Heading>Create your account</Heading>
        <Subtitle>Join our community of food lovers and home cooks.</Subtitle>

        <form onSubmit={handleSubmit}>
          <Field>
            <Label>Name</Label>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>

          <Field>
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field>
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </Field>

          <Field>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Field>

          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
          </SubmitButton>
        </form>

        <Divider>or</Divider>

        <GoogleButton />

        <FooterText>
          Already have an account? <FooterLink to="/login">Log in</FooterLink>
        </FooterText>
      </Card>
    </Wrapper>
  );
}

export default Signup;
