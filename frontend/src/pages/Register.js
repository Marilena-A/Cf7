import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to intended page after registration
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};

    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])/.test(formData.password) && !/(?=.*[A-Z])/.test(formData.password) && !/(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one letter and one number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Address validation (optional but if provided, should be meaningful)
    if (formData.address.trim() && formData.address.trim().length < 10) {
      errors.address = 'Please provide a complete address';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: 'user', // Explicitly set role
        ...(formData.address.trim() && { address: formData.address.trim() }) // Only include if provided
      };

      console.log('Attempting to register user:', { ...userData, password: '[HIDDEN]' });
      
      const result = await register(userData);
      
      console.log('Registration result:', result);
      
      if (result.success) {
        console.log('Registration successful, redirecting...');
        // Success! Redirect to intended page
        navigate(from, { replace: true });
      } else {
        console.error('Registration failed:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('Registration error caught:', err);
      
      // Handle different types of errors
      if (err.response?.data?.message) {
        // Backend returned a specific error message
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Backend returned validation errors array
        const errorMessages = err.response.data.errors.map(error => error.msg).join(', ');
        setError(errorMessages);
      } else if (err.response?.status === 400) {
        setError('Registration failed. Please check your information and try again.');
      } else if (err.response?.status === 409) {
        setError('User with this email or username already exists');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '', color: '#e5e7eb' };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    const levels = [
      { text: 'Very Weak', color: '#ef4444' },
      { text: 'Weak', color: '#f59e0b' },
      { text: 'Fair', color: '#eab308' },
      { text: 'Good', color: '#22c55e' },
      { text: 'Strong', color: '#16a34a' },
      { text: 'Very Strong', color: '#15803d' }
    ];

    return { score, ...levels[Math.min(score, 5)] };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          {/* Header */}
          <div className="register-header">
            <div className="register-icon">🚀</div>
            <h1 className="register-title">Join BookStore</h1>
            <p className="register-subtitle">Create your account and start your reading journey</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="register-form">
            {error && (
              <div className="alert alert-error">
                ⚠️ {error}
              </div>
            )}

            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  👤 First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input ${fieldErrors.firstName ? 'error' : ''}`}
                  placeholder="Enter your first name"
                  required
                  autoComplete="given-name"
                />
                {fieldErrors.firstName && (
                  <span className="form-error">{fieldErrors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  👤 Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-input ${fieldErrors.lastName ? 'error' : ''}`}
                  placeholder="Enter your last name"
                  required
                  autoComplete="family-name"
                />
                {fieldErrors.lastName && (
                  <span className="form-error">{fieldErrors.lastName}</span>
                )}
              </div>
            </div>

            {/* Username */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                👤 Username *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-input ${fieldErrors.username ? 'error' : ''}`}
                placeholder="Choose a unique username"
                required
                autoComplete="username"
              />
              {fieldErrors.username && (
                <span className="form-error">{fieldErrors.username}</span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                📧 Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
                required
                autoComplete="email"
              />
              {fieldErrors.email && (
                <span className="form-error">{fieldErrors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                🔒 Password *
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ 
                        width: `${(passwordStrength.score / 6) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }}
                    ></div>
                  </div>
                  <span 
                    className="strength-text"
                    style={{ color: passwordStrength.color }}
                  >
                    {passwordStrength.text}
                  </span>
                </div>
              )}
              
              {fieldErrors.password && (
                <span className="form-error">{fieldErrors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                🔒 Confirm Password *
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <span className="form-error">{fieldErrors.confirmPassword}</span>
              )}
            </div>

            {/* Address (Optional) */}
            <div className="form-group">
              <label htmlFor="address" className="form-label">
                📍 Address (Optional)
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`form-input ${fieldErrors.address ? 'error' : ''}`}
                placeholder="Your shipping address (can be added later)"
                rows="3"
                autoComplete="street-address"
              />
              {fieldErrors.address && (
                <span className="form-error">{fieldErrors.address}</span>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="terms-section">
              <p className="terms-text">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="terms-link">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="terms-link">Privacy Policy</Link>
              </p>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg register-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  🚀 Create Account
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="register-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Side Info */}
        <div className="register-info">
          <div className="info-content">
            <h2 className="info-title">🌟 Why Join BookStore?</h2>
            <div className="info-features">
              <div className="feature">
                <span className="feature-icon">📚</span>
                <div className="feature-content">
                  <h3>Vast Collection</h3>
                  <p>Access thousands of books across all genres</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <div className="feature-content">
                  <h3>Free Shipping</h3>
                  <p>Free delivery on all orders, anywhere</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">💳</span>
                <div className="feature-content">
                  <h3>Secure Payments</h3>
                  <p>Safe and encrypted payment processing</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">⭐</span>
                <div className="feature-content">
                  <h3>Reviews & Ratings</h3>
                  <p>Read reviews from fellow book lovers</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">📱</span>
                <div className="feature-content">
                  <h3>Mobile Friendly</h3>
                  <p>Shop seamlessly on any device</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <div className="feature-content">
                  <h3>Personalized</h3>
                  <p>Get recommendations based on your interests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        }

        .register-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1200px;
          width: 100%;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.6s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .register-card {
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          max-height: 90vh;
          overflow-y: auto;
        }

        .register-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .register-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .register-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .register-subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .password-input-container {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          opacity: 0.6;
          transition: opacity 0.3s ease;
        }

        .password-toggle:hover {
          opacity: 1;
        }

        .password-strength {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .strength-bar {
          flex: 1;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
        }

        .strength-text {
          font-size: 0.8rem;
          font-weight: 600;
          min-width: 80px;
        }

        .terms-section {
          background: var(--bg-accent);
          padding: 15px;
          border-radius: 10px;
          margin: 10px 0;
        }

        .terms-text {
          font-size: 0.9rem;
          color: var(--text-secondary);
          text-align: center;
          margin: 0;
        }

        .terms-link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
        }

        .terms-link:hover {
          text-decoration: underline;
        }

        .register-btn {
          margin-top: 10px;
          position: relative;
          overflow: hidden;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }

        .register-footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
        }

        .link {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .link:hover {
          color: var(--secondary-color);
          text-decoration: underline;
        }

        .register-info {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px;
          position: relative;
          overflow: hidden;
        }

        .register-info::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📚</text></svg>') repeat;
          opacity: 0.03;
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        .info-content {
          position: relative;
          z-index: 1;
          width: 100%;
        }

        .info-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 30px;
          text-align: center;
        }

        .info-features {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .feature {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .feature:hover {
          transform: translateX(10px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          font-size: 2rem;
          width: 50px;
          text-align: center;
          flex-shrink: 0;
        }

        .feature-content h3 {
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 5px;
          font-size: 1.1rem;
        }

        .feature-content p {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .register-container {
            grid-template-columns: 1fr;
            margin: 0 10px;
          }

          .register-card {
            padding: 40px 30px;
          }

          .register-info {
            padding: 30px;
            order: -1;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .info-title {
            font-size: 1.5rem;
          }

          .register-title {
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