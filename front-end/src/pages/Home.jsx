import Hero from "../components/Hero";
import CuisineCarousel from "../components/CuisineCarousel";
import PopularRecipes from "../components/PopularRecipes";
import QuickAndEasy from "../components/QuickAndEasy";
import MeetFoodLovers from "../components/MeetFoodLovers";

function Home() {
  return (
    <div>
      <Hero />
      <CuisineCarousel />
      <PopularRecipes />
      <QuickAndEasy />
      <MeetFoodLovers />
    </div>
  );
}

export default Home;
