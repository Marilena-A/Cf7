/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchBooks();
  }, [searchTerm, selectedCategory, sortBy, sortOrder, currentPage]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: 12
      };

      const response = await booksAPI.getAll(params);
      setBooks(response.data.books);
      setCategories(response.data.categories || []);
      setPagination(response.data.pagination);
      setError('');
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleAddToCart = async (book) => {
    if (!book.isAvailable) return;
    
    setAddingToCart(prev => ({ ...prev, [book.id]: true }));
    
    try {
      addToCart(book, 1);
      // Visual feedback
      setTimeout(() => {
        setAddingToCart(prev => ({ ...prev, [book.id]: false }));
      }, 800);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setAddingToCart(prev => ({ ...prev, [book.id]: false }));
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('title');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  return (
    <div className="books-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">📚 Book Catalog</h1>
            <p className="page-subtitle">
              Discover amazing books from our collection of {pagination.totalBooks || 0} titles
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-container">
            {/* Search Bar */}
            <div className="search-container">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search books by title, author, or description..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="clear-search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="category-filter">
              <div className="category-tabs">
                <button
                  className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('all')}
                >
                  🌟 All Books
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="sort-container">
              <div className="sort-options">
                <button
                  className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`}
                  onClick={() => handleSortChange('title')}
                >
                  📝 Title {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  className={`sort-btn ${sortBy === 'author' ? 'active' : ''}`}
                  onClick={() => handleSortChange('author')}
                >
                  👤 Author {sortBy === 'author' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
                  onClick={() => handleSortChange('price')}
                >
                  💰 Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
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

        {/* Results Info */}
        {!loading && (
          <div className="results-info">
            <p>
              {searchTerm ? (
                <>Showing results for "<strong>{searchTerm}</strong>" • </>
              ) : ''}
              {selectedCategory !== 'all' ? (
                <>Category: <strong>{selectedCategory}</strong> • </>
              ) : ''}
              <strong>{pagination.totalBooks || 0}</strong> books found
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
              <div key={i} className="book-card-skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
                <div className="skeleton-text"></div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">📭</div>
            <h3>No books found</h3>
            <p>Try adjusting your search terms or filters</p>
            <button onClick={clearFilters} className="btn btn-primary">
              🔄 Clear Filters
            </button>
          </div>
        ) : (
          <div className="books-grid">
            {books.map(book => (
              <div key={book.id} className="book-card">
                <Link to={`/books/${book.id}`} className="book-link">
                  <div className="book-image">
                    <img src={book.imageUrl} alt={book.title} />
                    <div className="book-overlay">
                      <span className="view-details">👁️ View Details</span>
                    </div>
                    {!book.isAvailable && (
                      <div className="out-of-stock-badge">
                        Out of Stock
                      </div>
                    )}
                  </div>
                </Link>
                
                <div className="book-info">
                  <Link to={`/books/${book.id}`} className="book-title-link">
                    <h3 className="book-title">{book.title}</h3>
                  </Link>
                  <p className="book-author">by {book.author}</p>
                  <p className="book-category">📖 {book.category}</p>
                  
                  <div className="book-footer">
                    <div className="book-price">
                      €{book.price.toFixed(2)}
                    </div>
                    
                    <div className="book-actions">
                      {isAuthenticated() ? (
                        <>
                          {isInCart(book.id) ? (
                            <div className="in-cart-info">
                              <span className="in-cart-text">
                                ✅ In Cart ({getItemQuantity(book.id)})
                              </span>
                              <Link to="/cart" className="btn btn-sm btn-secondary">
                                View Cart
                              </Link>
                            </div>
                          ) : (
                            <button
                              className={`btn btn-sm btn-primary add-to-cart-btn ${!book.isAvailable ? 'disabled' : ''}`}
                              onClick={() => handleAddToCart(book)}
                              disabled={!book.isAvailable || addingToCart[book.id]}
                            >
                              {addingToCart[book.id] ? (
                                <>
                                  <span className="spinner-sm"></span>
                                  Adding...
                                </>
                              ) : !book.isAvailable ? (
                                '❌ Out of Stock'
                              ) : (
                                '🛒 Add to Cart'
                              )}
                            </button>
                          )}
                        </>
                      ) : (
                        <Link to="/login" className="btn btn-sm btn-primary">
                          🔐 Login to Buy
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
      </div>

      <style jsx>{`
        .books-page {
          padding: 40px 0;
          min-height: 100vh;
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
          margin-bottom: 15px;
        }

        .page-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .filters-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 30px;
          margin-bottom: 30px;
        }

        .search-container {
          margin-bottom: 25px;
        }

        .search-box {
          position: relative;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          color: var(--text-secondary);
        }

        .search-input {
          width: 100%;
          padding: 15px 20px 15px 50px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
        }

        .search-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          background: white;
        }

        .clear-search {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-secondary);
          font-size: 1.2rem;
        }

        .category-tabs {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 20px;
        }

        .category-tab {
          padding: 10px 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .category-tab:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .category-tab.active {
          background: white;
          color: var(--primary-color);
          border-color: white;
        }

        .sort-options {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .sort-btn {
          padding: 8px 16px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .sort-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .sort-btn.active {
          background: rgba(255, 255, 255, 0.9);
          color: var(--primary-color);
        }

        .clear-filters-btn {
          padding: 8px 16px;
          border: 1px solid var(--warning-color);
          border-radius: 15px;
          background: var(--warning-color);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .results-info {
          color: white;
          text-align: center;
          margin-bottom: 30px;
          font-size: 1.1rem;
        }

        .books-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
          margin-bottom: 50px;
        }

        .book-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .book-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .book-image {
          position: relative;
          height: 250px;
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
          padding: 10px 20px;
          border: 2px solid white;
          border-radius: 25px;
        }

        .out-of-stock-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: var(--error-color);
          color: white;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .book-info {
          padding: 25px;
        }

        .book-title-link {
          text-decoration: none;
          color: inherit;
        }

        .book-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .book-author {
          color: var(--text-secondary);
          margin-bottom: 5px;
        }

        .book-category {
          color: var(--primary-color);
          font-size: 0.9rem;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .book-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 15px;
        }

        .book-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--success-color);
        }

        .book-actions {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .add-to-cart-btn {
          white-space: nowrap;
        }

        .in-cart-info {
          text-align: right;
        }

        .in-cart-text {
          display: block;
          color: var(--success-color);
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .spinner-sm {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 5px;
        }

        .loading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }

        .book-card-skeleton {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          padding: 25px;
        }

        .skeleton-image {
          height: 200px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .skeleton-text {
          height: 16px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
          margin-bottom: 12px;
        }

        .skeleton-text.short {
          width: 60%;
        }

        .no-results {
          text-align: center;
          color: white;
          padding: 60px 20px;
        }

        .no-results-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .no-results h3 {
          font-size: 1.8rem;
          margin-bottom: 15px;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          color: white;
        }

        .pagination-btn {
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-info {
          font-weight: 600;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 2rem;
          }

          .filters-section {
            padding: 20px;
          }

          .category-tabs {
            justify-content: flex-start;
            overflow-x: auto;
            padding-bottom: 10px;
          }

          .books-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }

          .book-footer {
            flex-direction: column;
            gap: 10px;
          }

          .book-actions {
            align-items: stretch;
          }
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}