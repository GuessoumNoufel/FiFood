// back-end/utils/emailTemplates.js

// Recipe titles, names and descriptions are user-written, so escape them
// before putting them inside HTML.
const esc = (s = "") =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

exports.confirmUrl = (token) =>
  `${process.env.API_URL}/newsletter/confirm/${token}`;
exports.unsubscribeUrl = (token) =>
  `${process.env.API_URL}/newsletter/unsubscribe/${token}`;

// adjust to your real RecipeDetail route
const recipeUrl = (id) => `${process.env.CLIENT_URL}/recipe/${id}`;

const button = (href, label) =>
  `<a href="${href}" style="display:inline-block;background:#db5f00;color:#fff;padding:12px 26px;border-radius:999px;text-decoration:none;font-weight:600">${label}</a>`;

const shell = (body, unsubscribeUrl) => `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#2b2620">
  <h2 style="font-family:Georgia,serif;margin:0 0 20px">FiFood<span style="color:#db5f00">.</span></h2>
  ${body}
  <hr style="border:none;border-top:1px solid #eee;margin:32px 0 12px" />
  <p style="font-size:12px;color:#8a7a6a;margin:0">
    ${
      unsubscribeUrl
        ? `You're receiving this because you subscribed on FiFood. <a href="${unsubscribeUrl}" style="color:#8a7a6a">Unsubscribe</a>`
        : "If you didn't sign up for this, you can safely ignore this email."
    }
  </p>
</div>`;

const recipeBlock = (recipe) => `
  <a href="${recipeUrl(recipe._id)}" style="text-decoration:none;color:inherit">
    <img src="${esc(recipe.image)}" alt="" style="width:100%;border-radius:12px;display:block" />
    <h3 style="font-family:Georgia,serif;font-size:22px;margin:14px 0 4px">${esc(recipe.title)}</h3>
  </a>
  <p style="margin:0 0 12px;color:#8a7a6a;font-size:14px">
    ${esc(recipe.category)} · ${esc(recipe.area)}${recipe.time ? ` · ${recipe.time} min` : ""}
  </p>
  <p style="margin:0 0 20px;line-height:1.5">${esc(recipe.description || "")}</p>
  ${button(recipeUrl(recipe._id), "View recipe")}`;

exports.confirmEmail = (url) =>
  shell(`
    <p style="line-height:1.5">Thanks for signing up! Confirm your email to start getting a new recipe every week.</p>
    <p>${button(url, "Confirm subscription")}</p>`);

exports.weeklyEmail = (recipe, author, unsubscribeUrl) =>
  shell(
    `
    <p style="margin:0 0 16px;font-weight:600;color:#db5f00">Your recipe of the week</p>
    ${recipeBlock(recipe)}
    <p style="margin:20px 0 0;font-size:13px;color:#8a7a6a">Shared by ${esc(author?.name ?? "a FiFood cook")}</p>`,
    unsubscribeUrl,
  );

exports.newRecipeEmail = (author, recipe, unsubscribeUrl) =>
  shell(
    `
    <p style="margin:0 0 16px"><strong>${esc(author.name)}</strong> just shared a new recipe:</p>
    ${recipeBlock(recipe)}`,
    unsubscribeUrl,
  );
