import jwt from 'jsonwebtoken';
import Student from '../Models/Student';
import Class from '../Models/Class';
import SRC from '../Models/SRC';
import Admin from '../Models/Admin';
import { createHash, randomBytes } from 'crypto';
import Teacher from '../Models/Teacher';
import { Types } from 'mongoose';
import config from 'config';
import School from '../Models/School';

const appConfig = config;

interface IUser {
  name: string;
  password: {
    salt: string;
    hash: string;
  };
  email: string;
  isEmailVerified: boolean;
}

const checkPassword = async (email: string, password: string) => {
  // all possible user types

  let models = [Student, SRC, Admin];
  let user = null;
  // check all user types for user
  for (let modelType of models) {
    let possibleUsers = (await modelType.find({ email }).catch((err: Error) => {
      return err.message;
    })) as IUser[]; // Cast possibleUser as IUser

    for (let possibleUser of possibleUsers) {
      if (possibleUser) {
        user = possibleUser;
        break;
      }
    }
  }

  // if user not found return
  if (!user) {
    return 'user not found';
  }

  // hash the password and compare
  const hash = createHash('sha256')
    .update(user.password.salt + password)
    .digest('hex');
  if (hash == user.password.hash) {
    if (user.isEmailVerified == true) {
      return 'success';
    } else {
      return 'not verified';
    }
  } else {
    return 'wrong password';
  }
};

const getUserType = async (email: string) => {
  // all possible user types
  let models = [Student, SRC, Admin];
  let user = null;
  // check all user types for user
  for (let modelType of models) {
    let possibleUser = await modelType
      .findOne({ email })
      .catch((err: Error) => {
        return err.message;
      });
    if (possibleUser) {
      user = possibleUser;
      break;
    }
  }

  // if user not found return
  if (!user) {
    return 'user not found';
  }

  // return user type
  return user.constructor.modelName;
};

const generateAccessToken = (email: string) => {
  return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
};

const createUser = async (
  userType: string,
  name: string,
  password: string,
  email: string,
  classCode: string
) => {
  // set user model based on userType
  let model = null;
  switch (userType) {
    case 'student':
      model = Student;
      break;
    default:
      return 'no such user type';
  }

  const classModel = await Class.findOne({ code: classCode }).catch(
    (err: Error) => {
      console.log(err);
      return err.message;
    }
  );
  // create new user
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(salt + password)
    .digest('hex');
  const newUser = new model({
    name,
    password: { salt, hash },
    email,
    emailVerificationCode: randomBytes(16).toString('hex'),
    class: classModel,
  });

  // save user to database
  try {
    await newUser.save();
    // return success message
    return 'success';
  } catch (err) {
    // return error message
    return err.message;
  }
};

const checkVerified = async (email: string) => {
  let models = [Student, SRC, Admin];
  let user = null;
  // check all user types for user
  for (let modelType of models) {
    // get list of users with email
    let possibleUsers = (await modelType.find({ email }).catch((err: Error) => {
      return err.message;
    })) as IUser[]; // Cast possibleUser as IUser

    // check if user is verified
    for (let possibleUser of possibleUsers) {
      if (possibleUser.isEmailVerified == true) {
        user = possibleUser;
        break;
      }
    }

    // if user is verified return
    if (user) {
      return 'success';
    }
  }
};

const authenticateToken = async (token: string) => {
  try {
    const authenticatedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    if (authenticatedToken) {
      // check if user is verified
      const verified = await checkVerified(authenticatedToken.email);
      if (verified != 'success') {
        return {
          message: 'email not verified',
          email: authenticatedToken.email,
        };
      }
      return { message: 'success', email: authenticatedToken.email };
    } else {
      return { message: 'token not valid' };
    }
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

const verifyEmail = async (email: string, emailVerificationCode: string) => {
  // find user with emailVerificationCode
  let models = [Student, SRC, Admin];
  let user = null;
  for await (let modelType of models) {
    let possibleUser: IUser;
    switch (modelType) {
      case Student:
        possibleUser = (await modelType
          .findOneAndUpdate(
            { emailVerificationCode, email, isEmailVerified: false },
            { isEmailVerified: true },
            { returnOriginal: false }
          )
          .catch((err: Error) => {
            return err.message;
          })) as IUser;
        break;
      case SRC:
        possibleUser = (await modelType.findOne({
          emailVerificationCode,
          email,
          isEmailVerified: false,
        })) as IUser;
    }

    if (possibleUser) {
      user = possibleUser;
      break;
    }
  }
  if (!user) {
    console.log('user not found');
    return 'user not found';
  }

  if (user.isEmailVerified == false) {
    console.log('choose password');
    return 'choose password';
  } else {
    for (let modelType of models) {
      const possibleUsers = await modelType
        .deleteMany({ email, isEmailVerified: false })
        .catch((err: Error) => {
          return err.message;
        });
    }
    return 'success';
  }
};

const setPassword = async (email: string, password: string) => {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(salt + password)
    .digest('hex');
  const models = [SRC, Admin];
  let user: IUser;
  for await (let modelType of models) {
    let possibleUser = await modelType
      .findOneAndUpdate(
        { email, isEmailVerified: false },
        {
          password: { salt, hash },
          isEmailVerified: true,
          hasSetPassword: true,
        },
        { returnOriginal: false }
      )
      .catch((err: Error) => {
        return err.message;
      });

    if (possibleUser) {
      user = possibleUser as IUser;
      break;
    }
  }

  if (!user) {
    return 'user not found';
  }

  return 'success';
};

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
  const teacherSchool = await School.findOne({ schoolSRC }).catch(
    (err: Error) => {
      return err.message;
    }
  );
  const teachers = await Teacher.find({ school: teacherSchool }).catch(
    (err: Error) => {
      return { message: err.message };
    }
  );

  return { message: 'success', teachers };
};
interface ITeacher extends Document {
  name: string;
  password: {
    salt?: string;
    hash?: string;
  };
  email: string;
  isEmailVerified: boolean;
  emailVerificationCode: string;
  hasSetPassword: boolean;
  classes: Types.ObjectId[];
  school?: Types.ObjectId;
}
const updateTeacher = async (id: string, name: string, email: string) => {
  try {
    const schoolSRC = (await SRC.findOne({ email }).catch((err: Error) => {
      return err.message;
    })) as IUser;
    const teacherSchool = await School.findOne({ schoolSRC }).catch(
      (err: Error) => {
        return err.message;
      }
    );
    let teacher = (await Teacher.findById(id).catch((err: Error) => {
      return err.message;
    })) as unknown as ITeacher;
    if ((teacher.school as unknown) == teacherSchool) {
      try {
        const alreadyExists = await Teacher.findOne({
          email,
          _id: { $ne: id },
        });
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
    const teacherSchool = await School.findOne({ schoolSRC }).catch(
      (err: Error) => {
        return err.message;
      }
    );
    let teacher = (await Teacher.findById(id).catch((err: Error) => {
      return err.message;
    })) as unknown as ITeacher;

    if (teacher) {
      if ((teacher.school as unknown) == teacherSchool) {
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

const deleteTeacher = async (id: string, email: string) => {
  try {
    const schoolSRC = (await SRC.findOne({ email }).catch((err: Error) => {
      return err.message;
    })) as IUser;
    const teacherSchool = await School.findOne({ schoolSRC }).catch(
      (err: Error) => {
        return err.message;
      }
    );
    let teacher = (await Teacher.findById(id).catch((err: Error) => {
      return err.message;
    })) as unknown as ITeacher;

    if (teacher) {
      if ((teacher.school as unknown) == teacherSchool) {
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

export {
  checkPassword,
  generateAccessToken,
  createUser,
  getUserType,
  checkVerified,
  authenticateToken,
  verifyEmail,
  setPassword,
  createTeacher,
  getTeachers,
  updateTeacher,
  getTeacher,
  deleteTeacher,
};
