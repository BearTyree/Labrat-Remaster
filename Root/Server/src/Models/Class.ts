import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
  },
  code: {
    type: String,
    required: [true, 'Please enter a code'],
    unique: [true, 'Class code already exists'],
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teacher',
  },
});

const Class = mongoose.model('class', classSchema);

export default Class;
