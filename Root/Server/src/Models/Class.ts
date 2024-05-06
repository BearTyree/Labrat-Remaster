import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
    unique: [true, 'Class name already exists'],
  },
  code: {
    type: String,
    required: [true, 'Please enter a code'],
    unique: [true, 'Class code already exists'],
  },
});

const Class = mongoose.model('class', classSchema);

export default Class;
