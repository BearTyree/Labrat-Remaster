import { has } from 'config';
import mongoose from 'mongoose';

const SRCSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter a name'],
    unique: [true, 'Username already exists'],
  },
  password: {
    type: {
      salt: String,
      hash: String,
    },
    required: [true, 'Please enter a password'],
  },
  hasSetPassword: {
    type: Boolean,
    required: [true, 'Please enter a password'],
  },
});

const SRC = mongoose.model('src', SRCSchema);

export default SRC;
