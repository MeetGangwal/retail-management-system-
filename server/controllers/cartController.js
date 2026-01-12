const Cart = require('../models/Cart');
const Product = require('../models/Product');
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const retailerId = req.userId;
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    // Check stock
    if (product.quantity < quantity) {
      return res.status(400).json({ message: '❌ Insufficient stock' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ retailerId });
    if (!cart) {
      cart = new Cart({
        retailerId,
        items: [],
        totalPrice: 0,
      });
    }

    // Check if product already in cart
    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        productName: product.name,
        price: product.price,
        quantity,
      });
    }

    // Calculate total
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.updatedAt = new Date();

    await cart.save();

    res.status(200).json({
      message: '✅ Added to cart',
      cart,
    });

  } catch (err) {
    res.status(500).json({ message: '❌ Failed to add to cart', error: err.message });
  }
};
exports.getCart = async (req, res) => {
  try {
    const retailerId = req.userId;
    const cart = await Cart.findOne({ retailerId }).populate('items.productId');

    if (!cart) {
      return res.status(200).json({
        _id: null,
        retailerId,
        items: [],
        totalPrice: 0,
      });
    }

    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ message: '❌ Failed to get cart', error: err.message });
  }
};
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const retailerId = req.userId;
    const cart = await Cart.findOne({ retailerId });
    if (!cart) {
      return res.status(404).json({ message: '❌ Cart not found' });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: '❌ Item not in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.updatedAt = new Date();

    await cart.save();

    res.status(200).json({
      message: '✅ Cart updated',
      cart,
    });

  } catch (err) {
    res.status(500).json({ message: '❌ Failed to update cart', error: err.message });
  }
};
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const retailerId = req.userId;
    const cart = await Cart.findOne({ retailerId });
    if (!cart) {
      return res.status(404).json({ message: '❌ Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cart.updatedAt = new Date();

    await cart.save();

    res.status(200).json({
      message: '✅ Item removed from cart',
      cart,
    });

  } catch (err) {
    res.status(500).json({ message: '❌ Failed to remove from cart', error: err.message });
  }
};
exports.clearCart = async (req, res) => {
  try {
    const retailerId = req.userId;
    await Cart.findOneAndUpdate(
      { retailerId },
      { items: [], totalPrice: 0, updatedAt: new Date() }
    );

    res.status(200).json({ message: '✅ Cart cleared' });

  } catch (err) {
    res.status(500).json({ message: '❌ Failed to clear cart', error: err.message });
  }
};
