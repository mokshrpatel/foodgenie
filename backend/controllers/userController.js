const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.imageUrl = req.body.imageUrl || user.imageUrl;
      if (req.body.phone !== undefined) user.phone = req.body.phone;
      if (req.body.address !== undefined) user.address = req.body.address;
      // You can add more fields here if desired

      // Update categories if array provided
      if (req.body.categories) {
        user.categories = req.body.categories;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        imageUrl: updatedUser.imageUrl,
        phone: updatedUser.phone,
        address: updatedUser.address,
        categories: updatedUser.categories
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error updating user profile' });
  }
};
