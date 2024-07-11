import mongoose from 'mongoose';
import Student from './Student';
import Class from './Class';
import Teacher from './Teacher';
import School from './School';
import SRC from './SRC';
import IStudent from '../Interfaces/student.interface';
import IClass from '../Interfaces/class.interface';
import ITeacher from '../Interfaces/teacher.interface';
import ISchool from '../Interfaces/school.interface';
import IUser from '../Interfaces/user.interface';
import { sendUpdateToUser } from '../index';

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

const findUsersWithAccess = async (id: string) => {
  const students = (await Student.find({
    projects: { $in: [id] },
  }).catch((err) => console.log(err))) as IStudent[];
  const classes = (await Class.find({
    _id: {
      $in: students.reduce((accum: string[], student) => {
        accum.push(student.class.toString());
        return accum;
      }, []),
    },
  }).catch((err) => console.log(err))) as unknown as IClass[];
  const teachers = (await Teacher.find({
    _id: {
      $in: classes.reduce((accum: string[], cls) => {
        accum.push(cls.teacher.toString());
        return accum;
      }, []),
    },
  }).catch((err) => console.log(err))) as unknown as ITeacher[];
  const schools = (await School.find({
    _id: {
      $in: teachers.reduce((accum: string[], teacher) => {
        accum.push(teacher.school.toString());
        return accum;
      }, []),
    },
  }).catch((err) => console.log(err))) as unknown as ISchool[];
  const srcs = (await SRC.find({
    _id: {
      $in: schools.reduce((accum: string[], school) => {
        accum.push(school.SRC.toString());
        return accum;
      }, []),
    },
  }).catch((err) => console.log(err))) as unknown as IUser[];

  return [...students, ...teachers, ...srcs];
};

projectSchema.post('save', function (doc, next) {
  console.log('saved project');
  next();
});

projectSchema.post('findOneAndUpdate', async function (doc, next) {
  const users = await findUsersWithAccess(doc._id);

  for (let user of users) {
    sendUpdateToUser(user._id, doc);
  }
  next();
});

const Project = mongoose.model('project', projectSchema);

export default Project;
