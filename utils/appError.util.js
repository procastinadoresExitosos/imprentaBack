class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("5") ? "Fallo interno" : "Error";

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { AppError };
