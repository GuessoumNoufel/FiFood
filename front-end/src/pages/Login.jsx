import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import styled from "styled-components";
import toast from "react-hot-toast";
import { login as loginApi } from "../API/auth";
import { AuthContext } from "../context/AuthContextObject";
import GoogleButton from "../components/GoogleButton";

import {
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
} from "../components/AuthLayout";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await loginApi(email, password);
      login(res.data.user);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
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
        <Heading>Welcome back</Heading>
        <Subtitle>Log in to your account.</Subtitle>

        <form onSubmit={handleSubmit}>
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
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <ForgotLink to="/forgot-password">Forgot password?</ForgotLink>

          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? "Logging in..." : "Log In"}
          </SubmitButton>
        </form>

        <div>
          <Divider>or</Divider>
          <GoogleButton />
        </div>

        <FooterText>
          Don't have an account? <FooterLink to="/signup">Sign up</FooterLink>
        </FooterText>
      </Card>
    </Wrapper>
  );
}

export default Login;
