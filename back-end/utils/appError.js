class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.message = message;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
module.exports = AppError;
