import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
    unique: [true, 'School name already exists'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please enter a phone number'],
  },
  address: {
    type: String,
    required: [true, 'Please enter an address'],
  },
  SRC: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'src',
  },
});

const School = mongoose.model('school', schoolSchema);

export default School;
