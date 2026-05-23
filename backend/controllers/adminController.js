const RequestModel = require('../models/requestModel');
const UserModel = require('../models/userModel');

const VALID_STATUSES = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

// @desc  Get all requests (with optional status filter)
// @route GET /api/admin/requests
const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status filter' });
    }
    const requests = await RequestModel.getAll(status || null);
    res.json({ requests });
  } catch (err) {
    console.error('Admin get requests error:', err);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
};

// @desc  Update request status
// @route PATCH /api/admin/requests/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const request = await RequestModel.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    await RequestModel.updateStatus(req.params.id, status);
    res.json({ message: 'Status updated successfully', status });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

// @desc  Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAll();
    res.json({ users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// @desc  Get requests for a specific user
// @route GET /api/admin/users/:userId/requests
const getUserRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const user = await UserModel.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const requests = await RequestModel.getByUserIdForAdmin(
      req.params.userId,
      status || null
    );
    res.json({ user, requests });
  } catch (err) {
    console.error('Get user requests error:', err);
    res.status(500).json({ message: 'Server error while fetching user requests' });
  }
};

module.exports = { getAllRequests, updateStatus, getAllUsers, getUserRequests };
