import 'express';

declare global {
  namespace Express {
    interface User {
      userId: string;
       role: string;
      // ...other properties
    }
    interface Request {
      user?: User;
    }
  }
}