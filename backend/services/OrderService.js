const OrderRepository = require('../repositories/OrderRepository');
const BookRepository = require('../repositories/BookRepository');
const OrderDTO = require('../dto/OrderDTO');

class OrderService {
  async createOrder(orderData, userId) {
    const processedData = OrderDTO.toCreateRequest(orderData, userId);
    const { items, shippingAddress, notes } = processedData;

    // Validate books and stock
    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const book = await BookRepository.findById(item.bookId);
      
      if (!book) {
        throw new Error(`Book with ID ${item.bookId} not found`);
      }

      if (book.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${book.title}". Available: ${book.stock}, Requested: ${item.quantity}`);
      }

      const subtotal = book.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        bookId: book._id,
        title: book.title,
        author: book.author,
        price: book.price,
        quantity: item.quantity,
        subtotal: subtotal
      });
    }

    // Create order
    const orderToCreate = {
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      notes
    };

    const order = await OrderRepository.create(orderToCreate);

    // Update book stock
    for (const item of items) {
      await BookRepository.updateStock(item.bookId, -item.quantity);
    }

    return {
      message: 'Order created successfully',
      order: OrderDTO.toPublicResponse(order)
    };
  }

  async getUserOrders(userId, queryParams) {
    const { page, limit } = queryParams;
    const options = { page, limit };
    
    const result = await OrderRepository.findByUserId(userId, options);
    return OrderDTO.toListResponse(result, false);
  }

  async getOrderById(orderId, userId, isAdmin = false) {
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Users can only see their own orders, admins can see all
    if (!isAdmin && order.userId._id.toString() !== userId.toString()) {
      throw new Error('Access denied');
    }

    return isAdmin ? OrderDTO.toAdminResponse(order) : OrderDTO.toPublicResponse(order);
  }

  async getAllOrders(queryParams) {
    const { page, limit, status, sortBy, sortOrder } = queryParams;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const options = { page, limit, sortBy, sortOrder };
    const result = await OrderRepository.findAll(query, options);
    const stats = await OrderRepository.getOrderStats();

    return OrderDTO.toListResponse({
      ...result,
      stats
    }, true);
  }

  async updateOrderStatus(orderId, status) {
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Handle stock restoration for cancelled orders
    if (status === 'cancelled' && order.status !== 'cancelled') {
      // Restore stock for all items
      for (const item of order.items) {
        await BookRepository.updateStock(item.bookId, item.quantity);
      }
    }

    const updatedOrder = await OrderRepository.updateStatus(orderId, status);
    
    return {
      message: 'Order status updated successfully',
      order: OrderDTO.toAdminResponse(updatedOrder)
    };
  }

  async cancelOrder(orderId, userId, isAdmin = false) {
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Users can only cancel their own orders, admins can cancel any
    if (!isAdmin && order.userId._id.toString() !== userId.toString()) {
      throw new Error('Access denied');
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      throw new Error('Only pending orders can be cancelled');
    }

    // Restore stock
    for (const item of order.items) {
      await BookRepository.updateStock(item.bookId, item.quantity);
    }

    await OrderRepository.updateStatus(orderId, 'cancelled');
    return { message: 'Order cancelled successfully' };
  }

  async getOrderStats() {
    const stats = await OrderRepository.getOrderStats();
    const totalRevenue = await OrderRepository.getTotalRevenue();
    
    return {
      statusStats: stats,
      totalRevenue,
      summary: {
        totalOrders: stats.reduce((sum, stat) => sum + stat.count, 0),
        totalRevenue
      }
    };
  }

  async getRecentOrders(limit = 5) {
    const orders = await OrderRepository.getRecentOrders(limit);
    return orders.map(order => OrderDTO.toOrderSummary(order));
  }

  async getPendingOrders() {
    const orders = await OrderRepository.findPendingOrders();
    return orders.map(order => OrderDTO.toAdminResponse(order));
  }

  async validateOrderItems(items) {
    const validationResults = [];

    for (const item of items) {
      const book = await BookRepository.findById(item.bookId);
      
      if (!book) {
        validationResults.push({
          bookId: item.bookId,
          valid: false,
          error: 'Book not found'
        });
        continue;
      }

      if (book.stock < item.quantity) {
        validationResults.push({
          bookId: item.bookId,
          title: book.title,
          valid: false,
          error: `Insufficient stock. Available: ${book.stock}, Requested: ${item.quantity}`
        });
        continue;
      }

      validationResults.push({
        bookId: item.bookId,
        title: book.title,
        author: book.author,
        price: book.price,
        quantity: item.quantity,
        subtotal: book.price * item.quantity,
        valid: true
      });
    }

    const isValid = validationResults.every(result => result.valid);
    const totalAmount = validationResults
      .filter(result => result.valid)
      .reduce((sum, result) => sum + result.subtotal, 0);

    return {
      isValid,
      items: validationResults,
      totalAmount
    };
  }
}

module.exports = new OrderService();