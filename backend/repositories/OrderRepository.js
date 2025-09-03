const Order = require('../models/Order');

class OrderRepository {
  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = options;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(query)
      .populate('userId', 'firstName lastName email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    return {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  async findById(id) {
    return await Order.findById(id)
      .populate('userId', 'firstName lastName email');
  }

  async findByUserId(userId, options = {}) {
    const { page = 1, limit = 10 } = options;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments({ userId });

    return {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  async create(orderData) {
    const order = new Order(orderData);
    const savedOrder = await order.save();
    return await this.findById(savedOrder._id);
  }

  async updateById(id, updateData) {
    const order = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    return await this.findById(order._id);
  }

  async updateStatus(id, status) {
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    return await this.findById(order._id);
  }

  async deleteById(id) {
    return await Order.findByIdAndDelete(id);
  }

  async getOrderStats() {
    return await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);
  }

  async findByStatus(status, options = {}) {
    return await this.findAll({ status }, options);
  }

  async getTotalRevenue() {
    const result = await Order.aggregate([
      {
        $match: { status: { $ne: 'cancelled' } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);
    return result[0]?.totalRevenue || 0;
  }

  async getRecentOrders(limit = 5) {
    return await Order.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findPendingOrders() {
    return await Order.find({ status: 'pending' })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
  }
}

module.exports = new OrderRepository();