import { Request, Response } from 'express';
import Order from '../models/orderModel';
import User from '../models/userModel';
import Product from '../models/productModel';
import { ProtectedRequest } from '../middleware/authMiddleware';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req: ProtectedRequest, res: Response) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user?._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req: ProtectedRequest, res: Response) => {
  // Populate user name and email from user collection
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email phone'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req: ProtectedRequest, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = new Date();
    // Payment result from PayPal/Stripe/etc
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req: ProtectedRequest, res: Response) => {
  const orders = await Order.find({ user: req.user?._id });
  res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req: ProtectedRequest, res: Response) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req: ProtectedRequest, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.orderStatus = 'Delivered';

    // Mark as paid if not already (assuming COD or explicit delivery trigger)
    if (!order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
    }

    // Decrement stock based on quantity ordered
    for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
            product.countInStock = product.countInStock - item.qty;
            await product.save();
        }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get dashboard stats
// @route   GET /api/orders/stats
// @access  Private/Admin
// @desc    Get dashboard stats
// @route   GET /api/orders/stats
// @access  Private/Admin
const getDashboardStats = async (req: Request, res: Response) => {
  const orders = await Order.find({});
  const users = await User.find({});
  const products = await Product.find({});

  // Calculate total revenue from PAID orders
  const totalRevenue = orders.reduce((acc, order) => {
      return acc + (order.isPaid ? order.totalPrice : 0);
  }, 0);

  // Calculate total sales count (paid orders)
  const paidOrdersCount = orders.filter(order => order.isPaid).length;

  // Daily revenue aggregation (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        isPaid: true
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$totalPrice" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Format chart data (ensure all days are present or just return sparse data)
  // For simplicity, returning what Mongo gives. Frontend can map it.
  const chartData = dailyRevenue.map(item => ({
      name: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }), // Mon, Tue...
      date: item._id,
      total: item.total
  }));

  res.json({
    totalRevenue,
    totalOrders: orders.length,
    paidOrdersCount,
    totalUsers: users.length,
    totalProducts: products.length,
    recentOrders: orders.sort((a: any, b: any) => b.createdAt - a.createdAt).slice(0, 5),
    chartData 
  });
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  getDashboardStats,
};
