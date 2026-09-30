import api from "./axios";

export const discoverMeals = (page = 1) =>
  api.get(`/mealAPI/discover/Random?page=${page}`).then((res) => res.data);

export const getMealById = (id) =>
  api.get(`/mealAPI/discover/id/${id}`).then((res) => res.data);

export const searchMealsByName = (name, page = 1) =>
  api
    .get(`/mealAPI/discover/name/${name}?page=${page}`)
    .then((res) => res.data);

export const filterMealsByCategory = (category, page = 1) =>
  api
    .get(`/mealAPI/discover/category/${encodeURIComponent(category)}?page=${page}`)
    .then((res) => res.data);

export const filterMealsByArea = (area, page = 1) =>
  api
    .get(`/mealAPI/discover/area/${area}?page=${page}`)
    .then((res) => res.data);
