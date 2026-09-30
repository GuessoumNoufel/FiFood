import api from "./axios";

export const login = (email, password) =>
  api.post("/users/login", { email, password }).then((res) => res.data);

export const signup = (data) =>
  api.post("/users/signup", data).then((res) => res.data);
