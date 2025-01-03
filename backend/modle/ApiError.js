class ApiError extends Error {
    constructor(statusCode, Error) {
      super(Error);
      this.statusCode = statusCode; // Set HTTP status code (e.g., 400, 404, 500)
      this.Error = Error || 'Something went wrong'; // Set error Error
      this.isOperational = true; // Indicates it's a controlled error
      Error.captureStackTrace(this, this.constructor); // Captures the stack trace for better debugging
    }
  }
  
  export default ApiError;
  