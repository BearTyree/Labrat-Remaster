import mongoose from 'mongoose';

import { IUser } from '../Interfaces/user.interface';

const SRCSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [false, 'Please enter a name'],
    unique: [true, 'Username already exists'],
  },
  password: {
    type: {
      salt: String,
      hash: String,
    },
    required: [true, 'Please enter a password'],
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: [true, 'Email already exists'],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationCode: {
    type: String,
    required: [true, 'Please enter an email verification code'],
  },
  hasSetPassword: {
    type: Boolean,
    required: [true, 'Please enter a password'],
  },
});

const SRC = mongoose.model<IUser>('src', SRCSchema);

export default SRC;
