// const express = require('express');
// const cartController = require('../controllers/cartController');
// const authMiddleware = require('../middleware/auth');

// const router = express.Router();

// router.post('/add', authMiddleware, cartController.addToCart);
// router.get('/', authMiddleware, cartController.getCart);
// router.put('/update', authMiddleware, cartController.updateCartItem);
// router.delete('/remove', authMiddleware, cartController.removeFromCart);
// router.delete('/clear', authMiddleware, cartController.clearCart);

// module.exports = router;


const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
router.post('/add', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.put('/update', authMiddleware, cartController.updateCartItem);
router.delete('/remove', authMiddleware, cartController.removeFromCart);
router.delete('/clear', authMiddleware, cartController.clearCart);
module.exports = router;
