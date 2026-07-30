const errorHandler = (err, req, res, _next) => {
  console.error('Analytics Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
