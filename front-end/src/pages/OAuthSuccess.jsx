import { useEffect, useContext, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { exchangeGoogleCode, getMe } from "../API/users";

function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const exchangeStarted = useRef(false);

  useEffect(() => {
    if (exchangeStarted.current) return;
    exchangeStarted.current = true;
    const code = searchParams.get("code");
    if (!code) {
      navigate("/login");
      return;
    }
    window.history.replaceState({}, document.title, "/oauth-success");

    exchangeGoogleCode(code)
      .then(() => {
        return getMe().then((res) => res.data.user);
      })
      .then((user) => {
        if (!user) return;
        login(user);
        navigate("/");
      })
      .catch(() => {
        navigate("/login");
      });
  }, [login, navigate, searchParams]);

  return <p style={{ padding: "48px" }}>Signing you in...</p>;
}

export default OAuthSuccess;
