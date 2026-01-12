

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
exports.createOrder = async (req, res) => {
  try {
    const retailerId = req.userId;
    const cart = await Cart.findOne({ retailerId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: '❌ Cart is empty' });
    }

    const orderId = `ORD-${Date.now()}`;

    const order = new Order({
      orderId,
      retailerId,
      items: cart.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      })),
      totalAmount: cart.totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await order.save();

    res.status(201).json({
      message: '✅ Order created',
      order,
    });

  } catch (err) {
    res.status(500).json({ message: '❌ Failed to create order', error: err.message });
  }
};
exports.processPayment = async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;
    const retailerId = req.userId;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: '❌ Order not found' });
    }

    if (paymentStatus === 'completed') {
      order.paymentStatus = 'completed';
      order.status = 'completed';

      // Reduce product stock
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.quantity -= item.quantity;
          await product.save();
        }
      }

      // Clear cart
      await Cart.findOneAndUpdate(
        { retailerId },
        { items: [], totalPrice: 0, updatedAt: new Date() }
      );
    } else {
      order.paymentStatus = 'failed';
      order.status = 'cancelled';
    }

    await order.save();

    res.status(200).json({
      message: '✅ Payment processed',
      order,
    });

  } catch (err) {
    res.status(500).json({ message: '❌ Failed to process payment', error: err.message });
  }
};
exports.getRetailerOrders = async (req, res) => {
  try {
    const retailerId = req.userId;
    const orders = await Order.find({ retailerId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to get orders', error: err.message });
  }
};
exports.getSalesByPeriod = async (req, res) => {
  try {
    const { period } = req.query;
    const retailerId = req.userId;
    let startDate = new Date();
    if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);
    else if (period === 'year') startDate.setFullYear(startDate.getFullYear() - 1);
    else startDate.setHours(0, 0, 0, 0); // today

    const orders = await Order.find({
      retailerId,
      createdAt: { $gte: startDate },
      paymentStatus: 'completed',
    });

    res.status(200).json(orders);

  } catch (err) {
    res.status(500).json({ message: '❌ Failed to get sales', error: err.message });
  }
};
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: '❌ Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to get order', error: err.message });
  }
};
