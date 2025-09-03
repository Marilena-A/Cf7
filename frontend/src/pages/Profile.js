import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';

export default function Profile() {
  const { user, getCurrentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' only (security removed)

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  const validateProfileForm = () => {
    const errors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Address validation (optional but if provided, should be meaningful)
    if (formData.address.trim() && formData.address.trim().length < 10) {
      errors.address = 'Please provide a complete address';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        ...(formData.address.trim() && { address: formData.address.trim() })
      };

      await usersAPI.updateProfile(updateData);
      
      // Refresh user data
      await getCurrentUser();
      
      setSuccess('✅ Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 409) {
        setError('Username or email already exists');
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelEditing = () => {
    // Reset form data to original user data
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      address: user.address || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setIsEditing(false);
    setError('');
    setSuccess('');
    setFieldErrors({});
  };

  // Fixed date formatting function
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Not available';
      
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Not available';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Not available';
    }
  };

  // Helper function to get member duration
  const getMemberDuration = (dateString) => {
    try {
      if (!dateString) return 'Unknown';
      
      const joinDate = new Date(dateString);
      if (isNaN(joinDate.getTime())) return 'Unknown';
      
      const now = new Date();
      const diffTime = Math.abs(now - joinDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        return `${diffDays} days`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} month${months > 1 ? 's' : ''}`;
      } else {
        const years = Math.floor(diffDays / 365);
        const remainingMonths = Math.floor((diffDays % 365) / 30);
        if (remainingMonths > 0) {
          return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
        }
        return `${years} year${years > 1 ? 's' : ''}`;
      }
    } catch (error) {
      console.error('Error calculating member duration:', error);
      return 'Unknown';
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">🔐</div>
            <h1>Access Denied</h1>
            <p>Please log in to view your profile</p>
            <Link to="/login" className="btn btn-primary btn-lg">
              🔐 Login
            </Link>
          </div>
        </div>

        <style jsx>{`
          .profile-page {
            min-height: 100vh;
            padding: 40px 0;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            display: flex;
            align-items: center;
          }

          .error-state {
            text-align: center;
            color: white;
            max-width: 500px;
            margin: 0 auto;
          }

          .error-icon {
            font-size: 5rem;
            margin-bottom: 30px;
            opacity: 0.8;
          }

          .error-state h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
          }

          .error-state p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.9;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="profile-avatar">
            <span className="avatar-text">
              {user.firstName?.charAt(0) || '👤'}{user.lastName?.charAt(0) || ''}
            </span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.firstName} {user.lastName}</h1>
            <p className="profile-username">@{user.username}</p>
            <div className="profile-meta">
              <span className="role-badge">{user.role}</span>
              {user.createdAt && (
                <span className="join-info">
                  Member for {getMemberDuration(user.createdAt)}
                </span>
              )}
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary edit-btn"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
            <button onClick={() => setError('')} className="alert-close">✕</button>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
            <button onClick={() => setSuccess('')} className="alert-close">✕</button>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile Information
            </button>
            {/* Security tab hidden - password change not implemented in backend */}
          </div>
        </div>

        {/* Content */}
        <div className="profile-content">
          <div className="profile-section">
            <div className="section-card">
              <h2 className="section-title">👤 Personal Information</h2>
              
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`form-input ${fieldErrors.firstName ? 'error' : ''}`}
                        placeholder="Enter your first name"
                        required
                      />
                      {fieldErrors.firstName && (
                        <span className="form-error">{fieldErrors.firstName}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`form-input ${fieldErrors.lastName ? 'error' : ''}`}
                        placeholder="Enter your last name"
                        required
                      />
                      {fieldErrors.lastName && (
                        <span className="form-error">{fieldErrors.lastName}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Username *</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                        placeholder="Choose a unique username"
                        required
                      />
                      {fieldErrors.username && (
                        <span className="form-error">{fieldErrors.username}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                        placeholder="Enter your email"
                        required
                      />
                      {fieldErrors.email && (
                        <span className="form-error">{fieldErrors.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Address (Optional)</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`form-input ${fieldErrors.address ? 'error' : ''}`}
                      placeholder="Your shipping address"
                      rows="3"
                    />
                    {fieldErrors.address && (
                      <span className="form-error">{fieldErrors.address}</span>
                    )}
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-sm"></span>
                          Saving...
                        </>
                      ) : (
                        '💾 Save Changes'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-display">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>First Name:</label>
                      <span>{user.firstName}</span>
                    </div>
                    <div className="info-item">
                      <label>Last Name:</label>
                      <span>{user.lastName}</span>
                    </div>
                    <div className="info-item">
                      <label>Username:</label>
                      <span>@{user.username}</span>
                    </div>
                    <div className="info-item">
                      <label>Email:</label>
                      <span>{user.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Role:</label>
                      <span className="role-display">{user.role}</span>
                    </div>
                    {user.createdAt && (
                      <div className="info-item">
                        <label>Member Since:</label>
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    )}
                    {user.address && (
                      <div className="info-item address-item">
                        <label>Address:</label>
                        <span>{user.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2 className="section-title">⚡ Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/orders" className="action-card">
              <div className="action-icon">📋</div>
              <div className="action-content">
                <h3>My Orders</h3>
                <p>View your order history and track shipments</p>
              </div>
            </Link>

            <Link to="/cart" className="action-card">
              <div className="action-icon">🛒</div>
              <div className="action-content">
                <h3>Shopping Cart</h3>
                <p>Review items in your cart and checkout</p>
              </div>
            </Link>

            <Link to="/books" className="action-card">
              <div className="action-icon">📚</div>
              <div className="action-content">
                <h3>Browse Books</h3>
                <p>Discover new books and add to your collection</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          padding: 40px 0;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        }

        .page-header {
          display: flex;
          align-items: center;
          gap: 25px;
          margin-bottom: 30px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          color: white;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-color);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .avatar-text {
          text-transform: uppercase;
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 5px;
        }

        .profile-username {
          font-size: 1.2rem;
          opacity: 0.8;
          margin-bottom: 10px;
        }

        .profile-meta {
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }

        .role-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 6px 15px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
        }

        .join-info {
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .edit-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }

        .edit-btn:hover {
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

        .tabs-container {
          margin-bottom: 30px;
        }

        .tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 5px;
          gap: 5px;
        }

        .tab {
          flex: 1;
          padding: 15px 20px;
          border: none;
          border-radius: 10px;
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .tab:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .tab.active {
          background: white;
          color: var(--primary-color);
        }

        .profile-content {
          margin-bottom: 40px;
        }

        .section-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 25px;
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 15px;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .profile-display {
          animation: fadeIn 0.3s ease;
        }

        .info-grid {
          display: grid;
          gap: 20px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-item label {
          font-weight: 600;
          color: var(--text-secondary);
          min-width: 120px;
        }

        .info-item span {
          font-weight: 600;
          color: var(--text-primary);
          text-align: right;
        }

        .role-display {
          background: var(--primary-color);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        .address-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .address-item span {
          text-align: left;
          background: var(--bg-secondary);
          padding: 10px;
          border-radius: 8px;
          width: 100%;
        }

        .quick-actions {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
        }

        .quick-actions .section-title {
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

        .action-content h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 5px;
        }

        .action-content p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .spinner-sm {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }

          .profile-meta {
            justify-content: center;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            justify-content: stretch;
          }

          .form-actions button {
            flex: 1;
          }

          .info-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
          }

          .info-item span {
            text-align: left;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .tabs {
            flex-direction: column;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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