import { User } from 'firebase-admin';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
