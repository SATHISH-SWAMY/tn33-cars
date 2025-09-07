import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  const { fullName ,email, phone, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({fullName, email, phone, password: hashedPassword });
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ $or: [{ email: email }] });
  if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret');
  res.json({ token, user });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('getCurrentUser error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

