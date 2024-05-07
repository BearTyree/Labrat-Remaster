import mongoose from 'mongoose';

interface IUser {
  name: string;
  password: {
    salt: string;
    hash: string;
  };
  email: string;
}

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
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
  projects: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'project',
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'class',
    required: [true, 'Please enter a class'],
  },
});

const Student = mongoose.model<IUser>('student', studentSchema);
export default Student;
