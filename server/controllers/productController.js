const Product = require('../models/Product');

// Add product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, imageUrl } = req.body;

    const product = new Product({
      name,
      description,
      price,
      quantity,
      imageUrl,
      retailerId: req.userId,
    });

    await product.save();
    res.status(201).json({
      message: '✅ Product added successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: '❌ ' + error.message });
  }
};

// Get all products for a retailer
exports.getRetailerProducts = async (req, res) => {
  try {
    const products = await Product.find({ retailerId: req.userId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: '❌ ' + error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: '❌ ' + error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, imageUrl } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    if (product.retailerId.toString() !== req.userId) {
      return res.status(403).json({ message: '❌ Unauthorized' });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        quantity,
        imageUrl,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.json({
      message: '✅ Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: '❌ ' + error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: '❌ Product not found' });
    }

    if (product.retailerId.toString() !== req.userId) {
      return res.status(403).json({ message: '❌ Unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: '✅ Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: '❌ ' + error.message });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { query, retailerId } = req.query;

    if (!query || !retailerId) {
      return res.status(400).json({ message: '❌ Query and retailerId required' });
    }

    const searchCriteria = {
      retailerId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    };

    const products = await Product.find(searchCriteria);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: '❌ ' + error.message });
  }
};

// Get products by retailer (for customers)
exports.getProductsByRetailer = async (req, res) => {
  try {
    const { retailerId } = req.params;
    const products = await Product.find({ retailerId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: '❌ ' + error.message });
  }
};
