import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
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
});

const Student = mongoose.model('student', studentSchema);
export default Student;
