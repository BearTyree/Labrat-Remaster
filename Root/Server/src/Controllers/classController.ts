import Class from '../Models/Class';
import School from '../Models/School';
import Teacher from '../Models/Teacher';
import SRC from '../Models/SRC';

import ITeacher from '../Interfaces/teacher.interface';
import IUser from '../Interfaces/user.interface';
import ISchool from '../Interfaces/school.interface';
import IClass from '../Interfaces/class.interface';

const getClasses = async (teacherId: string, email: string) => {
  const teacher = (await Teacher.findById(teacherId).catch((err: Error) => {
    return { message: err.message };
  })) as unknown as ITeacher;
  if (teacher.email != email) {
    const models = [SRC];
    let emailAccount: any;
    let modelType: any;
    for (let model of models) {
      const possibleAccount = (await model
        .findOne({ email })
        .catch((err: Error) => {
          return { message: err.message };
        })) as IUser;
      if (possibleAccount) {
        emailAccount = possibleAccount;
        modelType = model;
        break;
      }
    }

    switch (modelType) {
      case SRC:
        const school = (await School.findOne({ SRC: emailAccount }).catch(
          (err: Error) => {
            return { message: err.message };
          }
        )) as unknown as ISchool;
        if (teacher.school.toString() != school._id.toString()) {
          return { message: 'Not accessible from your account' };
        }
    }
  }

  const classes = await Class.find({ teacher })
    .select('name code')
    .catch((err: Error) => {
      return err.message;
    });

  if (classes) {
    return { message: 'success', classes };
  } else {
    return { message: 'Classes not found' };
  }
};

const createClass = async (
  name: string,
  code: string,
  teacherId: string,
  email: string
) => {
  const teacher = (await Teacher.findById(teacherId).catch((err: Error) => {
    return { message: err.message };
  })) as unknown as ITeacher;
  if (teacher.email != email) {
    const models = [SRC];
    let emailAccount: any;
    let modelType: any;
    for (let model of models) {
      const possibleAccount = (await model
        .findOne({ email })
        .catch((err: Error) => {
          return { message: err.message };
        })) as IUser;
      if (possibleAccount) {
        emailAccount = possibleAccount;
        modelType = model;
        break;
      }
    }

    switch (modelType) {
      case SRC:
        const school = (await School.findOne({ SRC: emailAccount }).catch(
          (err: Error) => {
            return { message: err.message };
          }
        )) as unknown as ISchool;
        if (teacher.school.toString() != school._id.toString()) {
          return { message: 'Not accessible from your account' };
        }
    }
  }
  if (code != null) {
    const existingClass = await Class.findOne({ code }).catch((err: Error) => {
      return { message: err.message };
    });
    if (existingClass) {
      return { message: 'Class code already exists' };
    }
    const newClass = new Class({ name, code, teacher });
    await newClass.save().catch((err: Error) => {
      return { message: err.message };
    });
    return { message: 'success', id: newClass._id };
  }

  const generateRandomCode = async () => {
    const randomCode = Math.random().toString(36).substring(7);
    const existingClass = await Class.findOne({ code: randomCode }).catch(
      (err: Error) => {
        return { message: err.message };
      }
    );
    if (existingClass) {
      generateRandomCode();
    } else {
      return randomCode;
    }
  };
  const randomCode = await generateRandomCode();
  const newClass = new Class({ name, code: randomCode, teacher });
  try {
    await newClass.save();
    return { message: 'success', newClass: newClass };
  } catch (err) {
    return { message: err.message };
  }
};

const updateClass = async (
  id: string,
  name: string,
  code: string,
  email: string
) => {
  const currentClass = (await Class.findById(id).catch((err: Error) => {
    return { message: err.message };
  })) as unknown as IClass;
  if (!currentClass) {
    return { message: 'Class not found' };
  }
  const teacher = (await Teacher.findById(currentClass.teacher).catch(
    (err: Error) => {
      return { message: err.message };
    }
  )) as unknown as ITeacher;
};

export { getClasses, createClass, updateClass };
