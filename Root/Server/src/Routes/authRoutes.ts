import { Router } from 'express';
import {
  checkPassword,
  generateAccessToken,
  createUser,
  getUserType,
} from '../Controllers/authController';
import { get } from 'config';

const router = Router();

router.post('/login', async (req, res) => {
  // get userType, username, and password from request body
  let email: string, password: string;
  try {
    ({ email, password } = req.body);
  } catch (err) {
    console.log(err);
  }
  // check to make sure password is valid
  const passwordResult: unknown = await checkPassword(email, password);

  if ((passwordResult as string) == 'success') {
    // if password is valid, generate access token and send it
    res.status(200).json({
      token: await generateAccessToken(email),
      userType: await getUserType(email),
    });
  } else {
    // if password is invalid, send error message
    res.status(401).json({ message: passwordResult });
  }
});

router.post('/signup', async (req, res) => {
  let userType: string,
    name: string,
    password: string,
    email: string,
    classCode: string;
  try {
    ({ userType, name, password, email, classCode } = req.body);
  } catch (err) {
    console.log(err);
  }

  // create user in database
  const userResult: unknown = await createUser(
    userType,
    name,
    password,
    email,
    classCode
  );
  if ((userResult as string) == 'success') {
    res.status(200).json({ token: generateAccessToken(email) });
  } else {
    res.status(400).json({ message: userResult });
  }
});

export default router;
