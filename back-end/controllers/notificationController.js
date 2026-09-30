const Notification = require("../models/notificationModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getMyNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate("actor", "name photo")
    .populate("recipe", "title image createdAt");

  res.status(200).json({ status: "success", data: notifications });
});

exports.markNotificationRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user.id, readAt: null },
    { readAt: new Date() },
    { new: true },
  );

  if (!notification) {
    const existing = await Notification.exists({
      _id: req.params.id,
      recipient: req.user.id,
    });
    if (!existing) return next(new AppError("Notification not found", 404));
  }

  res.status(200).json({ status: "success" });
});
