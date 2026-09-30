import api from "./axios";

export const getNotifications = () =>
  api.get("/users/notifications").then((res) => res.data);

export const markNotificationRead = (id) =>
  api.patch(`/users/notifications/${id}/read`).then((res) => res.data);
