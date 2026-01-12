


const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
router.post('/create', authMiddleware, orderController.createOrder);
router.post('/payment', authMiddleware, orderController.processPayment);
router.get('/retailer', authMiddleware, orderController.getRetailerOrders);
router.get('/by-period', authMiddleware, orderController.getSalesByPeriod);
router.get('/:id', authMiddleware, orderController.getOrder);
module.exports = router;
