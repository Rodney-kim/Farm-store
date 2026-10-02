// Runs when a request hits a route that does not exist.
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Central error handler. Every controller forwards errors here with
// next(error) instead of handling them inline, so the response shape
// stays consistent across the whole API.
export const errorHandler = (err, req, res, next) => {
  // Mongoose "CastError" happens when an id is not a valid ObjectId
  // (e.g. someone requests /api/products/not-a-real-id).
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Mongoose validation errors (missing/invalid required fields).
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server",
  });
};
