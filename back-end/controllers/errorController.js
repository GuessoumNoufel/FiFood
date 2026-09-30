module.exports = (err, req, res, next) => {
  const statusCode =
    err.statusCode ||
    (err.status >= 400 && err.status < 500 ? err.status :
    (err.code === "LIMIT_FILE_SIZE" ? 413 :
      err.name === "ValidationError" || err.name === "CastError" ? 400 :
        err.code === 11000 ? 409 :
          err.name === "MulterError" ? 400 : 500));
  const status = err.status || (statusCode < 500 ? "fail" : "error");

  console.error("ERROR 💥", err);
  return res.status(statusCode).json({
    status,
    message:
      process.env.NODE_ENV === "production" && !err.isOperational
        ? "An unexpected error occurred"
        : err.message,
  });
};
