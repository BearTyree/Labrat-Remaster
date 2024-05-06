import { Router } from 'express';
import {
  checkPassword,
  generateAccessToken,
  createUser,
} from '../Controllers/authController';

const router = Router();

router.post('/login', async (req, res) => {
  // get userType, username, and password from request body
  let userType: string, username: string, password: string;
  try {
    ({ userType, username, password } = req.body);
  } catch (err) {
    console.log(err);
  }
  // check to make sure password is valid
  const passwordResult: unknown = await checkPassword(
    userType,
    username,
    password
  );
  if ((passwordResult as string) == 'success') {
    // if password is valid, generate access token and send it
    res.status(200).json({ token: generateAccessToken(userType, username) });
  } else {
    // if password is invalid, send error message
    res.status(401).json({ message: passwordResult });
  }
});

router.post('/signup', async (req, res) => {
  let userType: string,
    username: string,
    password: string,
    email: string,
    classCode: string;
  try {
    ({ userType, username, password, email, classCode } = req.body);
  } catch (err) {
    console.log(err);
  }

  // create user in database
  const userResult: unknown = await createUser(
    userType,
    username,
    password,
    email,
    classCode
  );
  if ((userResult as string) == 'success') {
    res.status(200).json({ token: generateAccessToken(userType, username) });
  } else {
    res.status(400).json({ message: userResult });
  }
});

export default router;
