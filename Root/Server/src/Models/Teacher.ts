import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: [true, 'Email already exists'],
  },
  classes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'class',
  },
});

const Teacher = mongoose.model('teacher', teacherSchema);

export default Teacher;
