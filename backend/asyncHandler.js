const asyncHandler = (fn) => (req, res, next) => {
  // Call the passed function and catch any errors
  fn(req, res, next).catch((err) => {
    // If the error is an instance of ApiError, use its properties, otherwise use a generic error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Send response with error status code and message
    res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : null, // Optionally show the stack trace in development
    });
  });
};

export default asyncHandler;
