// front-end/src/api/newsletter.js
import api from "./axios";

export const subscribeToNewsletter = (email) =>
  api.post("/newsletter/subscribe", { email }).then((res) => res.data);
