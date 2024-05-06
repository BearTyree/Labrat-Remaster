import jwt from 'jsonwebtoken';
import Student from '../Models/Student';
import Class from '../Models/Class';
import { createHash, randomBytes } from 'crypto';

const checkPassword = async (
  userType: string,
  username: string,
  password: string
) => {
  // set user model based on userType
  let model = null;
  if (userType === 'student') {
    model = Student;
  } else {
    // userType not found
    return 'no such user type';
  }
  // find the user
  const user = await model.findOne({ username }).catch((err: Error) => {
    return err.message;
  });
  // if user not found return
  if (!user) {
    return 'user not found';
  }
  // hash the password and compare
  const hash = createHash('sha256')
    .update(user.password.salt + password)
    .digest('hex');
  if (hash === user.password.hash) {
    return 'success';
  } else {
    return 'wrong password';
  }
};

const generateAccessToken = (userType: string, username: string) => {
  return jwt.sign({ userType, username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1h',
  });
};

const createUser = async (
  userType: string,
  username: string,
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
  // check if user already exists
  const user = await model.findOne({ username }).catch((err: Error) => {
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
    username,
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

export { checkPassword, generateAccessToken, createUser };
