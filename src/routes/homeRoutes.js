const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { protect } = require('../middlewares/authMiddleware');

// Get dashboard
router.get('/dashboard',  homeController.getDashboard);
router.get('/history',  homeController.getHistory);


module.exports = router;
