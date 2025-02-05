import express from 'express';
import {
  register,
  login,
  refreshToken,
  logout
} from '../controllers/authController';
// import { verifyJWT } from '../middlewares/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', (req, res) => {
  res.json({ user: req.user });
});

export default router;
