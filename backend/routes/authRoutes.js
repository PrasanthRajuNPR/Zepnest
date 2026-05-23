const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  loginAdmin,
  logout,
  seedAdmin,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', loginAdmin);
router.post('/admin/seed', seedAdmin);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
