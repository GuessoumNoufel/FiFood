const axios = require("axios");

exports.filterMealsByCategory = async (category) => {
  const meals = await axios.get(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`,
  );

  if (meals.data.meals === null) return null;

  const results = meals.data.meals.map((meal) => ({
    mealDBId: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
  }));

  return results;
};

exports.filterMealsByArea = async (area) => {
  const meals = await axios.get(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`,
  );

  if (meals.data.meals === null) return null;

  const results = meals.data.meals.map((meal) => ({
    mealDBId: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
  }));

  return results;
};

exports.fetchMealById = async (mealId) => {
  const response = await axios.get(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
  );

  const meal = response.data.meals[0];
  if (!meal) return null; // no meal found for this ID

  //build the `ingredients` array
  const ings = [];
  Object.keys(meal).forEach((key) => {
    if (key.startsWith("strIngredient") && meal[key]) {
      ings.push(meal[key]);
    }
  });
  const recipe = {
    mealDBId: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory,
    area: meal.strArea,
    instructions: meal.strInstructions,
    ingredients: ings,
    youtube: meal.strYoutube,
  };
  // console.log(recipe);

  return recipe;
};

exports.searchMealsByName = async (mealName) => {
  const meals = await axios.get(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`,
  );

  if (meals.data.meals === null) return null;

  const results = meals.data.meals.map((meal) => {
    const ings = [];
    Object.keys(meal).forEach((key) => {
      if (key.startsWith("strIngredient") && meal[key]) {
        ings.push(meal[key]);
      }
    });
    const recipe = {
      mealDBId: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
      ingredients: ings,
    };
    return recipe;
  });

  // console.log(results);
  return results;
};

// const mealsData = meals.data.meals;
// console.log(mealsData);

//we r good for know , maybe we come back to it later , know i wanna talk about the structure of this , what i wanna build is a main page to get into directly after logging or signing up , this page has deferent recipes displayed (20 in a raw) , then u can look for more by changing the page to the next one and u can go back to the previous one for sure , u can search by id or name or ingredients or category , u can filter them as well by category or area  , u can click on any one of them , it takes u to the reciipe page , u can add it to like ones, or comment on it , and there is a special page to add ur own recipe (if its not possible to add it to an external api like this to make it appear to any one like the rest of the recipes in this api its ok , we just add it to our recipes ) , this is how we ganna build it
