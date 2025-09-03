class OrderDTO {
  constructor(order) {
    this.id = order._id;
    this.userId = order.userId;
    this.items = order.items;
    this.totalAmount = order.totalAmount;
    this.status = order.status;
    this.shippingAddress = order.shippingAddress;
    this.orderDate = order.orderDate;
    this.notes = order.notes;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
  }

  static toPublicResponse(order) {
    return {
      id: order._id,
      items: order.items.map(item => ({
        id: item._id,
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      statusDisplay: OrderDTO.getStatusDisplay(order.status),
      shippingAddress: order.shippingAddress,
      orderDate: order.orderDate,
      notes: order.notes,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      canCancel: order.status === 'pending'
    };
  }

  static toAdminResponse(order) {
    return {
      id: order._id,
      customer: order.userId ? {
        id: order.userId._id,
        name: `${order.userId.firstName} ${order.userId.lastName}`,
        email: order.userId.email
      } : null,
      items: order.items.map(item => ({
        id: item._id,
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      statusDisplay: OrderDTO.getStatusDisplay(order.status),
      shippingAddress: order.shippingAddress,
      orderDate: order.orderDate,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      canUpdateStatus: ['pending', 'confirmed', 'shipped'].includes(order.status)
    };
  }

  static toListResponse(ordersData, isAdmin = false) {
    const responseMapper = isAdmin ? OrderDTO.toAdminResponse : OrderDTO.toPublicResponse;
    
    return {
      orders: ordersData.orders.map(order => responseMapper(order)),
      pagination: ordersData.pagination,
      stats: ordersData.stats || []
    };
  }

  static toCreateRequest(data, userId) {
    return {
      userId,
      items: data.items.map(item => ({
        bookId: item.bookId,
        quantity: parseInt(item.quantity)
      })),
      shippingAddress: data.shippingAddress?.trim(),
      notes: data.notes?.trim()
    };
  }

  static getStatusDisplay(status) {
    const statusMap = {
      'pending': 'Pending',
      'confirmed': 'Confirmed', 
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  static getStatusColor(status) {
    const colorMap = {
      'pending': 'orange',
      'confirmed': 'blue',
      'shipped': 'purple', 
      'delivered': 'green',
      'cancelled': 'red'
    };
    return colorMap[status] || 'gray';
  }

  static toOrderSummary(order) {
    return {
      id: order._id,
      totalAmount: order.totalAmount,
      status: order.status,
      statusDisplay: OrderDTO.getStatusDisplay(order.status),
      itemCount: order.items.length,
      orderDate: order.orderDate
    };
  }

  static fromArray(orders) {
    return orders.map(order => new OrderDTO(order));
  }
}

module.exports = OrderDTO;