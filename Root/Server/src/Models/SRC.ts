import { has } from 'config';
import mongoose from 'mongoose';

interface IUser {
  name: string;
  password: {
    salt: string;
    hash: string;
  };
  email: string;
}

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
  hasSetPassword: {
    type: Boolean,
    required: [true, 'Please enter a password'],
  },
});

const SRC = mongoose.model<IUser>('src', SRCSchema);

export default SRC;
