import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import RecipeDetail from "./pages/RecipeDetail";
import EditRecipe from "./pages/EditRecipe";
import CreateRecipe from "./pages/CreateRecipe";
import Favorites from "./pages/Favorites";
import Cuisines from "./pages/Cuisine";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import OAuthSuccess from "./pages/OAuthSuccess";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import DiscoverFriends from "./pages/DiscoverFriends";
import Footer from "./components/Footer";
import About from "./pages/About";
import { AuthContext } from "./context/AuthContext";

function GuestOnly({ children }) {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/recipe/:id/edit" element={<EditRecipe />} />
        <Route path="/create-recipe" element={<CreateRecipe />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cuisines" element={<Cuisines />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
        <Route path="/signup" element={<GuestOnly><Signup /></GuestOnly>} />
        <Route path="/discover-friends" element={<DiscoverFriends />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

// localStorage.setItem('user', JSON.stringify({ name: 'Fifo' }));
// localStorage.setItem('token', 'fake-token-for-testing');
