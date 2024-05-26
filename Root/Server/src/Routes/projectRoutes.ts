import { Router } from 'express';
const router = Router();

import { authenticateToken } from '../Controllers/authController';
import {
  createProject,
  getProjects,
  updateProject,
  getProject,
  deleteProject,
} from '../Controllers/projectController';

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

router.post('/updateProject', async (req, res) => {
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
  let description: string;

  try {
    ({ id, name, description } = req.body);
  } catch (err) {
    console.log(err);
  }

  const verified = await authenticateToken(token);

  if (verified.message != 'success') {
    res.status(400).json({ message: verified });
    return;
  }

  const updatedProject = await updateProject(id, name, description);

  if (updatedProject.message == 'success') {
    res.status(200).json({ message: 'success' });
  } else {
    res.status(400).json({ message: updatedProject });
  }
});

router.post('/getProject', async (req, res) => {
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

  const project = await getProject(id, verified.email);

  if (project.message == 'success') {
    res.status(200).json({ message: 'success', project: project.project });
  } else {
    res.status(400).json({ message: project });
  }
});

router.post('/deleteProject', async (req, res) => {
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

  const deletedProject = await deleteProject(id, verified.email);

  if (deletedProject.message == 'success') {
    res.status(200).json({ message: 'success' });
  } else {
    res.status(400).json({ message: deletedProject });
  }
});

export default router;
