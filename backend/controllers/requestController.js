const RequestModel = require('../models/requestModel');

// @desc  Create service request
// @route POST /api/requests
const createRequest = async (req, res) => {
  try {
    const { title, description, category, address, preferred_time } = req.body;

    if (!title || !description || !category || !address || !preferred_time) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const image_url = req.file ? req.file.path : null;

    const id = await RequestModel.create({
      user_id: req.user.id,
      title,
      description,
      category,
      address,
      preferred_time,
      image_url,
    });

    const created = await RequestModel.findById(id);
    res.status(201).json({ message: 'Request created successfully', request: created });
  } catch (err) {
    console.error('Create request error:', err);
    res.status(500).json({ message: 'Server error while creating request' });
  }
};

// @desc  Get my requests
// @route GET /api/requests/my
const getMyRequests = async (req, res) => {
  try {
    const requests = await RequestModel.findByUserId(req.user.id);
    res.json({ requests });
  } catch (err) {
    console.error('Get requests error:', err);
    res.status(500).json({ message: 'Server error while fetching requests' });
  }
};

// @desc  Delete own request
// @route DELETE /api/requests/:id
const deleteRequest = async (req, res) => {
  try {
    const request = await RequestModel.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }

    await RequestModel.deleteById(req.params.id);
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error('Delete request error:', err);
    res.status(500).json({ message: 'Server error while deleting request' });
  }
};

module.exports = { createRequest, getMyRequests, deleteRequest };
