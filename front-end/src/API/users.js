import api from "./axios";

export const getUserProfile = (id) =>
  api.get(`/users/profile/${id}`).then((res) => res.data);

export const getUserRecipes = (id) =>
  api.get(`/users/${id}/recipes`).then((res) => res.data);

export const getUserFollowers = (id) =>
  api.get(`/users/${id}/followers`).then((res) => res.data);

export const getUserFollowing = (id) =>
  api.get(`/users/${id}/following`).then((res) => res.data);

export const toggleFollow = (id) =>
  api.post(`/users/${id}/follow`).then((res) => res.data);

export const updateMe = (data) =>
  api.patch("/users/updateMe", data).then((res) => res.data);

export const getMe = () => api.get("/users/me").then((res) => res.data);

export const changePassword = (passwordData) =>
  api.patch("/users/updatePassword", passwordData).then((res) => res.data);

export const getAllUsers = (params) =>
  api.get("/users/all", { params }).then((res) => res.data);

export const getFeaturedUsers = () => api.get("/users/featured");
