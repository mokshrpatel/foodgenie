const MenuItem = require('../models/MenuItem');

// @desc    Get menu items for the logged in owner
// @route   GET /api/menu
// @access  Private (OWNER)
exports.getMenuItems = async (req, res) => {
  try {
    const filter = { ownerId: req.user._id };
    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ message: 'Server error fetching menu items' });
  }
};

// @desc    Create a new menu item
// @route   POST /api/menu
// @access  Private (OWNER)
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, imageUrl, isFamous } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({ message: 'Please provide name, description, and price' });
    }

    const item = await MenuItem.create({
      name,
      description,
      price,
      imageUrl,
      isFamous,
      ownerId: req.user._id
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ message: 'Server error creating menu item' });
  }
};

// @desc    Update a menu item
// @route   PUT /api/menu/:id
// @access  Private (OWNER)
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Verify ownership
    if (item.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ message: 'Server error updating menu item' });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
// @access  Private (OWNER)
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Verify ownership
    if (item.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Server error deleting menu item' });
  }
};
