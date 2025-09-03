import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../services/api';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [stats, setStats] = useState({ totalBooks: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBooks();
    
    // Refresh data every 30 seconds to keep stats updated
    const interval = setInterval(fetchFeaturedBooks, 30000);
    
    // Also listen for focus events to refresh when user returns to tab
    const handleFocus = () => fetchFeaturedBooks();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const fetchFeaturedBooks = async () => {
    try {
      const response = await booksAPI.getAll({ limit: 6 });
      setFeaturedBooks(response.data.books.slice(0, 6));
      setStats({
        totalBooks: response.data.pagination.totalBooks,
        categories: response.data.categories.length
      });
    } catch (error) {
      console.error('Failed to fetch featured books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                📚 Welcome to Our
                <span className="gradient-text"> Book Store</span>
              </h1>
              <p className="hero-subtitle">
                Discover amazing books, explore new worlds, and expand your knowledge.
                Your next great read is just a click away!
              </p>
              <div className="hero-buttons">
                <Link to="/books" className="btn btn-primary btn-lg">
                  🔍 Browse Books
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  🚀 Get Started
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <div className="floating-books">
                <div className="book-icon">📖</div>
                <div className="book-icon">📚</div>
                <div className="book-icon">📝</div>
                <div className="book-icon">🔖</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-number">{stats.totalBooks}</div>
              <div className="stat-label">Books Available</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏷️</div>
              <div className="stat-number">{stats.categories}</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">4.9</div>
              <div className="stat-label">Average Rating</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚚</div>
              <div className="stat-number">Free</div>
              <div className="stat-label">Shipping</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-books">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">✨ Featured Books</h2>
            <p className="section-subtitle">Discover our most popular and recommended books</p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="book-card-skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text short"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="books-grid">
              {featuredBooks.map(book => (
                <Link key={book.id} to={`/books/${book.id}`} className="book-card">
                  <div className="book-image">
                    <img src={book.imageUrl} alt={book.title} />
                    <div className="book-overlay">
                      <span className="view-details">View Details</span>
                    </div>
                  </div>
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    <div className="book-footer">
                      <span className="book-price">€{book.price}</span>
                      <span className={`book-status ${book.isAvailable ? 'available' : 'unavailable'}`}>
                        {book.isAvailable ? '✅ Available' : '❌ Out of Stock'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="section-footer">
            <Link to="/books" className="btn btn-primary">
              View All Books →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">🌟 Why Choose Our Book Store?</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Easy Search</h3>
              <p>Find books by title, author, or category with our powerful search engine.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping to get your books delivered safely.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payment</h3>
              <p>Safe and secure checkout process for your peace of mind.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Shop anywhere, anytime with our responsive mobile design.</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .home-page {
          min-height: 100vh;
        }

        .hero {
          padding: 80px 0;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: white;
          overflow: hidden;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          min-height: 60vh;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 20px;
        }

        .gradient-text {
          background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          line-height: 1.6;
          margin-bottom: 40px;
          opacity: 0.9;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .floating-books {
          position: relative;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .book-icon {
          position: absolute;
          font-size: 3rem;
          animation: float 3s ease-in-out infinite;
        }

        .book-icon:nth-child(1) { top: 20%; left: 20%; animation-delay: 0s; }
        .book-icon:nth-child(2) { top: 60%; right: 20%; animation-delay: 1s; }
        .book-icon:nth-child(3) { bottom: 20%; left: 30%; animation-delay: 2s; }
        .book-icon:nth-child(4) { top: 40%; right: 40%; animation-delay: 1.5s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .stats-section {
          padding: 60px 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
        }

        .stat-card {
          text-align: center;
          color: white;
        }

        .stat-icon {
          font-size: 3rem;
          margin-bottom: 15px;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .stat-label {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .featured-books {
          padding: 80px 0;
          background: rgba(255, 255, 255, 0.05);
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
          color: white;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 15px;
        }

        .section-subtitle {
          font-size: 1.2rem;
          opacity: 0.8;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-bottom: 50px;
        }

        .book-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
          text-decoration: none;
          color: inherit;
        }

        .book-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .book-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .book-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .book-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .book-card:hover .book-overlay {
          opacity: 1;
        }

        .view-details {
          color: white;
          font-weight: 600;
        }

        .book-info {
          padding: 20px;
        }

        .book-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .book-author {
          color: var(--text-secondary);
          margin-bottom: 15px;
        }

        .book-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .book-price {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .book-status.available {
          color: var(--success-color);
          font-size: 0.9rem;
        }

        .book-status.unavailable {
          color: var(--error-color);
          font-size: 0.9rem;
        }

        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .book-card-skeleton {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          padding: 20px;
        }

        .skeleton-image {
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .skeleton-text {
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 10px;
        }

        .skeleton-text.short {
          width: 60%;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .features {
          padding: 80px 0;
          background: rgba(255, 255, 255, 0.1);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
        }

        .feature-card {
          text-align: center;
          color: white;
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
        }

        .feature-card p {
          opacity: 0.9;
          line-height: 1.6;
        }

        .section-footer {
          text-align: center;
          margin-top: 50px;
        }

        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .books-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}