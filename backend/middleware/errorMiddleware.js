module.exports = (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    message: err.message || "Server error",
  });
};
