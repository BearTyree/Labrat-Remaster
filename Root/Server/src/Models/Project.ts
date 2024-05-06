import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a name'],
    unique: [true, 'Project name already exists'],
  },
  description: {
    type: String,
    required: [true, 'Please enter a description'],
  },
});

const Project = mongoose.model('project', projectSchema);

export default Project;
