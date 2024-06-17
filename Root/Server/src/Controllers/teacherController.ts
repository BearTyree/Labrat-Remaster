// mongoose schemas
import Student from '../Models/Student';
import SRC from '../Models/SRC';
import Admin from '../Models/Admin';
import School from '../Models/School';
import Teacher from '../Models/Teacher';

// config file
import config from 'config';
const appConfig = config;

// types
import IUser from '../Interfaces/user.interface';
import ITeacher from '../Interfaces/teacher.interface';

// cryptography
import { createHash, randomBytes } from 'crypto';

const createTeacher = async (name: string, email: string) => {
  const schoolSRC = (await SRC.findOne({ email }).catch((err: Error) => {
    return err.message;
  })) as IUser;
  const teacherSchool = await School.findOne({ schoolSRC }).catch(
    (err: Error) => {
      return err.message;
    }
  );
  const starterPassword = appConfig.get('defaultStarterPassword');
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(salt + starterPassword)
    .digest('hex');
  if (email != 'New Teacher') {
    const modelTypes = [Student, SRC, Admin, Teacher];
    for await (let modelType of modelTypes) {
      const possibleUser = await modelType
        .findOne({ email })
        .catch((err: Error) => {
          return err.message;
        });
      if (possibleUser) {
        return { message: 'email already exists' };
      }
    }
  }
  let newTeacher = new Teacher({
    name: name,
    email: email,
    password: {
      salt,
      hash,
    },
    emailVerificationCode: randomBytes(16).toString('hex'),
    hasSetPassword: false,
    school: teacherSchool,
  });

  try {
    await newTeacher.save();
    return { message: 'success', id: newTeacher.id };
  } catch (err) {
    return err;
  }
};

const getTeachers = async (email: string) => {
  const schoolSRC = (await SRC.findOne({ email }).catch((err: Error) => {
    return err.message;
  })) as IUser;
  const teacherSchool: any = await School.findOne({ SRC: schoolSRC }).catch(
    (err: Error) => {
      return err.message;
    }
  );

  const teachers = await Teacher.find({
    school: teacherSchool,
  }).catch((err: Error) => {
    return { message: err.message };
  });

  return { message: 'success', teachers };
};

const updateTeacher = async (id: string, name: string, email: string) => {
  try {
    const schoolSRC = (await SRC.findOne({ email }).catch((err: Error) => {
      return err.message;
    })) as IUser;
    const teacherSchool: any = await School.findOne({ schoolSRC }).catch(
      (err: Error) => {
        return err.message;
      }
    );
    let teacher = (await Teacher.findById(id).catch((err: Error) => {
      return err.message;
    })) as unknown as ITeacher;
    if (
      (teacher.school.toString() as unknown) == teacherSchool._id.toString()
    ) {
      try {
        const modelTypes = [Student, SRC, Admin, Teacher];
        let alreadyExists = false;
        for await (let modelType of modelTypes) {
          let possibleUser = (await modelType
            .findOne({ email, _id: { $ne: id } })
            .catch((err: Error) => {
              return err.message;
            })) as IUser;
          if (possibleUser) {
            alreadyExists = true;
            break;
          }
        }
        if (alreadyExists) {
          return { message: 'email already exists' };
        }
        const emailVerificationCode = randomBytes(16).toString('hex');
        await Teacher.findByIdAndUpdate(
          id,
          { name, email, emailVerificationCode },
          { returnOriginal: false }
        );

        await Teacher.deleteMany({
          email,
          emailVerificationCode: { $ne: emailVerificationCode },
        });
        return { message: 'success' };
      } catch (err) {
        return { message: err.message };
      }
    } else {
      return { message: 'you cannot access that teacher' };
    }
  } catch (err) {
    return { message: err.message };
  }
};

const getTeacher = async (id: string, email: string) => {
  try {
    const schoolSRC = (await SRC.findOne({ email }).catch((err: Error) => {
      return err.message;
    })) as IUser;
    const teacherSchool: any = await School.findOne({ SRC: schoolSRC }).catch(
      (err: Error) => {
        return err.message;
      }
    );
    let teacher = (await Teacher.findById(id).catch((err: Error) => {
      return err.message;
    })) as unknown as ITeacher;

    if (teacher) {
      if (
        (teacher.school.toString() as unknown) == teacherSchool._id.toString()
      ) {
        return { message: 'success', teacher };
      } else {
        throw new Error('Not accessible from your account');
      }
    } else {
      throw new Error('Teacher not found');
    }
  } catch (err) {
    console.log(err);
    return { message: err.message };
  }
};

const deleteTeacher = async (id: string, email: string) => {
  try {
    const schoolSRC = (await SRC.findOne({ email }).catch((err: Error) => {
      return err.message;
    })) as IUser;
    const teacherSchool: any = await School.findOne({ SRC: schoolSRC }).catch(
      (err: Error) => {
        return err.message;
      }
    );
    let teacher = (await Teacher.findById(id).catch((err: Error) => {
      return err.message;
    })) as unknown as ITeacher;

    if (teacher) {
      if (
        (teacher.school.toString() as unknown) == teacherSchool._id.toString()
      ) {
        await Teacher.findByIdAndDelete(id).catch((err: Error) => {
          return err.message;
        });
        return { message: 'success', teacher };
      } else {
        throw new Error('Not accessible from your account');
      }
    } else {
      throw new Error('Teacher not found');
    }
  } catch (err) {
    return { message: err.message };
  }
};

export { createTeacher, getTeachers, updateTeacher, getTeacher, deleteTeacher };
