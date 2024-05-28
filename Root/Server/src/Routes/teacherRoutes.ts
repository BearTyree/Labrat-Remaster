import { Router } from 'express';
const router = Router();

import { authenticateToken } from '../Controllers/authController';
import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  getTeachers,
  updateTeacher,
} from '../Controllers/teacherController';

router.post('/newTeacher', async (req, res) => {
  let name: string;
  let email: string;
  try {
    ({ name, email } = req.body);
  } catch (err) {
    return err;
  }

  const newTeacher = await createTeacher(name, email);

  if (newTeacher.message == 'success') {
    res.status(200).json({ message: 'success', id: newTeacher.id });
  } else {
    res.status(400).json(newTeacher);
  }
});

router.get('/getTeachers', async (req, res) => {
  let token: string;
  try {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
  } catch (err) {
    console.log(err);
  }

  let verified = await authenticateToken(token);

  if (verified.message != 'success') {
    res.status(400).json({ message: verified });
    return;
  }

  let teachers = await getTeachers(verified.email);

  if (teachers.message == 'success') {
    res.status(200).json({ message: 'success', teachers: teachers.teachers });
  } else {
    res.status(400).json(teachers);
  }
});

router.post('/updateTeacher', async (req, res) => {
  let token: string;
  try {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
  } catch (err) {
    console.log(err);
  }

  let id: string;
  let name: string;
  let email: string;

  try {
    ({ id, name, email } = req.body);
  } catch (err) {
    console.log(err);
  }

  let verified = await authenticateToken(token);

  if (verified.message != 'success') {
    res.status(400).json({ message: verified });
    return;
  }

  const updatedTeacher = await updateTeacher(id, name, email);

  if (updatedTeacher.message == 'success') {
    res.status(200).json({ message: 'success' });
  } else {
    res.status(400).json({ message: updatedTeacher.message });
  }
});

router.post('/getTeacher', async (req, res) => {
  let token: string;
  try {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);
  } catch (err) {
    console.log(err);
  }

  let id: string;

  try {
    ({ id } = req.body);
  } catch (err) {
    console.log(err);
  }

  const verified = await authenticateToken(token);

  if (verified.message != 'success') {
    res.status(400).json({ message: verified });
    return;
  }

  const teacher = await getTeacher(id, verified.email);

  if (teacher.message == 'success') {
    res.status(200).json({ message: 'success', teacher: teacher.teacher });
  } else {
    res.status(400).json({ message: teacher });
  }
});

router.post('/deleteTeacher', async (req, res) => {
  let token: string;
  try {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
  } catch (err) {
    console.log(err);
  }

  let id: string;

  try {
    ({ id } = req.body);
  } catch (err) {
    console.log(err);
  }

  const verified = await authenticateToken(token);

  if (verified.message != 'success') {
    res.status(400).json({ message: verified });
    return;
  }

  const deletedTeacher = await deleteTeacher(id, verified.email);

  if (deletedTeacher.message == 'success') {
    res.status(200).json({ message: 'success' });
  } else {
    res.status(400).json({ message: deletedTeacher });
  }
});
export default router;
