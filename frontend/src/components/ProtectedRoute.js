import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Verifying access...</p>
        </div>

        <style jsx>{`
          .protected-route-loading {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
          }

          .loading-container {
            text-align: center;
            padding: 40px;
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

          .loading-container p {
            font-size: 1.2rem;
            opacity: 0.9;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login with the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if admin access is required
  if (adminOnly && !isAdmin()) {
    return (
      <div className="access-denied">
        <div className="access-denied-container">
          <div className="access-denied-icon">🚫</div>
          <h1>Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <div className="access-denied-info">
            <div className="user-info">
              <span className="user-avatar">
                {user?.firstName?.charAt(0) || '👤'}
              </span>
              <div className="user-details">
                <span className="user-name">{user?.firstName} {user?.lastName}</span>
                <span className="user-role">Role: {user?.role}</span>
              </div>
            </div>
            <p className="requirement">This page requires administrator privileges.</p>
          </div>
          <div className="access-denied-actions">
            <button 
              onClick={() => window.history.back()}
              className="btn btn-secondary"
            >
              ← Go Back
            </button>
            <a href="/" className="btn btn-primary">
              🏠 Go Home
            </a>
          </div>
        </div>

        <style jsx>{`
          .access-denied {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            color: white;
            padding: 20px;
          }

          .access-denied-container {
            text-align: center;
            max-width: 500px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }

          .access-denied-icon {
            font-size: 5rem;
            margin-bottom: 30px;
            opacity: 0.9;
          }

          .access-denied-container h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
          }

          .access-denied-container > p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            opacity: 0.9;
          }

          .access-denied-info {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 25px;
            margin: 30px 0;
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
            justify-content: center;
            margin-bottom: 20px;
          }

          .user-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: white;
            color: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 1.2rem;
          }

          .user-details {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }

          .user-name {
            font-weight: 600;
            font-size: 1.1rem;
          }

          .user-role {
            font-size: 0.9rem;
            opacity: 0.8;
            text-transform: capitalize;
          }

          .requirement {
            font-size: 1rem;
            opacity: 0.9;
            margin: 0;
          }

          .access-denied-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.3s ease;
            min-height: 44px;
          }

          .btn-primary {
            background: white;
            color: var(--primary-color);
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
          }

          .btn-secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }

          @media (max-width: 768px) {
            .access-denied-container {
              margin: 10px;
              padding: 30px 20px;
            }

            .access-denied-container h1 {
              font-size: 2rem;
            }

            .user-info {
              flex-direction: column;
              gap: 10px;
            }

            .user-details {
              align-items: center;
              text-align: center;
            }

            .access-denied-actions {
              flex-direction: column;
              align-items: center;
            }

            .btn {
              width: 100%;
              max-width: 200px;
            }
          }
        `}</style>
      </div>
    );
  }

  // User is authenticated and has required permissions
  return children;
}