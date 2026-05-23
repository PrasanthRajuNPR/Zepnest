const express = require('express');
const router = express.Router();
const {
  getAllRequests,
  updateStatus,
  getAllUsers,
  getUserRequests,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/roleMiddleware');

router.use(protect, adminOnly);

router.get('/requests', getAllRequests);
router.patch('/requests/:id/status', updateStatus);
router.get('/users', getAllUsers);
router.get('/users/:userId/requests', getUserRequests);

module.exports = router;
