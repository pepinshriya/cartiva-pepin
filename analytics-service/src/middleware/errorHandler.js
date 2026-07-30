const errorHandler = (err, req, res, next) => {
  console.error("Analytics Error:", err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
