/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchOrders();
  }, [searchTerm, statusFilter, sortBy, sortOrder, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 15
      };

      const response = await ordersAPI.getAll(params);
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
      
      // Calculate stats
      const orderStats = response.data.stats || [];
      const newStats = {
        total: orderStats.reduce((sum, stat) => sum + stat.count, 0),
        pending: orderStats.find(s => s._id === 'pending')?.count || 0,
        confirmed: orderStats.find(s => s._id === 'confirmed')?.count || 0,
        shipped: orderStats.find(s => s._id === 'shipped')?.count || 0,
        delivered: orderStats.find(s => s._id === 'delivered')?.count || 0,
        cancelled: orderStats.find(s => s._id === 'cancelled')?.count || 0,
        totalRevenue: orderStats
          .filter(s => s._id !== 'cancelled')
          .reduce((sum, stat) => sum + (stat.totalAmount || 0), 0)
      };
      setStats(newStats);
      setError('');
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change order status to "${newStatus}"?`)) {
      return;
    }

    setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));

    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      await fetchOrders(); // Refresh the list
      
      // Update selected order if it's the one being viewed
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
      
      setError('✅ Order status updated successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('Failed to update order status:', error);
      setError(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilter) => {
    setStatusFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('orderDate');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✅',
      shipped: '🚚',
      delivered: '📦',
      cancelled: '❌'
    };
    return icons[status] || '📋';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => `€${amount.toFixed(2)}`;

  const filteredOrders = orders.filter(order => {
    const shortId = String(order._id).slice(-8).toUpperCase(); // ensure string
    const fullName = `${order.userId?.firstName || ''} ${order.userId?.lastName || ''}`.toLowerCase();
    const email = order.userId?.email?.toLowerCase() || '';
    const search = searchTerm.trim().toLowerCase();

    return (
      shortId.includes(search.toUpperCase()) || // compare in uppercase
      fullName.includes(search) ||
      email.includes(search)
    );
  });

  return (
    <div className="admin-orders">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">📦 Order Management</h1>
            <p className="page-subtitle">
              Manage and track all customer orders • {filteredOrders.length} of {stats.total} orders
            </p>
          </div>
          <div className="header-actions">
            <button 
              onClick={fetchOrders}
              className="btn btn-secondary refresh-btn"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
            <button onClick={() => setError('')} className="alert-close">✕</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>

          <div className="stat-card total">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending Orders</div>
            </div>
          </div>

          <div className="stat-card delivered">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-number">{stats.delivered}</div>
              <div className="stat-label">Delivered</div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-container">
            {/* Search */}
            <div className="filter-group">
              <label className="filter-label">🔍 Search Orders</label>
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="filter-input"
              />
            </div>

            {/* Status Filter */}
            <div className="filter-group">
              <label className="filter-label">📊 Status Filter</label>
              <div className="status-tabs">
                <button
                  className={`status-tab ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  🌟 All ({stats.total})
                </button>
                <button
                  className={`status-tab ${statusFilter === 'pending' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('pending')}
                >
                  ⏳ Pending ({stats.pending})
                </button>
                <button
                  className={`status-tab ${statusFilter === 'confirmed' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('confirmed')}
                >
                  ✅ Confirmed ({stats.confirmed})
                </button>
                <button
                  className={`status-tab ${statusFilter === 'shipped' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('shipped')}
                >
                  🚚 Shipped ({stats.shipped})
                </button>
                <button
                  className={`status-tab ${statusFilter === 'delivered' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('delivered')}
                >
                  📦 Delivered ({stats.delivered})
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="filter-group">
              <label className="filter-label">📅 Sort By</label>
              <div className="sort-options">
                <button
                  className={`sort-btn ${sortBy === 'orderDate' ? 'active' : ''}`}
                  onClick={() => handleSortChange('orderDate')}
                >
                  📅 Date {sortBy === 'orderDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  className={`sort-btn ${sortBy === 'totalAmount' ? 'active' : ''}`}
                  onClick={() => handleSortChange('totalAmount')}
                >
                  💰 Amount {sortBy === 'totalAmount' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  className="clear-filters-btn"
                  onClick={clearFilters}
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading orders...</p>
          </div>
        ) : (
          <div className="orders-table-container">
            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id} className="order-row">
                      <td className="order-id">
                        <button
                          onClick={() => openOrderDetails(order)}
                          className="order-id-btn"
                        >
                          #{order._id.slice(-8).toUpperCase()}
                        </button>
                      </td>
                      <td className="customer-info">
                        <div className="customer-details">
                          <div className="customer-name">
                            {order.userId?.firstName} {order.userId?.lastName}
                          </div>
                          <div className="customer-email">
                            {order.userId?.email}
                          </div>
                        </div>
                      </td>
                      <td className="order-items">
                        <span className="items-count">
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </span>
                        <div className="items-preview">
                          {order.items.slice(0, 2).map((item, index) => (
                            <span key={index} className="item-title">
                              {item.title}
                              {index < 1 && order.items.length > 2 ? ', ' : ''}
                            </span>
                          ))}
                          {order.items.length > 2 && (
                            <span className="more-items">
                              +{order.items.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="order-amount">
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td className="order-status">
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </td>
                      <td className="order-date">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="order-actions">
                        <div className="action-buttons">
                          <button
                            onClick={() => openOrderDetails(order)}
                            className="btn btn-sm btn-primary action-btn"
                            title="View details"
                          >
                            👁️
                          </button>
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                              className="status-select"
                              disabled={updatingStatus[order._id]}
                            >
                              <option value="pending">⏳ Pending</option>
                              <option value="confirmed">✅ Confirmed</option>
                              <option value="shipped">🚚 Shipped</option>
                              <option value="delivered">📦 Delivered</option>
                              <option value="cancelled">❌ Cancelled</option>
                            </select>
                          )}
                          {updatingStatus[order._id] && (
                            <span className="spinner-sm"></span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No orders found</h3>
                  <p>Try adjusting your filters or check back later for new orders.</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    🔄 Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrev}
            >
              ← Previous
            </button>
            
            <div className="pagination-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination.hasNext}
            >
              Next →
            </button>
          </div>
        )}

        {/* Order Details Modal */}
        {showDetailsModal && selectedOrder && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal order-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📦 Order Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="modal-close"
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                {/* Order Header */}
                <div className="order-header-details">
                  <div className="order-info-grid">
                    <div className="info-item">
                      <label>Order ID:</label>
                      <span className="order-id-display">
                        #{selectedOrder._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Status:</label>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                      >
                        {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Order Date:</label>
                      <span>{formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    <div className="info-item">
                      <label>Total Amount:</label>
                      <span className="total-amount">
                        {formatCurrency(selectedOrder.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="section">
                  <h3>👤 Customer Information</h3>
                  <div className="customer-info-grid">
                    <div className="info-item">
                      <label>Name:</label>
                      <span>
                        {selectedOrder.userId?.firstName} {selectedOrder.userId?.lastName}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Email:</label>
                      <span>{selectedOrder.userId?.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Role:</label>
                      <span className="role-badge">
                        {selectedOrder.userId?.role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="section">
                  <h3>📍 Shipping Information</h3>
                  <div className="shipping-address">
                    {selectedOrder.shippingAddress}
                  </div>
                  {selectedOrder.notes && (
                    <div className="order-notes">
                      <label>📝 Order Notes:</label>
                      <p>{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                <div className="section">
                  <h3>📚 Order Items</h3>
                  <div className="items-list">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="item-card">
                        <div className="item-info">
                          <h4 className="item-title">{item.title}</h4>
                          <p className="item-author">by {item.author}</p>
                        </div>
                        <div className="item-details">
                          <div className="item-price">€{item.price.toFixed(2)}</div>
                          <div className="item-quantity">× {item.quantity}</div>
                          <div className="item-subtotal">
                            €{item.subtotal.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Update */}
                {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && (
                  <div className="section">
                    <h3>🔄 Update Order Status</h3>
                    <div className="status-update-buttons">
                      {['confirmed', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                          className={`btn ${status === 'cancelled' ? 'btn-error' : 'btn-primary'}`}
                          disabled={updatingStatus[selectedOrder._id] || selectedOrder.status === status}
                        >
                          {getStatusIcon(status)} Mark as {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-orders {
          min-height: 100vh;
          padding: 40px 0;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          color: white;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .page-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .refresh-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }

        .refresh-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .alert-close {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          margin-left: auto;
          padding: 5px;
          font-size: 1.2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .stat-card.revenue {
          border-left: 5px solid #10b981;
        }

        .stat-card.total {
          border-left: 5px solid #3b82f6;
        }

        .stat-card.pending {
          border-left: 5px solid #f59e0b;
        }

        .stat-card.delivered {
          border-left: 5px solid #8b5cf6;
        }

        .stat-icon {
          font-size: 2.5rem;
          width: 60px;
          text-align: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 5px;
        }

        .filters-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 25px;
        }

        .filters-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-label {
          color: white;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .filter-input {
          padding: 10px 15px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          transition: all 0.3s ease;
          max-width: 400px;
        }

        .filter-input:focus {
          border-color: white;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }

        .status-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .status-tab {
          padding: 8px 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .status-tab:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .status-tab.active {
          background: white;
          color: var(--primary-color);
          border-color: white;
        }

        .sort-options {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .sort-btn {
          padding: 8px 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .sort-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .sort-btn.active {
          background: rgba(255, 255, 255, 0.9);
          color: var(--primary-color);
        }

        .clear-filters-btn {
          padding: 8px 16px;
          border: 1px solid var(--warning-color);
          border-radius: 15px;
          background: var(--warning-color);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .orders-table-container {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table th {
          background: var(--bg-accent);
          padding: 15px;
          text-align: left;
          font-weight: 700;
          color: var(--text-primary);
          border-bottom: 2px solid var(--border-color);
          font-size: 0.9rem;
        }

        .orders-table td {
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
          vertical-align: middle;
        }

        .order-row:hover {
          background: var(--bg-secondary);
        }

        .order-id-btn {
          background: none;
          border: none;
          color: var(--primary-color);
          font-weight: 700;
          font-family: monospace;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .order-id-btn:hover {
          color: var(--secondary-color);
          text-decoration: underline;
        }

        .customer-details {
          display: flex;
          flex-direction: column;
        }

        .customer-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .customer-email {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .items-count {
          font-weight: 600;
          color: var(--primary-color);
          display: block;
          margin-bottom: 4px;
        }

        .items-preview {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .item-title {
          font-weight: 500;
        }

        .more-items {
          color: var(--primary-color);
          font-weight: 600;
        }

        .order-amount {
          font-weight: 700;
          color: var(--success-color);
          font-size: 1.1rem;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .order-date {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .action-btn {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 1rem;
        }

        .status-select {
          padding: 6px 10px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          font-size: 0.8rem;
          background: white;
          cursor: pointer;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: white;
        }

        .spinner-large {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .spinner-sm {
          width: 16px;
          height: 16px;
          border: 2px solid var(--primary-color);
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: var(--text-primary);
        }

        .empty-state p {
          margin-bottom: 30px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          color: white;
          margin-bottom: 30px;
        }

        .pagination-btn {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: white;
          border-radius: 20px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease;
        }

        .order-details-modal {
          max-width: 900px;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px 30px;
          border-bottom: 2px solid var(--border-color);
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-secondary);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: var(--bg-accent);
          color: var(--text-primary);
        }

        .modal-body {
          padding: 30px;
        }

        .order-header-details {
          margin-bottom: 30px;
        }

        .order-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          background: var(--bg-accent);
          padding: 20px;
          border-radius: 12px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .info-item label {
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .info-item span {
          font-weight: 600;
          color: var(--text-primary);
        }

        .order-id-display {
          font-family: monospace;
          color: var(--primary-color);
        }

        .total-amount {
          color: var(--success-color);
          font-size: 1.2rem;
        }

        .section {
          margin-bottom: 30px;
        }

        .section h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 15px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 8px;
        }

        .customer-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .role-badge {
          background: var(--primary-color);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          text-transform: uppercase;
          font-weight: 600;
        }

        .shipping-address {
          background: var(--bg-secondary);
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid var(--primary-color);
          margin-bottom: 15px;
          font-weight: 500;
        }

        .order-notes {
          margin-top: 15px;
        }

        .order-notes label {
          font-weight: 600;
          color: var(--text-primary);
          display: block;
          margin-bottom: 8px;
        }

        .order-notes p {
          background: var(--bg-secondary);
          padding: 12px;
          border-radius: 8px;
          margin: 0;
          font-style: italic;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .item-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid var(--border-color);
          border-radius: 10px;
          background: var(--bg-secondary);
        }

        .item-info {
          flex: 1;
        }

        .item-card .item-title {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .item-author {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .item-details {
          display: flex;
          gap: 15px;
          align-items: center;
          font-weight: 600;
        }

        .item-price {
          color: var(--success-color);
        }

        .item-quantity {
          color: var(--text-secondary);
        }

        .item-subtotal {
          color: var(--primary-color);
          font-size: 1.1rem;
        }

        .status-update-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .status-update-buttons .btn {
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .page-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .status-tabs {
            flex-direction: column;
            gap: 8px;
          }

          .sort-options {
            flex-direction: column;
            gap: 8px;
          }

          .orders-table th,
          .orders-table td {
            padding: 10px 8px;
            font-size: 0.9rem;
          }

          .action-buttons {
            flex-direction: column;
            gap: 5px;
          }

          .modal {
            margin: 10px;
            max-height: 95vh;
          }

          .modal-body {
            padding: 20px;
          }

          .order-info-grid {
            grid-template-columns: 1fr;
          }

          .customer-info-grid {
            grid-template-columns: 1fr;
          }

          .item-card {
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .item-details {
            justify-content: center;
          }

          .status-update-buttons {
            flex-direction: column;
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}