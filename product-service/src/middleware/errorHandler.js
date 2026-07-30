const errorHandler = (err, req, res, _next) => {
  console.log('=========== ERROR START ===========');
  console.log(err);
  console.log('=========== ERROR END ===========');

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
