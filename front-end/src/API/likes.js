import api from "./axios";

export const toggleLike = (id) =>
  api.post(`/likedRecipes/likes/${id}`).then((res) => res.data);

export const getFavorites = () =>
  api.get("/likedRecipes/favorites").then((res) => res.data);
