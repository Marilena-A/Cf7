import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

export default function Checkout() {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState({
    shippingAddress: user?.address || '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Review, 2: Shipping, 3: Processing, 4: Success

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-checkout">
            <div className="empty-icon">🛒</div>
            <h1>No Items to Checkout</h1>
            <p>Your cart is empty. Add some books first!</p>
            <button 
              onClick={() => navigate('/books')}
              className="btn btn-primary btn-lg"
            >
              🔍 Browse Books
            </button>
          </div>
        </div>

        <style jsx>{`
          .checkout-page {
            min-height: 100vh;
            padding: 40px 0;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
            display: flex;
            align-items: center;
          }

          .empty-checkout {
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

          .empty-checkout h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
          }

          .empty-checkout p {
            font-size: 1.2rem;
            margin-bottom: 40px;
            opacity: 0.9;
          }
        `}</style>
      </div>
    );
  }

  const totalPrice = getTotalPrice();

  const handleInputChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  const handlePlaceOrder = async () => {
    if (!orderData.shippingAddress.trim()) {
      setError('Please enter a shipping address');
      return;
    }

    setLoading(true);
    setError('');
    setStep(3); // Processing

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          bookId: item.id,
          quantity: item.quantity
        })),
        shippingAddress: orderData.shippingAddress.trim(),
        notes: orderData.notes.trim()
      };

      await ordersAPI.create(orderPayload);
      
      // Success!
      clearCart();
      setStep(4);
      
      // Redirect to orders page after a delay
      setTimeout(() => {
        navigate('/orders');
      }, 3000);

    } catch (error) {
      console.error('Failed to place order:', error);
      setError(error.response?.data?.message || 'Failed to place order. Please try again.');
      setStep(2); // Back to shipping form
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">💳 Checkout</h1>
          <div className="checkout-steps">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Review</span>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Shipping</span>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${step >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Payment</span>
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="checkout-content">
            <div className="checkout-layout">
              {/* Order Review */}
              <div className="order-review">
                <div className="section-card">
                  <h2 className="section-title">📦 Order Review</h2>
                  
                  <div className="order-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="order-item">
                        <div className="item-image">
                          <img src={item.imageUrl} alt={item.title} />
                        </div>
                        <div className="item-details">
                          <h3 className="item-title">{item.title}</h3>
                          <p className="item-author">by {item.author}</p>
                          <div className="item-price-qty">
                            <span className="item-price">€{item.price.toFixed(2)}</span>
                            <span className="item-qty">× {item.quantity}</span>
                            <span className="item-subtotal">€{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span className="free">FREE 🚚</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                      <span>Total</span>
                      <span>€{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    className="btn btn-primary btn-lg continue-btn"
                  >
                    Continue to Shipping →
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="customer-info">
                <div className="section-card">
                  <h2 className="section-title">👤 Customer Information</h2>
                  <div className="customer-details">
                    <div className="detail-row">
                      <span className="label">Name:</span>
                      <span className="value">{user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{user?.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Role:</span>
                      <span className="value role-badge">{user?.role}</span>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="security-info">
                  <h3>🔒 Secure Checkout</h3>
                  <ul>
                    <li>✅ SSL encrypted connection</li>
                    <li>📱 Mobile-friendly checkout</li>
                    <li>🔄 Easy returns within 30 days</li>
                    <li>💳 Secure payment processing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-content">
            <div className="shipping-form">
              <div className="section-card">
                <h2 className="section-title">🚚 Shipping Information</h2>
                
                {error && (
                  <div className="alert alert-error">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handlePlaceOrder(); }}>
                  <div className="form-group">
                    <label htmlFor="shippingAddress" className="form-label">
                      📍 Shipping Address *
                    </label>
                    <textarea
                      id="shippingAddress"
                      name="shippingAddress"
                      value={orderData.shippingAddress}
                      onChange={handleInputChange}
                      className="form-input address-input"
                      placeholder="Enter your complete shipping address including street, city, postal code, and country"
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="notes" className="form-label">
                      📝 Order Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={orderData.notes}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Special delivery instructions, gift message, etc."
                      rows="3"
                    />
                  </div>

                  <div className="shipping-options">
                    <h3>🚚 Delivery Options</h3>
                    <div className="shipping-option selected">
                      <div className="option-info">
                        <span className="option-name">📦 Standard Delivery</span>
                        <span className="option-time">3-5 business days</span>
                      </div>
                      <span className="option-price">FREE</span>
                    </div>
                  </div>

                  <div className="order-total-section">
                    <div className="total-display">
                      <span>Total: €{totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn btn-secondary"
                    >
                      ← Back to Review
                    </button>
                    <button 
                      type="submit"
                      className="btn btn-success btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner"></span>
                          Processing...
                        </>
                      ) : (
                        '🎉 Place Order'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-content">
            <div className="processing-order">
              <div className="processing-animation">
                <div className="spinner-large"></div>
              </div>
              <h2>🎯 Processing Your Order...</h2>
              <p>Please wait while we process your order and update our inventory.</p>
              <div className="processing-steps">
                <div className="processing-step completed">✅ Validating items</div>
                <div className="processing-step completed">✅ Checking inventory</div>
                <div className="processing-step active">⏳ Creating order</div>
                <div className="processing-step">⏳ Sending confirmation</div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="checkout-content">
            <div className="order-success">
              <div className="success-animation">
                <div className="success-checkmark">✅</div>
              </div>
              <h1>🎉 Order Placed Successfully!</h1>
              <p>Thank you for your purchase! Your order has been confirmed and we'll start processing it right away.</p>
              
              <div className="success-details">
                <div className="detail">
                  <span className="label">Order Total:</span>
                  <span className="value">€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="detail">
                  <span className="label">Items:</span>
                  <span className="value">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} books</span>
                </div>
                <div className="detail">
                  <span className="label">Delivery:</span>
                  <span className="value">3-5 business days</span>
                </div>
              </div>

              <div className="success-actions">
                <button 
                  onClick={() => navigate('/orders')}
                  className="btn btn-primary btn-lg"
                >
                  📋 View My Orders
                </button>
                <button 
                  onClick={() => navigate('/books')}
                  className="btn btn-secondary"
                >
                  📚 Continue Shopping
                </button>
              </div>

              <p className="redirect-note">
                Redirecting to your orders in <span className="countdown">3</span> seconds...
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .checkout-page {
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
          margin-bottom: 30px;
        }

        .checkout-steps {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          max-width: 500px;
          margin: 0 auto;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: white;
          color: var(--primary-color);
        }

        .step-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .step.active .step-label {
          opacity: 1;
          font-weight: 600;
        }

        .step-connector {
          width: 60px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
        }

        .checkout-content {
          animation: slideIn 0.5s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
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

        .order-items {
          margin-bottom: 25px;
        }

        .order-item {
          display: flex;
          gap: 15px;
          padding: 15px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .item-image {
          width: 60px;
          height: 75px;
          border-radius: 8px;
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
        }

        .item-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 5px;
        }

        .item-author {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 8px;
        }

        .item-price-qty {
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 0.9rem;
        }

        .item-price {
          color: var(--success-color);
          font-weight: 600;
        }

        .item-qty {
          color: var(--text-secondary);
        }

        .item-subtotal {
          color: var(--primary-color);
          font-weight: 700;
          margin-left: auto;
        }

        .order-summary {
          border-top: 2px solid var(--border-color);
          padding-top: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .summary-row.total {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--primary-color);
        }

        .free {
          color: var(--success-color);
          font-weight: 600;
        }

        .summary-divider {
          height: 1px;
          background: var(--border-color);
          margin: 15px 0;
        }

        .continue-btn {
          width: 100%;
          margin-top: 20px;
        }

        .customer-details {
          margin-bottom: 25px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .label {
          color: var(--text-secondary);
        }

        .value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .role-badge {
          background: var(--primary-color);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          text-transform: uppercase;
        }

        .security-info {
          background: #f0fdf4;
          border-radius: 15px;
          padding: 20px;
          border-left: 4px solid var(--success-color);
        }

        .security-info h3 {
          color: var(--success-color);
          margin-bottom: 15px;
        }

        .security-info ul {
          list-style: none;
          padding: 0;
        }

        .security-info li {
          margin-bottom: 8px;
          color: #15803d;
          font-size: 0.9rem;
        }

        .shipping-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .address-input {
          resize: vertical;
          min-height: 100px;
        }

        .shipping-options {
          margin: 25px 0;
        }

        .shipping-options h3 {
          margin-bottom: 15px;
          color: var(--text-primary);
        }

        .shipping-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border: 2px solid var(--success-color);
          border-radius: 12px;
          background: #f0fdf4;
        }

        .option-info {
          display: flex;
          flex-direction: column;
        }

        .option-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .option-time {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .option-price {
          font-weight: 700;
          color: var(--success-color);
          font-size: 1.1rem;
        }

        .order-total-section {
          background: var(--bg-accent);
          border-radius: 12px;
          padding: 20px;
          margin: 25px 0;
          text-align: center;
        }

        .total-display {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary-color);
        }

        .form-actions {
          display: flex;
          gap: 15px;
          justify-content: space-between;
        }

        .processing-order, .order-success {
          text-align: center;
          color: white;
          max-width: 500px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .processing-animation, .success-animation {
          margin-bottom: 30px;
        }

        .spinner-large {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        .success-checkmark {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .processing-order h2, .order-success h1 {
          font-size: 2rem;
          margin-bottom: 15px;
        }

        .processing-order p {
          font-size: 1.1rem;
          opacity: 0.9;
          margin-bottom: 30px;
        }

        .processing-steps {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 30px;
        }

        .processing-step {
          padding: 10px 15px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .processing-step.completed {
          background: rgba(16, 185, 129, 0.2);
        }

        .processing-step.active {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .success-details {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 15px;
          padding: 25px;
          margin: 30px 0;
        }

        .success-details .detail {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 1.1rem;
        }

        .success-details .value {
          font-weight: 700;
        }

        .success-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
          margin: 30px 0;
          flex-wrap: wrap;
        }

        .redirect-note {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-top: 30px;
        }

        .countdown {
          font-weight: 700;
          color: #fbbf24;
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

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .success-actions {
            flex-direction: column;
            align-items: center;
          }

          .page-title {
            font-size: 2rem;
          }

          .checkout-steps {
            gap: 10px;
          }

          .step-connector {
            width: 30px;
          }
        }
      `}</style>
    </div>
  );
}