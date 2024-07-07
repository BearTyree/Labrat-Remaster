import Project from '../Models/Project';
import Student from '../Models/Student';
import SRC from '../Models/SRC';
import Teacher from '../Models/Teacher';
import Class from '../Models/Class';
import School from '../Models/School';
import ITeacher from '../Interfaces/teacher.interface';
import IUser from '../Interfaces/user.interface';
import ISchool from '../Interfaces/school.interface';
import IClass from '../Interfaces/class.interface';
import Mongoose, { Schema } from 'mongoose';

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

const getProjects = async (email: string, id: string) => {
  try {
    if (!id) {
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
    } else {
      const models = [SRC, Teacher];
      let emailAccount: any;
      let modelType: any;
      for (let model of models) {
        let possibleAccount = await model
          .findOne({ email })
          .catch((err: Error) => {
            return err.message;
          });
        if (possibleAccount) {
          emailAccount = possibleAccount;
          modelType = model;
          break;
        }
      }

      if (!emailAccount) {
        throw new Error('Account not found');
      }

      switch (modelType) {
        case SRC: {
          const currentClass = (await Class.findById({ _id: id }).catch(
            (err: Error) => {
              return { message: err };
            }
          )) as unknown as IClass;
          if (!currentClass) {
            throw new Error('Class not found');
          }
          const teacher = (await Teacher.findById({
            _id: currentClass.teacher,
          }).catch((err: Error) => {
            return { message: err };
          })) as unknown as ITeacher;
          if (!teacher) {
            throw new Error('Teacher not found');
          }
          const school = (await School.findById(teacher.school).catch(
            (err: Error) => {
              return { message: err };
            }
          )) as unknown as ISchool;
          if (!school) {
            throw new Error('School not found');
          }

          if (school.SRC.toString() !== emailAccount._id.toString()) {
            throw new Error('not accessible from your account');
          }
          break;
        }
        case Teacher: {
          const currentClass = (await Class.findById({ _id: id }).catch(
            (err: Error) => {
              return { message: err };
            }
          )) as unknown as IClass;
          if (!currentClass) {
            throw new Error('Class not found');
          }
          const teacher = (await Teacher.findById({
            _id: currentClass.teacher,
          }).catch((err: Error) => {
            return { message: err };
          })) as unknown as ITeacher;
          if (!teacher) {
            throw new Error('Teacher not found');
          }
          if (teacher._id.toString() !== emailAccount._id.toString()) {
            throw new Error('not accessible from your account');
          }
          break;
        }
      }

      const students = (await Student.find({ class: id }).catch(
        (err: Error) => {
          return { message: err };
        }
      )) as unknown as IUser[];

      let projects = [];

      for (let student of students) {
        projects.push(await Project.find({ _id: { $in: student.projects } }));
      }

      return { message: 'success', projects };
    }
  } catch (err) {
    console.log(err);
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

const getProject = async (id: string, email: string) => {
  try {
    let project = await Project.findById(id).catch((err: Error) => {
      return err.message;
    });
    let student = await Student.find({ email, projects: { $in: project } });
    if (project && student) {
      return { message: 'success', project };
    } else {
      throw new Error('Project not found');
    }
  } catch (err) {
    return { message: err.message };
  }
};

const deleteProject = async (id: string, email: string) => {
  try {
    let project = await Project.findById(id);
    if (!project) {
      throw new Error('Project not found');
    }
    let student = await Student.findOne({ email });
    if (!student) {
      throw new Error('Student not found');
    }

    if (student.projects.map(String).includes(id)) {
      await Project.findByIdAndDelete(id);
      await Student.findOneAndUpdate(
        { email },
        { $pull: { projects: new Mongoose.Types.ObjectId(id) } }
      );
    }

    return { message: 'success' };
  } catch (err) {
    return { message: err.message };
  }
};

export { createProject, getProjects, updateProject, getProject, deleteProject };
