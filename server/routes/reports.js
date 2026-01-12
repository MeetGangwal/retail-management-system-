


const express = require('express');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
router.get('/analytics', authMiddleware, reportController.getSalesAnalytics);
module.exports = router;
