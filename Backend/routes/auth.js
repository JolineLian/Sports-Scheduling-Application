import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// Regular login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  // Create a token for the authenticated user
  const token = jwt.sign({ id: user._id, username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

// Register route (no changes needed)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.status(201).json({ message: 'User registered' });
});

// Guest login route
router.post('/guest-login', (req, res) => {
  // Simulate a guest user
  const guestUser = {
    id: 'guest-id',  // You can use a fixed guest ID for all guests
    username: 'Guest',  // Set a generic guest username
    isAdmin: false,  // Guests will not be admins
  };

  // Create a JWT token for the guest user
  const token = jwt.sign(guestUser, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({ token });
});

export default router;
