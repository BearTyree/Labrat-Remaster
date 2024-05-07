import jwt from 'jsonwebtoken';
import Student from '../Models/Student';
import Class from '../Models/Class';
import SRC from '../Models/SRC';
import Admin from '../Models/Admin';
import { createHash, randomBytes } from 'crypto';

const checkPassword = async (email: string, password: string) => {
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

  // hash the password and compare
  const hash = createHash('sha256')
    .update(user.password.salt + password)
    .digest('hex');
  if (hash == user.password.hash) {
    return 'success';
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
      console.log(userType);
      return 'no such user type';
  }

  // check if user already exists
  const user = await model.findOne({ email }).catch((err: Error) => {
    return err.message;
  });
  if (user) {
    return 'user already exists';
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
    class: classModel,
  });

  // save user to database
  try {
    await newUser.save();
    // return success message
    return 'success';
  } catch (err) {
    // return error message
    return err.message.split(':').slice(-1)[0].trim();
  }
};

export { checkPassword, generateAccessToken, createUser, getUserType };
