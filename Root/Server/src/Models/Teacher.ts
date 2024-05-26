import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
    unique: false,
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
    unique: false,
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
  classes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'class',
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'school',
  },
});

const Teacher = mongoose.model('teacher', teacherSchema);

export default Teacher;
