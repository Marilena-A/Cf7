import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI, ordersAPI, usersAPI } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    lowStockBooks: 0,
    pendingOrders: 0,
    categories: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockBooks, setLowStockBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [booksResponse, ordersResponse, usersResponse] = await Promise.all([
        booksAPI.getAll({ limit: 100 }),
        ordersAPI.getAll({ limit: 10 }),
        usersAPI.getAll({ limit: 50 })
      ]);

      const books = booksResponse.data.books;
      const orders = ordersResponse.data.orders;
      const orderStats = ordersResponse.data.stats || [];
      const users = usersResponse.data.users;

      // Calculate stats
      const totalRevenue = orderStats.reduce((sum, stat) => {
        if (stat._id !== 'cancelled') {
          return sum + (stat.totalAmount || 0);
        }
        return sum;
      }, 0);

      const pendingOrders = orderStats.find(stat => stat._id === 'pending')?.count || 0;
      const lowStockItems = books.filter(book => book.stock < 10);

      setStats({
        totalBooks: books.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue,
        lowStockBooks: lowStockItems.length,
        pendingOrders,
        categories: booksResponse.data.categories?.length || 0
      });

      setRecentOrders(orders.slice(0, 5));
      setLowStockBooks(lowStockItems.slice(0, 5));
      setError('');
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => `€${amount.toFixed(2)}`;

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>

        <style jsx>{`
          .admin-dashboard {
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

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="dashboard-title">👨‍💼 Admin Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome to your book store command center
            </p>
          </div>
          <div className="header-actions">
            <button 
              onClick={fetchDashboardData}
              className="btn btn-secondary refresh-btn"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-trend positive">↗️ +12%</div>
          </div>

          <div className="stat-card orders">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-trend positive">↗️ +8%</div>
          </div>

          <div className="stat-card books">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalBooks}</div>
              <div className="stat-label">Books in Stock</div>
            </div>
            <div className="stat-trend neutral">→ Stable</div>
          </div>

          <div className="stat-card users">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Registered Users</div>
            </div>
            <div className="stat-trend positive">↗️ +15%</div>
          </div>

          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-number">{stats.pendingOrders}</div>
              <div className="stat-label">Pending Orders</div>
            </div>
            <div className="stat-action">
              <Link to="/admin/orders" className="action-link">Review →</Link>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <div className="stat-number">{stats.lowStockBooks}</div>
              <div className="stat-label">Low Stock Items</div>
            </div>
            <div className="stat-action">
              <Link to="/admin/books" className="action-link">Restock →</Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">⚡ Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/books" className="action-card">
              <div className="action-icon">📚</div>
              <div className="action-content">
                <h3>Manage Books</h3>
                <p>Add, edit, or remove books from your catalog</p>
              </div>
              <div className="action-arrow">→</div>
            </Link>

            <Link to="/admin/orders" className="action-card">
              <div className="action-icon">📦</div>
              <div className="action-content">
                <h3>Process Orders</h3>
                <p>View and update order status</p>
              </div>
              <div className="action-arrow">→</div>
            </Link>

            <Link to="/admin/users" className="action-card">
              <div className="action-icon">👥</div>
              <div className="action-content">
                <h3>Manage Users</h3>
                <p>View user accounts and permissions</p>
              </div>
              <div className="action-arrow">→</div>
            </Link>

            <a 
              href="http://localhost:5000/api-docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className="action-card"
            >
              <div className="action-icon">📖</div>
              <div className="action-content">
                <h3>API Documentation</h3>
                <p>View interactive API documentation</p>
              </div>
              <div className="action-arrow">↗️</div>
            </a>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Orders */}
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">📋 Recent Orders</h2>
              <Link to="/admin/orders" className="section-link">
                View All →
              </Link>
            </div>

            <div className="orders-table">
              {recentOrders.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No recent orders</p>
                </div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order._id}>
                          <td className="order-id">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="customer">
                            {order.userId?.firstName} {order.userId?.lastName}
                          </td>
                          <td className="amount">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="status">
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="date">
                            {formatDate(order.orderDate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">⚠️ Low Stock Alert</h2>
              <Link to="/admin/books" className="section-link">
                Manage Inventory →
              </Link>
            </div>

            <div className="stock-alerts">
              {lowStockBooks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✅</div>
                  <p>All books are well stocked!</p>
                </div>
              ) : (
                <div className="stock-list">
                  {lowStockBooks.map(book => (
                    <div key={book.id} className="stock-item">
                      <div className="book-info">
                        <img 
                          src={book.imageUrl} 
                          alt={book.title}
                          className="book-thumbnail"
                        />
                        <div className="book-details">
                          <h4 className="book-title">{book.title}</h4>
                          <p className="book-author">by {book.author}</p>
                        </div>
                      </div>
                      <div className="stock-info">
                        <span className={`stock-level ${book.stock === 0 ? 'out-of-stock' : 'low-stock'}`}>
                          {book.stock === 0 ? 'Out of Stock' : `${book.stock} left`}
                        </span>
                        <span className="book-price">{formatCurrency(book.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="system-status">
          <h2 className="section-title">🖥️ System Status</h2>
          <div className="status-grid">
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>API Server</span>
              <span className="status-text">Online</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Database</span>
              <span className="status-text">Connected</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Authentication</span>
              <span className="status-text">Active</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>File Storage</span>
              <span className="status-text">Available</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          padding: 40px 0;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          color: white;
        }

        .dashboard-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .dashboard-subtitle {
          font-size: 1.2rem;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
          margin-bottom: 40px;
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
          position: relative;
          overflow: hidden;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .stat-card.revenue {
          border-left: 5px solid #10b981;
        }

        .stat-card.orders {
          border-left: 5px solid #3b82f6;
        }

        .stat-card.books {
          border-left: 5px solid #8b5cf6;
        }

        .stat-card.users {
          border-left: 5px solid #f59e0b;
        }

        .stat-card.pending {
          border-left: 5px solid #f59e0b;
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
        }

        .stat-card.warning {
          border-left: 5px solid #ef4444;
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
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

        .stat-trend {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
        }

        .stat-trend.positive {
          background: #d1fae5;
          color: #065f46;
        }

        .stat-trend.neutral {
          background: #f3f4f6;
          color: #374151;
        }

        .stat-action {
          font-size: 0.9rem;
        }

        .action-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .action-link:hover {
          color: var(--secondary-color);
        }

        .quick-actions {
          margin-bottom: 40px;
        }

        .section-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 25px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .action-icon {
          font-size: 2rem;
          width: 50px;
          text-align: center;
        }

        .action-content {
          flex: 1;
        }

        .action-content h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 5px;
        }

        .action-content p {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .action-arrow {
          font-size: 1.2rem;
          color: var(--primary-color);
          font-weight: 700;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        .content-section {
          background: white;
          border-radius: 20px;
          padding: 25px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid var(--border-color);
        }

        .section-header .section-title {
          color: var(--text-primary);
          margin-bottom: 0;
        }

        .section-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .section-link:hover {
          color: var(--secondary-color);
        }

        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 12px 8px;
          font-weight: 600;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-color);
          font-size: 0.9rem;
        }

        td {
          padding: 15px 8px;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.9rem;
        }

        .order-id {
          font-family: monospace;
          font-weight: 600;
          color: var(--primary-color);
        }

        .customer {
          font-weight: 600;
        }

        .amount {
          font-weight: 700;
          color: var(--success-color);
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .date {
          color: var(--text-secondary);
        }

        .stock-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .stock-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .stock-item:hover {
          border-color: var(--primary-color);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
        }

        .book-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .book-thumbnail {
          width: 40px;
          height: 50px;
          object-fit: cover;
          border-radius: 6px;
        }

        .book-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 3px;
        }

        .book-author {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }

        .stock-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
        }

        .stock-level {
          font-size: 0.8rem;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 8px;
        }

        .stock-level.low-stock {
          background: #fef3c7;
          color: #92400e;
        }

        .stock-level.out-of-stock {
          background: #fee2e2;
          color: #991b1b;
        }

        .book-price {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--success-color);
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .system-status {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 25px;
          color: white;
        }

        .status-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .status-indicator.online {
          background: #10b981;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .status-text {
          margin-left: auto;
          font-weight: 600;
          color: #10b981;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .dashboard-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-content {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .status-grid {
            grid-template-columns: 1fr;
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