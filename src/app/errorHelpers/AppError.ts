// AppError.ts
export class AppError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 500, stack?: string) {
    super(message);
    this.statusCode = statusCode;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}