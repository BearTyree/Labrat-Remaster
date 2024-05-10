import mongoose, { MongooseError } from 'mongoose';
import { IUser } from '../Interfaces/user.interface';

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

studentSchema.pre('save', async function (next) {
  const student = this;
  const results: IUser[] = (await Student.find({ email: student.email }).catch(
    (err: MongooseError) => {
      next(err);
    }
  )) as IUser[];
  for (let result of results) {
    if (result.isEmailVerified) {
      student.invalidate('email', 'email must be unique');
      next(new Error('email must be unique'));
    }
  }

  // no results, email has not been taken
  next();
});
const Student = mongoose.model<IUser>('student', studentSchema);
export default Student;
