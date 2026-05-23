const express = require('express');
const router = express.Router();
const { createRequest, getMyRequests, deleteRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const { userOnly } = require('../middleware/roleMiddleware');
const { upload } = require('../config/cloudinary');

router.use(protect, userOnly);

router.get('/my', getMyRequests);
router.post('/', upload.single('image'), createRequest);
router.delete('/:id', deleteRequest);

module.exports = router;
