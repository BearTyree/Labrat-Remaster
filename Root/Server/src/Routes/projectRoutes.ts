import { Router } from 'express';
const router = Router();

import { authenticateToken } from '../Controllers/authController';
import { createProject, getProjects } from '../Controllers/projectController';

router.post('/newProject', async (req, res) => {
  let token: string;
  try {
    const authHeader = req.headers['authorization'];
    token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);
  } catch (err) {
    console.log(err);
  }
  let name: string;

  try {
    ({ name } = req.body);
  } catch (err) {
    console.log(err);
  }

  const verified = await authenticateToken(token);

  if (verified.message != 'success') {
    res.status(400).json({ message: verified });
    return;
  }

  const createdProject = await createProject(name, verified.email);

  if (createdProject.message == 'success') {
    res.status(200).json({ message: 'success', id: createdProject.id });
  } else {
    res.status(400).json({ message: createdProject });
  }
});

router.get('/getProjects', async (req, res) => {
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

  const projects = await getProjects(verified.email);

  if (projects.message == 'success') {
    res.status(200).json({ message: 'success', projects: projects.projects });
  } else {
    res.status(400).json({ message: projects });
  }
});
export default router;
