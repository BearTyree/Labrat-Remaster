import { Router } from 'express';
import {
  checkPassword,
  generateAccessToken,
  createUser,
  getUserType,
  checkVerified,
  authenticateToken,
  verifyEmail,
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

router.post('/checkVerified', async (req, res) => {
  let email: string;
  try {
    ({ email } = req.body);
  } catch (err) {
    console.log(err);
  }

  const verified = await checkVerified(email);

  if (verified == 'success') {
    res.status(200).json({ message: 'success' });
  } else {
    res.status(400).json({ message: verified });
  }
});

router.post('/authenticateToken', async (req, res) => {
  let token: string;
  try {
    ({ token } = req.body);
  } catch (err) {
    console.log(err);
  }

  const verified = await authenticateToken(token);

  if (verified == 'success') {
    res.status(200).json({ message: 'success' });
  } else {
    res.status(400).json({ message: verified });
  }
});

router.post('/verify', async (req, res) => {
  let emailVerificationCode: string;
  let email: string;
  try {
    ({ emailVerificationCode, email } = req.body);
  } catch (err) {
    console.log(err);
  }

  const verified = await verifyEmail(email, emailVerificationCode);

  if (verified == 'success') {
    res.status(200).json({ message: 'success' });
  } else {
    res.status(400).json({ message: verified });
  }
});

export default router;
