import mongoose from 'mongoose';
interface IUser {
  name: string;
  password: {
    salt: string;
    hash: string;
  };
  email: string;
  isEmailVerified: boolean;
}

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
