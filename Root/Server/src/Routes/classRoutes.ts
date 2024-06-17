import { Router } from 'express';
import { authenticateToken } from '../Controllers/authController';
import { getClasses, createClass } from '../Controllers/classController';
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

export default router;
