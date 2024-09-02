const express = require('express');
const router = express.Router();
const waterLogController = require('../controllers/waterLogController');
const { protect } = require('../middlewares/authMiddleware');

// Create a new water log entry
router.post('/waterlogs', protect, waterLogController.createWaterLog);

// Update an existing water log entry
router.put('/waterlogs/:logId', protect, waterLogController.updateWaterLogStatus);

// Get water logs by date range
router.get('/waterlogs', protect, waterLogController.getWaterLogsByDate);

module.exports = router;
