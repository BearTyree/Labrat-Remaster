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
    return 'success';
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

export { createProject, getProjects };
