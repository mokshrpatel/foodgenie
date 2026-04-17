const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const owners = await User.find({ role: 'OWNER' });
    console.log('All Owners:', owners);
    const activeOwners = await User.find({ role: 'OWNER', isActive: true });
    console.log('Active Owners:', activeOwners);
    mongoose.disconnect();
  })
  .catch(err => console.error(err));
