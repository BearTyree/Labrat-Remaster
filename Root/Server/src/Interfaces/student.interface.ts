import { Document, Types } from 'mongoose';

export default interface IStudent extends Document {
  name: string;
  password: {
    salt?: string;
    hash?: string;
  };
  email: string;
  isEmailVerified: boolean;
  emailVerificationCode: string;
  class: Types.ObjectId;
}
