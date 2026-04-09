const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Logged in users)
exports.addOrderItems = async (req, res) => {
  try {
    const { orderItems, restaurantId, totalAmount } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        customer: req.user._id,
        restaurant: restaurantId,
        items: orderItems,
        totalAmount
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error placing order' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('restaurant', 'name imageUrl')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

// @desc    Get all orders for a specific restaurant owner
// @route   GET /api/orders/restaurant
// @access  Private (Owner)
exports.getRestaurantOrders = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.user._id })
      .populate('customer', 'name email phone')
      .populate('items.menuItem', 'name price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({ message: 'Server error fetching restaurant orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Owner)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      // Ensure the logged in user is the owner of the restaurant OR the customer for this order
      if (
        order.restaurant.toString() !== req.user._id.toString() && 
        order.customer.toString() !== req.user._id.toString() && 
        req.user.role !== 'ADMIN'
      ) {
        return res.status(401).json({ message: 'Not authorized to update this order' });
      }

      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};
