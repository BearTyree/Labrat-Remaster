import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
    unique: false,
  },
  description: {
    type: String,
    required: false,
  },
});

const Project = mongoose.model('project', projectSchema);

export default Project;
