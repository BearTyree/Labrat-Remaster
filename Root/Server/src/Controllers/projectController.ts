import Project from '../Models/Project';
import Student from '../Models/Student';
import { IUser } from '../Interfaces/user.interface';

const createProject = async (name: string, email: string) => {
  try {
    let project = new Project({
      name,
      description: '',
    });
    await project.save();
    await Student.findOneAndUpdate(
      { email },
      { $push: { projects: project._id } },
      { new: true }
    );
    return { message: 'success', id: project._id };
  } catch (err) {
    return err.message;
  }
};

const getProjects = async (email: string) => {
  try {
    let student: unknown | IUser = await Student.findOne({ email })
      .populate('projects')
      .catch((err: Error) => {
        return err.message;
      });
    if ((student as IUser).projects) {
      return { message: 'success', projects: (student as IUser).projects };
    } else {
      throw new Error('Projects not found');
    }
  } catch (err) {
    return err.message;
  }
};

const updateProject = async (id: string, name: string, description: string) => {
  try {
    await Project.findByIdAndUpdate(id, { name, description });
    return { message: 'success' };
  } catch (err) {
    return { message: err.message };
  }
};

const getProject = async (id: string) => {
  try {
    let project = await Project.findById(id).catch((err: Error) => {
      return err.message;
    });
    if (project) {
      return { message: 'success', project };
    } else {
      throw new Error('Project not found');
    }
  } catch (err) {
    return { message: err.message };
  }
};

export { createProject, getProjects, updateProject, getProject };
