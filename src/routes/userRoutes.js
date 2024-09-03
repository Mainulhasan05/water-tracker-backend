const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Update user information
router.put('/users/:id', protect, admin, userController.updateUser);
router.get('/user/waterlogs', protect, userController.getOwnWaterLogs);

module.exports = router;
