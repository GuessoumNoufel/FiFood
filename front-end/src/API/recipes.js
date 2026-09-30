import api from "./axios";

export const getRecipe = (id) =>
  api.get(`/recipes/${id}`).then((res) => res.data);

export const createRecipe = (data) => {
  return api.post(`/recipes/createRecipe`, data).then((res) => res.data);
};
export const updateRecipe = (id, data) =>
  api.patch(`/recipes/updateRecipe/${id}`, data).then((res) => res.data);

export const deleteRecipe = (id) =>
  api.delete(`/recipes/deleteRecipe/${id}`).then((res) => res.data);

export const rateRecipe = (id, value) =>
  api.patch(`/recipes/rate/${id}`, { value }).then((res) => res.data);

export const getPopularRecipes = () => {
  return api.get("/recipes", { params: { sort: "-averageRating", limit: 5 } });
};

export const getAllLocalRecipes = () => {
  return api.get("/recipes", { params: { limit: 1000 } });
};

// export const getPopularRecipesx = () => {
//   return api.get("/recipes", { params: { sort: "-averageRating", limit: 5 } });
//   // return api.get("/recipes", { params: { limit: 5 } });
// };
