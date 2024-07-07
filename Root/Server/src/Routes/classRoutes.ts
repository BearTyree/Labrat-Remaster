import { Router } from 'express';
import { authenticateToken } from '../Controllers/authController';
import {
  getClasses,
  createClass,
  updateClass,
} from '../Controllers/classController';
const router = Router();

router.post('/getClasses', async (req, res) => {
  let token: string;
  try {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);
  } catch (err) {
    console.log(err);
  }

  const verified = await authenticateToken(token);

  if (verified.message != 'success') {
    res.status(400).json({ message: verified });
    return;
  }

  let teacherId: string;
  try {
    ({ teacherId } = req.body);
  } catch (err) {
    console.log(err);
  }

  const classes = await getClasses(teacherId, verified.email);

  if (classes.message == 'success') {
    res.status(200).json({ message: 'success', classes: classes.classes });
  } else {
    res.status(400).json({ message: classes });
  }
});

router.post('/newClass', async (req, res) => {
  let token: string;
  try {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);
  } catch (err) {
    console.log(err);
  }

  const verified = await authenticateToken(token);

  if (verified.message != 'success') {
    res.status(400).json({ message: verified });
  }

  let teacherId: string;
  let name: string;
  let code: string;

  try {
    ({ teacherId, name, code } = req.body);
  } catch (err) {
    console.log(err);
  }

  const newClass = await createClass(name, code, teacherId, verified.email);

  if (newClass.message == 'success') {
    res.status(200).json({ message: 'success', newClass: newClass.newClass });
  } else {
    res.status(400).json({ message: newClass });
  }
});

router.post('/updateClass', async (req, res) => {
  let token: string;
  try {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);
  } catch (err) {
    console.log(err);
  }

  const verified = await authenticateToken(token);

  if (verified.message != 'success') {
    res.status(400).json({ message: verified });
  }

  let id: string;
  let name: string;
  let code: string;

  try {
    ({ id, name, code } = req.body);
  } catch (err) {
    console.log(err);
  }

  const updatedClass = await updateClass(id, name, code, verified.email);

  try {
    if (updatedClass.message == 'success') {
      res.status(200).json({ message: 'success' });
    } else {
      res.status(400).json({ message: updatedClass });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
});

export default router;
