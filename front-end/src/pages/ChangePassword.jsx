import { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import styled from "styled-components";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { changePassword } from "../API/users";

const Page = styled.main`
  width: min(100% - 3.2rem, 52rem);
  margin: 5.6rem auto 8rem;
  padding: 3.2rem;
  border: 1px solid #eee6da;
  border-radius: 2rem;
  background: #fffdf9;
  box-shadow: 0 1.8rem 5rem rgba(43, 38, 32, 0.08);
  font-family: "Inter", sans-serif;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  margin-bottom: 2.4rem;
  color: #a9471f;
  font-size: 1.4rem;
  font-weight: 600;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const Title = styled.h1`
  margin: 0 0 0.8rem;
  color: #2b2620;
  font: 700 3rem/1.2 "Fraunces", Georgia, serif;
`;

const Intro = styled.p`
  margin: 0 0 2.8rem;
  color: #807568;
  font-size: 1.4rem;
  line-height: 1.6;
`;

const Field = styled.div`
  margin-bottom: 1.8rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.7rem;
  color: #3e3932;
  font-size: 1.3rem;
  font-weight: 650;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 1.2rem 1.4rem;
  border: 1px solid #e4dbce;
  border-radius: 1rem;
  outline: none;
  background: #fff;
  color: #2b2620;
  font: 1.4rem "Inter", sans-serif;
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:focus {
    border-color: #c1592a;
    box-shadow: 0 0 0 3px rgba(193, 89, 42, 0.12);
  }
`;

const Help = styled.p`
  margin: 0.8rem 0 0;
  color: #928779;
  font-size: 1.2rem;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2.8rem;
`;

const Submit = styled.button`
  padding: 1.15rem 2rem;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #e9782e, #c64d17);
  color: #fff;
  font-size: 1.4rem;
  font-weight: 650;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: wait; }
`;

const Cancel = styled(Link)`
  padding: 1.1rem 1.8rem;
  border: 1px solid #e8e0d4;
  border-radius: 999px;
  color: #4a4238;
  font-size: 1.4rem;
  text-decoration: none;
  &:hover { background: #f8f1e7; }
`;

function ChangePassword() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      toast.error("The new passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const result = await changePassword({
        password: currentPassword,
        newPassword,
        newPasswordConfirm,
      });
      if (result.token) localStorage.setItem("token", result.token);
      toast.success("Your password has been changed");
      navigate(`/profile/${user._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ?? "Could not change your password",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <BackLink to={`/profile/${user._id}`}>← Back to profile</BackLink>
      <Title>Change password</Title>
      <Intro>
        Choose a new password for your FiFood account. You’ll stay signed in
        after it’s updated.
      </Intro>
      <form onSubmit={handleSubmit}>
        <Field>
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
          />
        </Field>
        <Field>
          <Label htmlFor="new-password">New password</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={40}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />
          <Help>Use between 8 and 40 characters.</Help>
        </Field>
        <Field>
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={40}
            value={newPasswordConfirm}
            onChange={(event) => setNewPasswordConfirm(event.target.value)}
            required
          />
        </Field>
        <Actions>
          <Submit type="submit" disabled={saving}>
            {saving ? "Saving…" : "Update password"}
          </Submit>
          <Cancel to={`/profile/${user._id}`}>Cancel</Cancel>
        </Actions>
      </form>
    </Page>
  );
}

export default ChangePassword;
