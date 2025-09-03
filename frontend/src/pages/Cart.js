import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice, 
    getTotalItems,
    clearCart 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updatingItems, setUpdatingItems] = useState({});

  const handleQuantityChange = async (bookId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => ({ ...prev, [bookId]: true }));
    
    try {
      updateQuantity(bookId, newQuantity);
      setTimeout(() => {
        setUpdatingItems(prev => ({ ...prev, [bookId]: false }));
      }, 300);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      setUpdatingItems(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const handleRemoveItem = (bookId) => {
    removeFromCart(bookId);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart();
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h1>Your Cart is Empty</h1>
            <p>Looks like you haven't added any books to your cart yet.</p>
            <div className="empty-cart-actions">
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
          .cart-page {
            min-height: 100vh;
            padding: 40px 0;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            display: flex;
            align-items: center;
          }

          .empty-cart {
            text-align: center;
            color: white;
            max-width: 500px;
            margin: 0 auto;
          }

          .empty-cart-icon {
            font-size: 5rem;
            margin-bottom: 30px;
            opacity: 0.8;
          }

          .empty-cart h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
          }

          .empty-cart p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.9;
          }

          .empty-cart-actions {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
          }

          @media (max-width: 768px) {
            .empty-cart h1 {
              font-size: 2rem;
            }

            .empty-cart-actions {
              flex-direction: column;
              align-items: center;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">🛒 Shopping Cart</h1>
          <p className="page-subtitle">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-header">
              <h2>📚 Your Books</h2>
              <button 
                onClick={handleClearCart}
                className="clear-cart-btn"
              >
                🗑️ Clear Cart
              </button>
            </div>

            <div className="items-list">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <Link to={`/books/${item.id}`}>
                      <img src={item.imageUrl} alt={item.title} />
                    </Link>
                  </div>

                  <div className="item-details">
                    <Link to={`/books/${item.id}`} className="item-title">
                      {item.title}
                    </Link>
                    <p className="item-author">by {item.author}</p>
                    <p className="item-price">€{item.price.toFixed(2)} each</p>
                    
                    {/* Stock Warning */}
                    {item.quantity > item.stock && (
                      <div className="stock-warning">
                        ⚠️ Only {item.stock} available in stock
                      </div>
                    )}
                  </div>

                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updatingItems[item.id]}
                      >
                        −
                      </button>
                      
                      <div className="quantity-display">
                        {updatingItems[item.id] ? (
                          <span className="spinner-sm"></span>
                        ) : (
                          item.quantity
                        )}
                      </div>
                      
                      <button
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock || updatingItems[item.id]}
                      >
                        +
                      </button>
                    </div>

                    <div className="item-subtotal">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove from cart"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3 className="summary-title">📋 Order Summary</h3>
              
              <div className="summary-details">
                <div className="summary-row">
                  <span>Items ({totalItems})</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-shipping">FREE 🚚</span>
                </div>
                
                <div className="summary-divider"></div>
                
                <div className="summary-row total">
                  <span>Total</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="summary-actions">
                <button
                  onClick={handleCheckout}
                  className="btn btn-primary btn-lg checkout-btn"
                >
                  💳 Proceed to Checkout
                </button>
                
                <Link to="/books" className="btn btn-secondary">
                  ← Continue Shopping
                </Link>
              </div>

              {/* Security Badge */}
              <div className="security-badge">
                <span className="security-icon">🔒</span>
                <span className="security-text">Secure Checkout</span>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="shipping-info">
              <h4>🚚 Shipping Information</h4>
              <ul>
                <li>✅ Free shipping on all orders</li>
                <li>📦 Standard delivery: 3-5 business days</li>
                <li>🔄 Easy returns within 30 days</li>
                <li>📞 24/7 customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page {
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

        .cart-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 40px;
          align-items: start;
        }

        .cart-items {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--border-color);
        }

        .cart-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .clear-cart-btn {
          background: var(--error-color);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .clear-cart-btn:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 100px 1fr auto;
          gap: 20px;
          padding: 20px;
          border: 2px solid var(--border-color);
          border-radius: 15px;
          transition: all 0.3s ease;
        }

        .cart-item:hover {
          border-color: var(--primary-color);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.1);
        }

        .item-image {
          width: 100px;
          height: 120px;
          border-radius: 10px;
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .item-image:hover img {
          transform: scale(1.05);
        }

        .item-details {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .item-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          text-decoration: none;
          margin-bottom: 8px;
          transition: color 0.3s ease;
        }

        .item-title:hover {
          color: var(--primary-color);
        }

        .item-author {
          color: var(--text-secondary);
          margin-bottom: 5px;
        }

        .item-price {
          color: var(--success-color);
          font-weight: 600;
          font-size: 1.1rem;
        }

        .stock-warning {
          background: #fef2f2;
          color: var(--error-color);
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-top: 10px;
        }

        .item-controls {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }

        .quantity-btn {
          width: 35px;
          height: 35px;
          border: none;
          background: var(--bg-secondary);
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: 700;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quantity-btn:hover:not(:disabled) {
          background: var(--primary-color);
          color: white;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-display {
          width: 50px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-left: 1px solid var(--border-color);
          border-right: 1px solid var(--border-color);
          font-weight: 600;
        }

        .item-subtotal {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--primary-color);
        }

        .remove-btn {
          background: var(--error-color);
          color: white;
          border: none;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .remove-btn:hover {
          background: #dc2626;
          transform: scale(1.1);
        }

        .cart-summary {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .summary-card {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 100px;
        }

        .summary-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 25px;
          text-align: center;
        }

        .summary-details {
          margin-bottom: 25px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          font-size: 1rem;
        }

        .summary-row.total {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--primary-color);
        }

        .free-shipping {
          color: var(--success-color);
          font-weight: 600;
        }

        .summary-divider {
          height: 2px;
          background: var(--border-color);
          margin: 20px 0;
        }

        .summary-actions {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .checkout-btn {
          background: linear-gradient(45deg, var(--success-color), #059669);
          font-size: 1.1rem;
          padding: 15px;
        }

        .security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
          padding: 15px;
          background: #f0fdf4;
          border-radius: 10px;
          color: var(--success-color);
          font-weight: 600;
        }

        .security-icon {
          font-size: 1.2rem;
        }

        .shipping-info {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 25px;
          color: white;
        }

        .shipping-info h4 {
          margin-bottom: 15px;
          font-size: 1.1rem;
        }

        .shipping-info ul {
          list-style: none;
          padding: 0;
        }

        .shipping-info li {
          margin-bottom: 10px;
          font-size: 0.95rem;
          opacity: 0.9;
        }

        .spinner-sm {
          width: 16px;
          height: 16px;
          border: 2px solid var(--border-color);
          border-top: 2px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .cart-layout {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .cart-item {
            grid-template-columns: 80px 1fr;
            grid-template-rows: auto auto;
            gap: 15px;
          }

          .item-controls {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: space-between;
          }

          .page-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}