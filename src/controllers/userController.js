const User = require('../models/User');
const WaterLog=require('../models/WaterLog');
// Update user information
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.role !== 'admin' && req.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this user' });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    await user.save();

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};


// req.user._id , get own history of water logs with proper pagination
exports.getOwnWaterLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const waterLogs = await WaterLog.find({ user: req.user._id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user');

    const count = await WaterLog.countDocuments({ user: req.user._id });

    res.status(200).json({
      waterLogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
};
