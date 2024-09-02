const WaterLog = require('../models/WaterLog');

// Create a water log entry
exports.createWaterLog = async (req, res, next) => {
  try {
    const { numberOfJugs } = req.body;

    const waterLog = new WaterLog({
      user: req.user._id,
      numberOfJugs,
    });

    await waterLog.save();

    res.status(201).json(waterLog);
  } catch (err) {
    next(err);
  }
};

// Update a water log entry
exports.updateWaterLogStatus = async (req, res, next) => {
  try {
    const { logId } = req.params;
    const { numberOfJugs } = req.body;

    const waterLog = await WaterLog.findById(logId);

    if (!waterLog) {
      return res.status(404).json({ message: 'Water log not found' });
    }

    // Check if the user is admin or the owner of the log
    if (req.user.role !== 'admin' && waterLog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this log' });
    }

    waterLog.numberOfJugs = numberOfJugs || waterLog.numberOfJugs;
    await waterLog.save();

    res.status(200).json(waterLog);
  } catch (err) {
    next(err);
  }
};

// Get water logs within a date range
exports.getWaterLogsByDate = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const logs = await WaterLog.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate('user', 'name');

    res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
};
