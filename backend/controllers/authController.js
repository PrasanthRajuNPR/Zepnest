const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const { pool } = require('../config/db');
const generateToken = require('../utils/generateToken');

// @desc  Register user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await UserModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = await UserModel.create({ name, email, password: hashedPassword });

    generateToken(res, { id: userId, role: 'user' });

    res.status(201).json({
      message: 'Registration successful',
      user: { id: userId, name, email },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc  Login user
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    generateToken(res, { id: user.id, role: 'user' });

    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc  Login admin
// @route POST /api/auth/admin/login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    const admin = rows[0];

    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    generateToken(res, { id: admin.id, role: 'admin' });

    res.json({
      message: 'Admin login successful',
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};

// @desc  Logout (clear cookie)
// @route POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  res.json({ message: 'Logged out successfully' });
};

// @desc  Seed default admin (development only)
// @route POST /api/auth/admin/seed
const seedAdmin = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Not available in production' });
  }
  try {
    const { name, email, password } = req.body;
    const [existing] = await pool.query('SELECT id FROM admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Admin already exists' });
    }
    const hashed = await bcrypt.hash(password, 12);
    await pool.query('INSERT INTO admins (name, email, password) VALUES (?, ?, ?)', [
      name, email, hashed,
    ]);
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating admin', error: err.message });
  }
};

// @desc  Get current user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const [rows] = await pool.query(
        'SELECT id, name, email FROM admins WHERE id = ?',
        [req.user.id]
      );
      return res.json({ user: { ...rows[0], role: 'admin' } });
    }
    const user = await UserModel.findById(req.user.id);
    res.json({ user: { ...user, role: 'user' } });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

module.exports = { registerUser, loginUser, loginAdmin, logout, seedAdmin, getMe };
