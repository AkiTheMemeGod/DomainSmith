import { Router } from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

const router = Router();

router.post(
  '/register',
  [body('email').isEmail(), body('password').isLength({ min: 6 }), body('name').optional().isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password, name } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, name });
    const token = generateToken({ id: user._id.toString() });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  }
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isString()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = generateToken({ id: user._id.toString() });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  }
);

export default router;