/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './AdminUsers.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  
  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingRole, setUpdatingRole] = useState({});
  const [deletingUser, setDeletingUser] = useState({});
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    users: 0,
    newThisMonth: 0
  });

  const { user } = useAuth(); // Get current logged-in user

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    if (searchTerm.trim()) {
      setCurrentPage(1);
      fetchUsers();
    } else if (!searchTerm.trim()) {
      fetchUsers();
    }
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 50
      };

      const response = await usersAPI.getAll(params);
      const allUsers = response.data.users || response.data || [];
      setUsers(allUsers);
      setPagination(response.data.pagination || {});
      
      const newStats = {
        total: allUsers.length,
        admins: allUsers.filter(user => user.role === 'admin').length,
        users: allUsers.filter(user => user.role === 'user').length,
        newThisMonth: allUsers.filter(user => {
          const userDate = new Date(user.createdAt);
          const now = new Date();
          const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          return userDate >= thisMonth;
        }).length
      };
      setStats(newStats);
      setError('');
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to "${newRole}"?`)) {
      return;
    }

    setUpdatingRole(prev => ({ ...prev, [userId]: true }));

    try {
      await usersAPI.updateRole(userId, newRole);
      await fetchUsers();
      
      if (selectedUser?._id === userId) {
        setSelectedUser(prev => ({ ...prev, role: newRole }));
      }
      
      setError('✅ User role updated successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('Failed to update user role:', error);
      setError(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingRole(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (user?.id === userId || user?._id === userId) {
      setError('❌ You cannot delete your own account');
      setTimeout(() => setError(''), 5000);
      return;
    }

    const confirmMessage = `Are you sure you want to delete user "${userName}"?\n\nThis action cannot be undone and will:\n• Permanently remove the user account\n• Remove all user data\n• Cancel any pending orders\n\nType "DELETE" to confirm:`;
    
    const userConfirmation = window.prompt(confirmMessage);
    
    if (userConfirmation !== 'DELETE') {
      return;
    }

    setDeletingUser(prev => ({ ...prev, [userId]: true }));

    try {
      await usersAPI.delete(userId);
      await fetchUsers();
      
      if (selectedUser?._id === userId) {
        setShowDetailsModal(false);
        setSelectedUser(null);
      }
      
      setError('✅ User deleted successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('Failed to delete user:', error);
      
      let errorMessage = 'Failed to delete user';
      
      if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to delete users';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setError(`❌ ${errorMessage}`);
    } finally {
      setDeletingUser(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilter) => {
    setRoleFilter(newFilter);
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

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: '#8b5cf6',
      user: '#3b82f6'
    };
    return colors[role] || '#6b7280';
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: '👨‍💼',
      user: '👤'
    };
    return icons[role] || '👤';
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

  const filteredUsers = users.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }

    if (!searchTerm.trim()) {
      return true;
    }

    const search = searchTerm.trim().toLowerCase();
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    const username = (user.username || '').toLowerCase();

    return (
      fullName.includes(search) ||
      email.includes(search) ||
      username.includes(search)
    );
  });

  return (
    <div className="admin-users">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">👥 User Management</h1>
            <p className="page-subtitle">
              Manage user accounts and permissions • {filteredUsers.length} of {stats.total} users
            </p>
          </div>
          <div className="header-actions">
            <button 
              onClick={fetchUsers}
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
          <div className="stat-card total">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>

          <div className="stat-card admins">
            <div className="stat-icon">👨‍💼</div>
            <div className="stat-content">
              <div className="stat-number">{stats.admins}</div>
              <div className="stat-label">Administrators</div>
            </div>
          </div>

          <div className="stat-card users">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <div className="stat-number">{stats.users}</div>
              <div className="stat-label">Regular Users</div>
            </div>
          </div>

          <div className="stat-card new">
            <div className="stat-icon">🆕</div>
            <div className="stat-content">
              <div className="stat-number">{stats.newThisMonth}</div>
              <div className="stat-label">New This Month</div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-container">
            <div className="filter-group">
              <label className="filter-label">🔍 Search Users</label>
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label className="filter-label">👥 Role Filter</label>
              <div className="role-tabs">
                <button
                  className={`role-tab ${roleFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  🌟 All ({stats.total})
                </button>
                <button
                  className={`role-tab ${roleFilter === 'admin' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('admin')}
                >
                  👨‍💼 Admins ({stats.admins})
                </button>
                <button
                  className={`role-tab ${roleFilter === 'user' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('user')}
                >
                  👤 Users ({stats.users})
                </button>
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">📅 Sort By</label>
              <div className="sort-options">
                <button
                  className={`sort-btn ${sortBy === 'createdAt' ? 'active' : ''}`}
                  onClick={() => handleSortChange('createdAt')}
                >
                  📅 Join Date {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  className={`sort-btn ${sortBy === 'firstName' ? 'active' : ''}`}
                  onClick={() => handleSortChange('firstName')}
                >
                  👤 Name {sortBy === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
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

        {/* Users Table */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading users...</p>
          </div>
        ) : (
          <div className="users-table-container">
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Join Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(userItem => (
                    <tr key={userItem._id} className="user-row">
                      <td className="user-info">
                        <div className="user-details">
                          <div className="user-avatar">
                            {userItem.firstName?.charAt(0) || '?'}{userItem.lastName?.charAt(0) || ''}
                          </div>
                          <div className="user-text">
                            <div className="user-name">
                              {userItem.firstName} {userItem.lastName}
                            </div>
                            <div className="user-id">
                              ID: {userItem._id.slice(-8).toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="user-username">
                        @{userItem.username}
                      </td>
                      <td className="user-email">
                        {userItem.email}
                      </td>
                      <td className="user-role">
                        <span 
                          className="role-badge"
                          style={{ backgroundColor: getRoleColor(userItem.role) }}
                        >
                          {getRoleIcon(userItem.role)} {userItem.role}
                        </span>
                      </td>
                      <td className="user-date">
                        {formatDate(userItem.createdAt)}
                      </td>
                      <td className="user-actions">
                        <div className="action-buttons">
                          <button
                            onClick={() => openUserDetails(userItem)}
                            className="btn btn-sm btn-primary action-btn"
                            title="View details"
                          >
                            👁️
                          </button>
                          <select
                            value={userItem.role}
                            onChange={(e) => handleRoleUpdate(userItem._id, e.target.value)}
                            className="role-select"
                            disabled={updatingRole[userItem._id] || deletingUser[userItem._id]}
                          >
                            <option value="user">👤 User</option>
                            <option value="admin">👨‍💼 Admin</option>
                          </select>
                          <button
                            onClick={() => handleDeleteUser(userItem._id, `${userItem.firstName} ${userItem.lastName}`)}
                            className="btn btn-sm btn-error action-btn delete-btn"
                            disabled={deletingUser[userItem._id] || updatingRole[userItem._id] || (user?.id === userItem._id || user?._id === userItem._id)}
                            title={user?.id === userItem._id || user?._id === userItem._id ? "Cannot delete your own account" : "Delete user"}
                          >
                            {deletingUser[userItem._id] ? (
                              <span className="spinner-sm"></span>
                            ) : (
                              '🗑️'
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>No users found</h3>
                  <p>Try adjusting your filters or check back later.</p>
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

        {/* User Details Modal */}
        {showDetailsModal && selectedUser && (
          <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
            <div className="modal user-details-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>👤 User Details</h2>
                <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="modal-close"
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="user-header-details">
                  <div className="user-avatar-large">
                    {selectedUser.firstName?.charAt(0) || '?'}{selectedUser.lastName?.charAt(0) || ''}
                  </div>
                  <div className="user-info-grid">
                    <div className="info-item">
                      <label>Full Name:</label>
                      <span>{selectedUser.firstName} {selectedUser.lastName}</span>
                    </div>
                    <div className="info-item">
                      <label>Username:</label>
                      <span>@{selectedUser.username}</span>
                    </div>
                    <div className="info-item">
                      <label>Email:</label>
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Role:</label>
                      <span 
                        className="role-badge"
                        style={{ backgroundColor: getRoleColor(selectedUser.role) }}
                      >
                        {getRoleIcon(selectedUser.role)} {selectedUser.role}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>User ID:</label>
                      <span className="user-id-display">
                        {selectedUser._id}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>Member Since:</label>
                      <span>{formatDate(selectedUser.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {selectedUser.address && (
                  <div className="section">
                    <h3>📍 Address Information</h3>
                    <div className="address-display">
                      {selectedUser.address}
                    </div>
                  </div>
                )}

                <div className="section">
                  <h3>⚙️ Account Management</h3>
                  <div className="account-actions">
                    <div className="action-group">
                      <label>Change Role:</label>
                      <select
                        value={selectedUser.role}
                        onChange={(e) => handleRoleUpdate(selectedUser._id, e.target.value)}
                        className="role-select-modal"
                        disabled={updatingRole[selectedUser._id]}
                      >
                        <option value="user">👤 Regular User</option>
                        <option value="admin">👨‍💼 Administrator</option>
                      </select>
                    </div>
                  </div>
                </div>

                {selectedUser && selectedUser._id !== user?.id && selectedUser._id !== user?._id && (
                  <div className="section">
                    <h3>⚠️ Danger Zone</h3>
                    <div className="danger-zone">
                      <p>Permanently delete this user account. This action cannot be undone.</p>
                      <button
                        onClick={() => {
                          handleDeleteUser(selectedUser._id, `${selectedUser.firstName} ${selectedUser.lastName}`);
                          setShowDetailsModal(false);
                        }}
                        className="btn btn-error"
                        disabled={deletingUser[selectedUser._id]}
                      >
                        {deletingUser[selectedUser._id] ? (
                          <>
                            <span className="spinner-sm"></span>
                            Deleting...
                          </>
                        ) : (
                          '🗑️ Delete User'
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div className="section">
                  <h3>📊 Account Statistics</h3>
                  <div className="stats-display">
                    <div className="stat-item">
                      <span className="stat-label">Account Age:</span>
                      <span className="stat-value">
                        {Math.floor((new Date() - new Date(selectedUser.createdAt)) / (1000 * 60 * 60 * 24))} days
                      </span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Account Status:</span>
                      <span className="stat-value status-active">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}