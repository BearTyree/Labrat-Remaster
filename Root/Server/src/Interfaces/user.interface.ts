import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  password: {
    salt: string;
    hash: string;
  };
  email: string;
  isEmailVerified: boolean;
  emailVerificationCode?: string;
  projects?: Types.ObjectId[];
}
