class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = "APIError"; // set the error type to APIError

    Error.captureStackTrace(this, this.constructor);
  }
}

const asyncErrorHandler = (fn = (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
});

const ErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  console.error(err.stack); // log the error stack over the server's console.

  // Wrong ID error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new APIError(message, 400);
  }

  // Mongoose duplicate error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new APIError(message, 400);
  }

  // Mongoose jsonwebtoken error
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid, try again.`;
    err = new APIError(message, 401);
  }

  // Mongoose tokenexpired error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token has expired, try again.`;
    err = new APIError(message, 401);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.stack,
    status: "Error",
  });
};

module.exports = { ErrorHandler, APIError, asyncErrorHandler };
