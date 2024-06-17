import { Router } from 'express';
const router = Router();

import { authenticateToken } from '../Controllers/authController';
import { getSRC, getSchool } from '../Controllers/srcController';

router.post('/getSRC', async (req, res) => {
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

  const src = await getSRC(verified.email);
  const school = await getSchool(verified.email);

  if (src.message == 'success' && school.message == 'success') {
    res
      .status(200)
      .json({ message: 'success', src: src.src, school: school.school });
  } else {
    res.status(400).json({ message: 'error' });
  }
});

export default router;
