// back-end/controllers/newsletterController.js
const validator = require("validator");
const Subscriber = require("../models/Subscriber");
const catchAsync = require("../utils/catchAsync"); // adjust to your paths
const AppError = require("../utils/appError");
const { sendEmail } = require("../utils/email");
const { confirmEmail, confirmUrl } = require("../utils/emailTemplates");

// Tiny standalone page shown after clicking a link in an email,
// so no extra frontend routes are needed.
const page = (title, text) => `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>FiFood</title></head>
<body style="font-family:Arial,sans-serif;background:#fbf6ec;color:#2b2620;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0">
  <div style="text-align:center;padding:24px">
    <h1 style="font-family:Georgia,serif">${title}</h1>
    <p>${text}</p>
    <a href="${process.env.CLIENT_URL}" style="color:#db5f00;font-weight:600">Back to FiFood</a>
  </div>
</body></html>`;

exports.subscribe = catchAsync(async (req, res, next) => {
  const email = String(req.body.email || "")
    .trim()
    .toLowerCase();

  if (!validator.isEmail(email)) {
    return next(new AppError("Please enter a valid email address", 400));
  }

  let subscriber = await Subscriber.findOne({ email });

  if (subscriber?.confirmed) {
    return res.status(200).json({
      status: "success",
      message: "You're already subscribed!",
    });
  }

  if (!subscriber) subscriber = await Subscriber.create({ email });

  // also covers someone who signed up but never confirmed: resend the link
  await sendEmail({
    to: subscriber.email,
    subject: "Confirm your FiFood subscription",
    html: confirmEmail(confirmUrl(subscriber.token)),
  });

  res.status(200).json({
    status: "success",
    message: "Almost done! Check your inbox to confirm your subscription.",
  });
});

exports.confirm = catchAsync(async (req, res) => {
  const subscriber = await Subscriber.findOneAndUpdate(
    { token: req.params.token },
    { confirmed: true },
  );

  if (!subscriber) {
    return res
      .status(404)
      .send(page("Link not valid", "This confirmation link is invalid."));
  }
  res
    .status(200)
    .send(
      page(
        "You're subscribed!",
        "A new recipe will land in your inbox every week.",
      ),
    );
});

exports.unsubscribe = catchAsync(async (req, res) => {
  await Subscriber.findOneAndDelete({ token: req.params.token });
  // same message whether or not it existed, so links can't be probed
  res
    .status(200)
    .send(
      page("You're unsubscribed", "You won't receive any more emails from us."),
    );
});
