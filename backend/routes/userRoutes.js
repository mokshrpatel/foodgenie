const express = require('express');
const router = express.Router();
const { updateUserProfile, updateRestaurantStatus } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').put(protect, updateUserProfile);
router.route('/status').put(protect, updateRestaurantStatus);

module.exports = router;
