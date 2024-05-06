import { Router } from 'express';
import { checkPassword } from '../Controllers/authController';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
});

export default router;
