import { Document, Types } from 'mongoose';

export default interface ITeacher extends Document {
  name: string;
  password: {
    salt?: string;
    hash?: string;
  };
  email: string;
  isEmailVerified: boolean;
  emailVerificationCode: string;
  hasSetPassword: boolean;
  school?: Types.ObjectId;
}
