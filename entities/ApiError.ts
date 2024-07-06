class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    // This line is needed because TypeScript doesn't correctly set the prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  // This method will format your error to be more readable
  formattedError() {
    return {
      status: "error",
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

export default ApiError;
