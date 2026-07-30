const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

const notFound = (res, message = "Resource not found") => {
  return res.status(404).json({ success: false, error: message });
};

const serverError = (res, message = "Internal server error") => {
  return res.status(500).json({ success: false, error: message });
};

module.exports = { success, notFound, serverError };
