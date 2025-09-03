import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getTotalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const cartItemCount = getTotalItems();

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={() => setIsMenuOpen(false)}>
          <span className="logo-icon">📚</span>
          <span className="logo-text">BookStore</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-menu">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            🏠 Home
          </Link>
          <Link 
            to="/books" 
            className={`nav-link ${isActive('/books') ? 'active' : ''}`}
          >
            📚 Books
          </Link>
          
          {isAuthenticated() && (
            <Link 
              to="/orders" 
              className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
            >
              📋 My Orders
            </Link>
          )}

          {isAdmin() && (
            <Link 
              to="/admin" 
              className={`nav-link admin-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
            >
              👨‍💼 Admin
            </Link>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="nav-actions">
          {isAuthenticated() ? (
            <>
              {/* Cart */}
              <Link to="/cart" className="cart-button">
                🛒
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </Link>

              {/* User Menu */}
              <div className="user-menu">
                <button 
                  className="user-button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="user-avatar">
                    {user?.firstName?.charAt(0) || '👤'}
                  </span>
                  <span className="user-name">
                    {user?.firstName || 'User'}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {isMenuOpen && (
                  <div className="dropdown-menu">
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      👤 Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="dropdown-item"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📋 My Orders
                    </Link>
                    {isAdmin() && (
                      <>
                        <div className="dropdown-divider"></div>
                        <Link 
                          to="/admin" 
                          className="dropdown-item admin-item"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          ⚙️ Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary btn-sm">
                🔐 Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                🚀 Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link 
            to="/" 
            className="mobile-link"
            onClick={() => setIsMenuOpen(false)}
          >
            🏠 Home
          </Link>
          <Link 
            to="/books" 
            className="mobile-link"
            onClick={() => setIsMenuOpen(false)}
          >
            📚 Books
          </Link>
          
          {isAuthenticated() ? (
            <>
              <Link 
                to="/cart" 
                className="mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                🛒 Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
              <Link 
                to="/orders" 
                className="mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                📋 My Orders
              </Link>
              <Link 
                to="/profile" 
                className="mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                👤 Profile
              </Link>
              {isAdmin() && (
                <Link 
                  to="/admin" 
                  className="mobile-link admin-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  👨‍💼 Admin Panel
                </Link>
              )}
              <button 
                className="mobile-link logout-button"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                🔐 Login
              </Link>
              <Link 
                to="/register" 
                className="mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                🚀 Sign Up
              </Link>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--text-primary);
          font-weight: 800;
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }

        .nav-logo:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          font-size: 2rem;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .nav-link {
          text-decoration: none;
          color: var(--text-secondary);
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          color: var(--primary-color);
          background: rgba(102, 126, 234, 0.1);
        }

        .nav-link.active {
          color: var(--primary-color);
          background: rgba(102, 126, 234, 0.15);
        }

        .admin-link {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white !important;
        }

        .admin-link:hover {
          background: linear-gradient(45deg, #5a6fd8, #6a4190);
          color: white !important;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .cart-button {
          position: relative;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .cart-button:hover {
          transform: scale(1.1);
          background: var(--secondary-color);
        }

        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--error-color);
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .user-menu {
          position: relative;
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: 10px;
          background: white;
          border: 2px solid var(--border-color);
          border-radius: 25px;
          padding: 8px 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-button:hover {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .user-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--primary-color);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .dropdown-arrow {
          color: var(--text-secondary);
          font-size: 0.8rem;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          padding: 8px 0;
          min-width: 200px;
          z-index: 1000;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: block;
          padding: 12px 20px;
          color: var(--text-primary);
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: var(--bg-accent);
          color: var(--primary-color);
        }

        .admin-item {
          color: var(--primary-color);
          font-weight: 600;
        }

        .logout-item {
          color: var(--error-color);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-color);
          margin: 8px 0;
        }

        .auth-buttons {
          display: flex;
          gap: 10px;
        }

        .mobile-menu-button {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }

        .hamburger {
          width: 25px;
          height: 3px;
          background: var(--text-primary);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .mobile-menu {
          display: none;
          background: white;
          border-top: 1px solid var(--border-color);
          padding: 20px;
        }

        .mobile-link {
          display: block;
          padding: 15px 0;
          color: var(--text-primary);
          text-decoration: none;
          border-bottom: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }

        .mobile-link:hover {
          color: var(--primary-color);
          padding-left: 10px;
        }

        .logout-button {
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          color: var(--error-color);
        }

        @media (max-width: 768px) {
          .nav-menu {
            display: none;
          }

          .nav-actions {
            display: none;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-menu {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
}