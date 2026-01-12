const Order = require('../models/Order');

exports.getSalesAnalytics = async (req, res) => {
  try {
    const retailerId = req.userId;

    const now = new Date();

    // --- Today range (UTC) ---
    const startOfToday = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    ));
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

    const todayOrders = await Order.find({
      retailerId,
      paymentStatus: 'completed',
      createdAt: { $gte: startOfToday, $lt: startOfTomorrow },
    });

    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // --- Month range (UTC, from 1st of this month to now) ---
    const startOfMonth = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      1
    ));

    const monthlyOrders = await Order.find({
      retailerId,
      paymentStatus: 'completed',
      createdAt: { $gte: startOfMonth, $lt: now },
    });

    const monthlyRevenue = monthlyOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    // --- Last 7 days range (UTC) ---
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 7);

    const weeklyOrders = await Order.find({
      retailerId,
      paymentStatus: 'completed',
      createdAt: { $gte: sevenDaysAgo, $lt: now },
    });

    const weekly = {};
    weeklyOrders.forEach((order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!weekly[date]) weekly[date] = 0;
      weekly[date] += order.totalAmount;
    });

    const weeklyData = Object.entries(weekly).map(([date, revenue]) => ({
      _id: date,
      revenue,
    }));

    // --- Product sales (from monthlyOrders) ---
    const productSales = {};
    monthlyOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!productSales[item.productName]) {
          productSales[item.productName] = { quantity: 0, revenue: 0 };
        }
        productSales[item.productName].quantity += item.quantity;
        productSales[item.productName].revenue += item.subtotal;
      });
    });

    const productSalesData = Object.entries(productSales)
      .map(([name, data]) => ({ _id: name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    res.status(200).json({
      today: {
        orderCount: todayOrders.length,
        totalRevenue: todayRevenue,
      },
      monthly: {
        orderCount: monthlyOrders.length,
        totalRevenue: monthlyRevenue,
      },
      weekly: weeklyData,
      productSales: productSalesData,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: '❌ Failed to get analytics', error: err.message });
  }
};
