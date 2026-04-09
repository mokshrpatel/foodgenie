const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getRestaurantOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/restaurant').get(protect, getRestaurantOrders);
router.route('/:id/status').put(protect, updateOrderStatus);

module.exports = router;
