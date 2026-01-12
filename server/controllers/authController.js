const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, storeName, phone, address } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: '❌ User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      storeName,
      phone,
      address,
      role: 'retailer',
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: '✅ Signup successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email, storeName: user.storeName },
    });

  } catch (err) {
    res.status(500).json({ message: '❌ Signup failed', error: err.message });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: '❌ Invalid credentials' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ message: '❌ Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: '✅ Login successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email, storeName: user.storeName },
    });

  } catch (err) {
    res.status(500).json({ message: '❌ Login failed', error: err.message });
  }
};
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;   // comes from authMiddleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: '❌ Failed to get user', error: err.message });
  }
};

