const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err.message || err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(statusCode).json({ success: false, error: message });
};

module.exports = errorHandler;
