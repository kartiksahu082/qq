class ApiError extends Error {
  constructor(statusCode, message) {
    super(message); // Pass the error message to the parent Error class
    this.statusCode = statusCode; // Set HTTP status code (e.g., 400, 404, 500)
    this.message = message || 'Something went wrong'; // Set error message
    this.isOperational = true; // Indicates it's a controlled error
    Error.captureStackTrace(this, this.constructor); // Captures the stack trace for better debugging
  }
}

export default ApiError;
