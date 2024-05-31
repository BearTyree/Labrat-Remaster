// mongoose schemas
import Student from '../Models/Student';
import Class from '../Models/Class';
import SRC from '../Models/SRC';
import Admin from '../Models/Admin';
import Teacher from '../Models/Teacher';

// authentication and cryptography
import { createHash, randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';

// config file
import config from 'config';
const appConfig = config;

// types
import IUser from '../Interfaces/user.interface';

const checkPassword = async (email: string, password: string) => {
  // all possible user types
  let models = [Student, SRC, Admin, Teacher];
  let user = null;
  // check all user types for user
  for (let modelType of models) {
    let possibleUsers = (await modelType.find({ email }).catch((err: Error) => {
      return err.message;
    })) as IUser[];

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

export {
  checkPassword,
  generateAccessToken,
  createUser,
  getUserType,
  checkVerified,
  authenticateToken,
  verifyEmail,
  setPassword,
};
