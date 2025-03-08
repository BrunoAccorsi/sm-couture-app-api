export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized - Please login') {
    super(message, 401);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Invalid input data') {
    super(message, 400);
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500);
  }
}
