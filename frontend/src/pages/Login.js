import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to intended page after login
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Success! Redirect to intended page
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setFormData({
        email: 'admin@bookstore.com',
        password: 'admin123'
      });
    } else {
      setFormData({
        email: 'john@example.com',
        password: 'user123'
      });
    }
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Sign in to your BookStore account</p>
          </div>

          {/* Demo Credentials */}
          <div className="demo-section">
            <p className="demo-title">🚀 Quick Demo Login:</p>
            <div className="demo-buttons">
              <button 
                type="button"
                className="demo-btn admin-demo"
                onClick={() => fillDemoCredentials('admin')}
              >
                👨‍💼 Admin Demo
              </button>
              <button 
                type="button"
                className="demo-btn user-demo"
                onClick={() => fillDemoCredentials('user')}
              >
                👤 User Demo
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="alert alert-error">
                ⚠️ {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                📧 Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                🔒 Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : (
                <>
                  🚀 Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="link">
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {/* Side Info */}
        <div className="login-info">
          <div className="info-content">
            <h2 className="info-title">📚 Join Our Community</h2>
            <div className="info-features">
              <div className="feature">
                <span className="feature-icon">🔍</span>
                <span className="feature-text">Browse thousands of books</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🛒</span>
                <span className="feature-text">Easy online ordering</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <span className="feature-text">Fast delivery</span>
              </div>
              <div className="feature">
                <span className="feature-icon">⭐</span>
                <span className="feature-text">Customer reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        }

        .login-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          max-width: 1000px;
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

        .login-card {
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .login-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .login-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .login-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .login-subtitle {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .demo-section {
          background: linear-gradient(45deg, #f093fb 0%, #f5576c 20%, #4facfe 40%, #00f2fe 100%);
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 30px;
          text-align: center;
        }

        .demo-title {
          color: white;
          font-weight: 600;
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .demo-buttons {
          display: flex;
          gap: 10px;
        }

        .demo-btn {
          flex: 1;
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.9);
          color: var(--text-primary);
        }

        .demo-btn:hover {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .admin-demo {
          border-left: 4px solid var(--primary-color);
        }

        .user-demo {
          border-left: 4px solid var(--success-color);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
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

        .login-btn {
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

        .login-footer {
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

        .login-info {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px;
          position: relative;
          overflow: hidden;
        }

        .login-info::before {
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
          gap: 20px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .feature:hover {
          transform: translateX(10px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          font-size: 1.5rem;
          width: 40px;
          text-align: center;
        }

        .feature-text {
          font-weight: 600;
          color: var(--text-primary);
        }

        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr;
            margin: 0 10px;
          }

          .login-card {
            padding: 40px 30px;
          }

          .login-info {
            padding: 30px;
            order: -1;
          }

          .demo-buttons {
            flex-direction: column;
          }

          .info-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}