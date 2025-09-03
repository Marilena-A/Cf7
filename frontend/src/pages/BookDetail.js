/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { booksAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookDetail();
    }
  }, [id]);

  useEffect(() => {
    if (book) {
      fetchRelatedBooks();
    }
  }, [book]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await booksAPI.getById(id);
      setBook(response.data);
    } catch (error) {
      console.error('Failed to fetch book details:', error);
      if (error.response?.status === 404) {
        setError('Book not found');
      } else {
        setError('Failed to load book details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBooks = async () => {
    try {
      const response = await booksAPI.getAll({
        category: book.category,
        limit: 4
      });
      // Filter out current book and limit to 3 related books
      const filtered = response.data.books
        .filter(relatedBook => relatedBook.id !== book.id)
        .slice(0, 3);
      setRelatedBooks(filtered);
    } catch (error) {
      console.error('Failed to fetch related books:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!book.isAvailable) return;
    
    setAddingToCart(true);
    
    try {
      if (isInCart(book.id)) {
        // Update quantity if already in cart
        const currentQuantity = getItemQuantity(book.id);
        updateQuantity(book.id, currentQuantity + quantity);
      } else {
        // Add new item to cart
        addToCart(book, quantity);
      }
      
      // Visual feedback
      setTimeout(() => {
        setAddingToCart(false);
      }, 800);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= book.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'out-of-stock', icon: '❌' };
    if (stock < 10) return { text: `Only ${stock} left`, class: 'low-stock', icon: '⚠️' };
    return { text: 'In Stock', class: 'in-stock', icon: '✅' };
  };

  const formatPrice = (price) => `€${price.toFixed(2)}`;

  if (loading) {
    return (
      <div className="book-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading book details...</p>
          </div>
        </div>

        <style jsx>{`
          .book-detail-page {
            min-height: 100vh;
            padding: 40px 0;
            background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          }

          .loading-state {
            text-align: center;
            color: white;
            padding: 80px 20px;
          }

          .spinner-large {
            width: 60px;
            height: 60px;
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
      <div className="book-detail-page">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">😔</div>
            <h1>{error === 'Book not found' ? 'Book Not Found' : 'Something Went Wrong'}</h1>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={() => navigate('/books')} className="btn btn-primary">
                📚 Browse Books
              </button>
              <button onClick={() => navigate(-1)} className="btn btn-secondary">
                ← Go Back
              </button>
            </div>
          </div>
        </div>

        <style jsx>{`
          .book-detail-page {
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

          .error-actions {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
          }
        `}</style>
      </div>
    );
  }

  if (!book) {
    return null;
  }

  const stockStatus = getStockStatus(book.stock);
  const isInCartAlready = isInCart(book.id);
  const cartQuantity = getItemQuantity(book.id);

  return (
    <div className="book-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/" className="breadcrumb-link">Home</Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/books" className="breadcrumb-link">Books</Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{book.title}</span>
        </nav>

        {/* Main Content */}
        <div className="book-detail-content">
          {/* Book Image */}
          <div className="book-image-section">
            <div className="book-image-container">
              {imageLoading && (
                <div className="image-loading">
                  <div className="spinner"></div>
                </div>
              )}
              {imageError ? (
                <div className="image-fallback">
                  <span className="fallback-icon">📚</span>
                  <span className="fallback-text">Image not available</span>
                </div>
              ) : (
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="book-image"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ display: imageLoading ? 'none' : 'block' }}
                />
              )}
              {!book.isAvailable && (
                <div className="out-of-stock-overlay">
                  <span>Out of Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Book Info */}
          <div className="book-info-section">
            <div className="book-header">
              <h1 className="book-title">{book.title}</h1>
              <p className="book-author">by <strong>{book.author}</strong></p>
              <div className="book-meta">
                <span className="book-category">📖 {book.category}</span>
                {book.isbn && (
                  <span className="book-isbn">ISBN: {book.isbn}</span>
                )}
              </div>
            </div>

            {/* Price and Stock */}
            <div className="price-stock-section">
              <div className="price-info">
                <span className="price">{formatPrice(book.price)}</span>
                <span className="price-label">per book</span>
              </div>
              <div className="stock-info">
                <span className={`stock-status ${stockStatus.class}`}>
                  {stockStatus.icon} {stockStatus.text}
                </span>
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <div className="description-section">
                <h3>📝 Description</h3>
                <p className="book-description">{book.description}</p>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className="cart-section">
              {isAuthenticated() ? (
                <>
                  {isInCartAlready ? (
                    <div className="in-cart-info">
                      <div className="cart-status">
                        <span className="cart-icon">✅</span>
                        <span className="cart-text">In Cart ({cartQuantity})</span>
                      </div>
                      <div className="cart-actions">
                        <Link to="/cart" className="btn btn-primary">
                          🛒 View Cart
                        </Link>
                        <button
                          onClick={handleAddToCart}
                          className="btn btn-secondary"
                          disabled={!book.isAvailable || addingToCart}
                        >
                          {addingToCart ? 'Adding...' : '+ Add More'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="add-to-cart">
                      {book.isAvailable && (
                        <div className="quantity-selector">
                          <label>Quantity:</label>
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={() => handleQuantityChange(quantity - 1)}
                              disabled={quantity <= 1}
                            >
                              −
                            </button>
                            <span className="quantity-display">{quantity}</span>
                            <button
                              className="quantity-btn"
                              onClick={() => handleQuantityChange(quantity + 1)}
                              disabled={quantity >= book.stock}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={handleAddToCart}
                        className={`btn btn-lg add-to-cart-btn ${!book.isAvailable ? 'btn-secondary' : 'btn-success'}`}
                        disabled={!book.isAvailable || addingToCart}
                      >
                        {addingToCart ? (
                          <>
                            <span className="spinner-sm"></span>
                            Adding to Cart...
                          </>
                        ) : !book.isAvailable ? (
                          '❌ Out of Stock'
                        ) : (
                          `🛒 Add to Cart - ${formatPrice(book.price * quantity)}`
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="login-prompt">
                  <p>Please log in to purchase this book</p>
                  <Link to="/login" className="btn btn-primary btn-lg">
                    🔐 Login to Buy
                  </Link>
                </div>
              )}
            </div>

            {/* Book Details */}
            <div className="book-details">
              <h3>📋 Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Author:</span>
                  <span className="detail-value">{book.author}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{book.category}</span>
                </div>
                {book.isbn && (
                  <div className="detail-item">
                    <span className="detail-label">ISBN:</span>
                    <span className="detail-value">{book.isbn}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">{formatPrice(book.price)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Availability:</span>
                  <span className={`detail-value ${stockStatus.class}`}>
                    {stockStatus.text}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="related-books-section">
            <h2 className="section-title">📚 You Might Also Like</h2>
            <div className="related-books-grid">
              {relatedBooks.map(relatedBook => (
                <Link
                  key={relatedBook.id}
                  to={`/books/${relatedBook.id}`}
                  className="related-book-card"
                >
                  <div className="related-book-image">
                    <img src={relatedBook.imageUrl} alt={relatedBook.title} />
                  </div>
                  <div className="related-book-info">
                    <h4 className="related-book-title">{relatedBook.title}</h4>
                    <p className="related-book-author">by {relatedBook.author}</p>
                    <span className="related-book-price">{formatPrice(relatedBook.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .book-detail-page {
          min-height: 100vh;
          padding: 40px 0;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 30px;
          color: white;
          font-size: 0.9rem;
        }

        .breadcrumb-link {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .breadcrumb-link:hover {
          color: white;
        }

        .breadcrumb-separator {
          opacity: 0.6;
        }

        .breadcrumb-current {
          color: white;
          font-weight: 600;
        }

        .book-detail-content {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 50px;
          margin-bottom: 60px;
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .book-image-section {
          display: flex;
          justify-content: center;
        }

        .book-image-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          aspect-ratio: 3/4;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .book-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .book-image:hover {
          transform: scale(1.05);
        }

        .image-loading {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .image-fallback {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: var(--bg-secondary);
          color: var(--text-secondary);
        }

        .fallback-icon {
          font-size: 4rem;
          margin-bottom: 10px;
        }

        .fallback-text {
          font-size: 0.9rem;
        }

        .out-of-stock-overlay {
          position: absolute;
          top: 15px;
          right: 15px;
          background: var(--error-color);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .book-info-section {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .book-header {
          border-bottom: 2px solid var(--border-color);
          padding-bottom: 20px;
        }

        .book-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 10px;
          line-height: 1.2;
        }

        .book-author {
          font-size: 1.3rem;
          color: var(--text-secondary);
          margin-bottom: 15px;
        }

        .book-meta {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .book-category {
          background: var(--primary-color);
          color: white;
          padding: 6px 15px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .book-isbn {
          background: var(--bg-accent);
          color: var(--text-secondary);
          padding: 6px 15px;
          border-radius: 20px;
          font-family: monospace;
          font-size: 0.9rem;
        }

        .price-stock-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-accent);
          padding: 25px;
          border-radius: 15px;
        }

        .price-info {
          display: flex;
          flex-direction: column;
        }

        .price {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--success-color);
          line-height: 1;
        }

        .price-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .stock-status {
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 600;
          font-size: 1rem;
        }

        .stock-status.in-stock {
          background: #d1fae5;
          color: #065f46;
        }

        .stock-status.low-stock {
          background: #fef3c7;
          color: #92400e;
        }

        .stock-status.out-of-stock {
          background: #fee2e2;
          color: #991b1b;
        }

        .description-section h3 {
          color: var(--text-primary);
          margin-bottom: 15px;
          font-size: 1.3rem;
        }

        .book-description {
          color: var(--text-secondary);
          line-height: 1.7;
          font-size: 1.1rem;
        }

        .cart-section {
          background: var(--bg-secondary);
          padding: 25px;
          border-radius: 15px;
          border: 2px solid var(--border-color);
        }

        .in-cart-info {
          text-align: center;
        }

        .cart-status {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .cart-icon {
          font-size: 1.5rem;
        }

        .cart-text {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--success-color);
        }

        .cart-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .add-to-cart {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .quantity-selector label {
          font-weight: 600;
          color: var(--text-primary);
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          overflow: hidden;
        }

        .quantity-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: var(--bg-primary);
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
          width: 60px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-left: 1px solid var(--border-color);
          border-right: 1px solid var(--border-color);
          font-weight: 600;
          font-size: 1.1rem;
        }

        .add-to-cart-btn {
          width: 100%;
          justify-content: center;
        }

        .login-prompt {
          text-align: center;
        }

        .login-prompt p {
          margin-bottom: 20px;
          color: var(--text-secondary);
        }

        .book-details h3 {
          color: var(--text-primary);
          margin-bottom: 20px;
          font-size: 1.3rem;
        }

        .details-grid {
          display: grid;
          gap: 15px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .detail-label {
          font-weight: 600;
          color: var(--text-secondary);
        }

        .detail-value {
          font-weight: 600;
          color: var(--text-primary);
        }

        .detail-value.in-stock {
          color: var(--success-color);
        }

        .detail-value.low-stock {
          color: var(--warning-color);
        }

        .detail-value.out-of-stock {
          color: var(--error-color);
        }

        .related-books-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
        }

        .section-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 30px;
          text-align: center;
        }

        .related-books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }

        .related-book-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .related-book-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .related-book-image {
          width: 100%;
          height: 200px;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 15px;
        }

        .related-book-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .related-book-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 5px;
          line-height: 1.3;
        }

        .related-book-author {
          color: var(--text-secondary);
          margin-bottom: 10px;
          font-size: 0.9rem;
        }

        .related-book-price {
          color: var(--success-color);
          font-weight: 700;
          font-size: 1.1rem;
        }

        .spinner-sm {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 10px;
        }

        @media (max-width: 768px) {
          .book-detail-content {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 25px;
          }

          .book-title {
            font-size: 2rem;
          }

          .price-stock-section {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .cart-actions {
            flex-direction: column;
          }

          .quantity-selector {
            justify-content: center;
          }

          .related-books-grid {
            grid-template-columns: 1fr;
          }

          .breadcrumb {
            font-size: 0.8rem;
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