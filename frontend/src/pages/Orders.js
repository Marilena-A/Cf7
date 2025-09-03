import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data.orders);
      setError('');
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancellingOrder(orderId);

    try {
      await ordersAPI.cancel(orderId);
      // Refresh orders list
      await fetchOrders();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingOrder(null);
    }
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading your orders...</p>
          </div>
        </div>

        <style jsx>{`
          .orders-page {
            min-height: 100vh;
            padding: 40px 0;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          }

          .loading-state {
            text-align: center;
            color: white;
            padding: 60px 20px;
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

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Failed to Load Orders</h2>
            <p>{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary">
              🔄 Try Again
            </button>
          </div>
        </div>

        <style jsx>{`
          .orders-page {
            min-height: 100vh;
            padding: 40px 0;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          }

          .error-state {
            text-align: center;
            color: white;
            padding: 60px 20px;
          }

          .error-icon {
            font-size: 4rem;
            margin-bottom: 20px;
          }

          .error-state h2 {
            font-size: 2rem;
            margin-bottom: 15px;
          }

          .error-state p {
            font-size: 1.1rem;
            margin-bottom: 30px;
            opacity: 0.9;
          }
        `}</style>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="empty-orders">
            <div className="empty-icon">📋</div>
            <h1>No Orders Yet</h1>
            <p>You haven't placed any orders yet. Start browsing our book collection!</p>
            <div className="empty-actions">
              <Link to="/books" className="btn btn-primary btn-lg">
                🔍 Browse Books
              </Link>
              <Link to="/" className="btn btn-secondary btn-lg">
                🏠 Go Home
              </Link>
            </div>
          </div>
        </div>

        <style jsx>{`
          .orders-page {
            min-height: 100vh;
            padding: 40px 0;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            display: flex;
            align-items: center;
          }

          .empty-orders {
            text-align: center;
            color: white;
            max-width: 500px;
            margin: 0 auto;
          }

          .empty-icon {
            font-size: 5rem;
            margin-bottom: 30px;
            opacity: 0.8;
          }

          .empty-orders h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
          }

          .empty-orders p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.9;
          }

          .empty-actions {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">📋 My Orders</h1>
          <p className="page-subtitle">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
          </p>
        </div>

        {/* User Info */}
        <div className="user-info">
          <div className="user-card">
            <div className="user-avatar">
              {user?.firstName?.charAt(0) || '👤'}
            </div>
            <div className="user-details">
              <h3>{user?.firstName} {user?.lastName}</h3>
              <p>{user?.email}</p>
            </div>
            <div className="user-stats">
              <div className="stat">
                <span className="stat-number">{orders.length}</span>
                <span className="stat-label">Total Orders</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  €{orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
                </span>
                <span className="stat-label">Total Spent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              {/* Order Header */}
              <div className="order-header">
                <div className="order-info">
                  <div className="order-id">
                    📄 Order #{order._id.slice(-8).toUpperCase()}
                  </div>
                  <div className="order-date">
                    📅 {formatDate(order.orderDate)}
                  </div>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <span className="item-title">{item.title}</span>
                      <span className="item-author">by {item.author}</span>
                    </div>
                    <div className="item-details">
                      <span className="item-price">€{item.price.toFixed(2)}</span>
                      <span className="item-quantity">× {item.quantity}</span>
                      <span className="item-subtotal">€{item.subtotal.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="order-summary">
                <div className="summary-left">
                  <div className="shipping-address">
                    <strong>📍 Shipping Address:</strong>
                    <span>{order.shippingAddress}</span>
                  </div>
                  {order.notes && (
                    <div className="order-notes">
                      <strong>📝 Notes:</strong>
                      <span>{order.notes}</span>
                    </div>
                  )}
                </div>
                <div className="summary-right">
                  <div className="order-total">
                    <span className="total-label">Total:</span>
                    <span className="total-amount">€{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="order-actions">
                <div className="action-buttons">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="btn btn-sm btn-error"
                      disabled={cancellingOrder === order._id}
                    >
                      {cancellingOrder === order._id ? (
                        <>
                          <span className="spinner-sm"></span>
                          Cancelling...
                        </>
                      ) : (
                        '❌ Cancel Order'
                      )}
                    </button>
                  )}
                  
                  <Link 
                    to="/books" 
                    className="btn btn-sm btn-secondary"
                  >
                    🔄 Order Again
                  </Link>
                  
                  <button className="btn btn-sm btn-primary">
                    📧 Contact Support
                  </button>
                </div>

                {/* Order Progress */}
                <div className="order-progress">
                  <div className="progress-step completed">
                    <span className="step-icon">✅</span>
                    <span className="step-label">Order Placed</span>
                  </div>
                  <div className="progress-connector completed"></div>
                  <div className={`progress-step ${['confirmed', 'shipped', 'delivered'].includes(order.status) ? 'completed' : order.status === 'cancelled' ? 'cancelled' : 'pending'}`}>
                    <span className="step-icon">
                      {order.status === 'cancelled' ? '❌' : 
                       ['confirmed', 'shipped', 'delivered'].includes(order.status) ? '✅' : '⏳'}
                    </span>
                    <span className="step-label">Confirmed</span>
                  </div>
                  <div className={`progress-connector ${['shipped', 'delivered'].includes(order.status) ? 'completed' : ''}`}></div>
                  <div className={`progress-step ${['shipped', 'delivered'].includes(order.status) ? 'completed' : order.status === 'cancelled' ? 'cancelled' : 'pending'}`}>
                    <span className="step-icon">
                      {order.status === 'cancelled' ? '❌' : 
                       ['shipped', 'delivered'].includes(order.status) ? '✅' : '⏳'}
                    </span>
                    <span className="step-label">Shipped</span>
                  </div>
                  <div className={`progress-connector ${order.status === 'delivered' ? 'completed' : ''}`}></div>
                  <div className={`progress-step ${order.status === 'delivered' ? 'completed' : order.status === 'cancelled' ? 'cancelled' : 'pending'}`}>
                    <span className="step-icon">
                      {order.status === 'cancelled' ? '❌' : 
                       order.status === 'delivered' ? '✅' : '⏳'}
                    </span>
                    <span className="step-label">Delivered</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Shopping */}
        <div className="page-footer">
          <Link to="/books" className="btn btn-primary btn-lg">
            📚 Continue Shopping
          </Link>
        </div>
      </div>

      <style jsx>{`
        .orders-page {
          min-height: 100vh;
          padding: 40px 0;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        }

        .page-header {
          text-align: center;
          margin-bottom: 40px;
          color: white;
        }

        .page-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .page-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .user-info {
          margin-bottom: 40px;
        }

        .user-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          color: white;
        }

        .user-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: white;
          color: var(--primary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .user-details {
          flex: 1;
        }

        .user-details h3 {
          font-size: 1.3rem;
          margin-bottom: 5px;
        }

        .user-details p {
          opacity: 0.8;
        }

        .user-stats {
          display: flex;
          gap: 30px;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 25px;
          margin-bottom: 40px;
        }

        .order-card {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .order-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid var(--border-color);
        }

        .order-id {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .order-date {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-top: 5px;
        }

        .status-badge {
          padding: 8px 16px;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .order-items {
          margin-bottom: 20px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-title {
          font-weight: 600;
          color: var(--text-primary);
          display: block;
        }

        .item-author {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .item-details {
          display: flex;
          gap: 15px;
          align-items: center;
          font-size: 0.9rem;
        }

        .item-price {
          color: var(--success-color);
          font-weight: 600;
        }

        .item-quantity {
          color: var(--text-secondary);
        }

        .item-subtotal {
          color: var(--primary-color);
          font-weight: 700;
          min-width: 80px;
          text-align: right;
        }

        .order-summary {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 25px;
          padding-top: 15px;
          border-top: 1px solid var(--border-color);
        }

        .summary-left {
          flex: 1;
        }

        .shipping-address, .order-notes {
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .shipping-address strong, .order-notes strong {
          display: block;
          margin-bottom: 5px;
          color: var(--text-primary);
        }

        .shipping-address span, .order-notes span {
          color: var(--text-secondary);
        }

        .order-total {
          text-align: right;
        }

        .total-label {
          display: block;
          color: var(--text-secondary);
          margin-bottom: 5px;
        }

        .total-amount {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary-color);
        }

        .order-actions {
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .order-progress {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          min-width: 80px;
        }

        .step-icon {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .progress-step.completed .step-icon {
          background: var(--success-color);
          color: white;
        }

        .progress-step.cancelled .step-icon {
          background: var(--error-color);
          color: white;
        }

        .progress-step.pending .step-icon {
          background: var(--warning-color);
          color: white;
        }

        .step-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          text-align: center;
        }

        .progress-step.completed .step-label {
          color: var(--success-color);
          font-weight: 600;
        }

        .progress-connector {
          width: 40px;
          height: 2px;
          background: #e5e7eb;
          margin: 0 10px;
        }

        .progress-connector.completed {
          background: var(--success-color);
        }

        .spinner-sm {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 5px;
        }

        .page-footer {
          text-align: center;
        }

        @media (max-width: 768px) {
          .user-card {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }

          .user-stats {
            justify-content: center;
          }

          .order-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
          }

          .order-summary {
            flex-direction: column;
            gap: 20px;
          }

          .item-details {
            flex-direction: column;
            gap: 5px;
            text-align: right;
          }

          .action-buttons {
            justify-content: center;
          }

          .order-progress {
            flex-wrap: wrap;
            gap: 10px;
          }

          .progress-connector {
            display: none;
          }

          .page-title {
            font-size: 2rem;
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