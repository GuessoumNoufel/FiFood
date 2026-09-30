import api from "./axios";

export const createComment = (id, comment) => {
  return api.post(`/comments/${id}`, comment).then((res) => res.data);
};
export const getComments = (id) => {
  return api.get(`/comments/recipe/${id}`).then((res) => res.data);
};
export const toggleCommentLike = (id) => {
  return api.post(`/comments/${id}/like`).then((res) => res.data);
};
export const deleteComment = (id) => {
  return api.delete(`/comments/${id}`).then((res) => res.data);
};
export const updateComment = (id, text) => {
  return api.patch(`/comments/${id}`, { text }).then((res) => res.data);
};

// /:recipeId
//  getCommentsForRecipe,
// deleteComment,
// toggleCommentLike,
