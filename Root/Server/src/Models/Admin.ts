import mongoose from 'mongoose';
import IUser from '../Interfaces/user.interface';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter a username'],
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

const Admin = mongoose.model<IUser>('admin', adminSchema);

export default Admin;
