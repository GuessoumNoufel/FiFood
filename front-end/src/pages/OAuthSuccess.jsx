import { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getMe } from "../API/users";

function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Temporarily store the token so the next request can use it, then fetch the user.
    localStorage.setItem("token", token);

    getMe() // see note below — needs a "who am I" endpoint
      .then((res) => {
        login(res.data.user, token);
        navigate("/");
      })
      .catch(() => navigate("/login"));
  }, []);

  return <p style={{ padding: "48px" }}>Signing you in...</p>;
}

export default OAuthSuccess;
