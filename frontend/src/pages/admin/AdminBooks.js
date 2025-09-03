import React, { useState, useEffect } from 'react';
import { booksAPI } from '../../services/api';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    imageUrl: '',
    newCategory: ''
  });
  
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  
  const [formLoading, setFormLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll({ limit: 100 });
      setBooks(response.data.books);
      setCategories(response.data.categories || []);
      setError('');
    } catch (error) {
      console.error('Failed to fetch books:', error);
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    
    const matchesStock = stockFilter === 'all' ||
                        (stockFilter === 'low' && book.stock < 10) ||
                        (stockFilter === 'out' && book.stock === 0) ||
                        (stockFilter === 'available' && book.stock > 0);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      imageUrl: '',
      newCategory: ''
    });
    setFormErrors({});
    setShowNewCategoryInput(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      if (value === '__new__') {
        setShowNewCategoryInput(true);
        setFormData({
          ...formData,
          category: '',
          newCategory: ''
        });
      } else {
        setShowNewCategoryInput(false);
        setFormData({
          ...formData,
          category: value,
          newCategory: ''
        });
      }
    } else if (name === 'newCategory') {
      setFormData({
        ...formData,
        newCategory: value,
        category: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.author.trim()) errors.author = 'Author is required';
    if (!formData.isbn.trim()) errors.isbn = 'ISBN is required';
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) errors.stock = 'Valid stock quantity is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    
    // Validate price format
    if (formData.price && isNaN(parseFloat(formData.price))) {
      errors.price = 'Price must be a valid number';
    }
    
    // Validate stock format
    if (formData.stock && isNaN(parseInt(formData.stock))) {
      errors.stock = 'Stock must be a valid number';
    }
    
    // Validate ISBN format (basic)
    if (formData.isbn.trim() && formData.isbn.trim().length < 10) {
      errors.isbn = 'ISBN must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim(), // Now always required
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category.trim(),
        description: formData.description.trim() || undefined,
        imageUrl: formData.imageUrl.trim() || undefined
      };

      console.log('Sending book data:', bookData); // Debug log

      const response = await booksAPI.create(bookData);
      console.log('Book created:', response.data); // Debug log
      
      await fetchBooks(); // Refresh list
      setShowAddModal(false);
      resetForm();
      setError('✅ Book created successfully!');
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('Failed to create book:', error);
      console.error('Error response:', error.response?.data); // Debug log
      
      // Better error handling
      let errorMessage = 'Failed to create book';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.map(err => err.message).join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(`❌ ${errorMessage}`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditBook = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormLoading(true);
    try {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      await booksAPI.update(editingBook.id, bookData);
      await fetchBooks(); // Refresh list
      setShowEditModal(false);
      setEditingBook(null);
      resetForm();
    } catch (error) {
      console.error('Failed to update book:', error);
      setError(error.response?.data?.message || 'Failed to update book');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      return;
    }

    setDeletingBook(bookId);
    try {
      await booksAPI.delete(bookId);
      await fetchBooks(); // Refresh list
    } catch (error) {
      console.error('Failed to delete book:', error);
      setError(error.response?.data?.message || 'Failed to delete book');
    } finally {
      setDeletingBook(null);
    }
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      price: book.price.toString(),
      stock: book.stock.toString(),
      category: book.category,
      description: book.description || '',
      imageUrl: book.imageUrl || '',
      newCategory: ''
    });
    setShowNewCategoryInput(false);
    setShowEditModal(true);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', class: 'out-of-stock' };
    if (stock < 10) return { text: 'Low Stock', class: 'low-stock' };
    return { text: 'In Stock', class: 'in-stock' };
  };

  return (
    <div className="admin-books">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">📚 Book Management</h1>
            <p className="page-subtitle">
              Manage your book catalog • {filteredBooks.length} of {books.length} books
            </p>
          </div>
          <button 
            onClick={openAddModal}
            className="btn btn-success btn-lg add-book-btn"
          >
            ➕ Add New Book
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
            <button onClick={() => setError('')} className="alert-close">✕</button>
          </div>
        )}

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-container">
            {/* Search */}
            <div className="filter-group">
              <label className="filter-label">🔍 Search Books</label>
              <input
                type="text"
                placeholder="Search by title, author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="filter-input"
              />
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">📂 Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Stock Filter */}
            <div className="filter-group">
              <label className="filter-label">📦 Stock Status</label>
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Books</option>
                <option value="available">In Stock</option>
                <option value="low">Low Stock (&lt; 10)</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="filter-group">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setStockFilter('all');
                }}
                className="btn btn-secondary clear-filters-btn"
              >
                🔄 Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Books Table */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Loading books...</p>
          </div>
        ) : (
          <div className="books-table-container">
            <div className="table-wrapper">
              <table className="books-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map(book => {
                    const stockStatus = getStockStatus(book.stock);
                    return (
                      <tr key={book.id} className="book-row">
                        <td className="book-info">
                          <div className="book-details">
                            <img 
                              src={book.imageUrl} 
                              alt={book.title}
                              className="book-thumbnail"
                            />
                            <div className="book-text">
                              <div className="book-title">{book.title}</div>
                              <div className="book-isbn">ISBN: {book.isbn || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="book-author">{book.author}</td>
                        <td className="book-category">
                          <span className="category-badge">{book.category}</span>
                        </td>
                        <td className="book-price">€{book.price.toFixed(2)}</td>
                        <td className="book-stock">{book.stock}</td>
                        <td className="book-status">
                          <span className={`status-badge ${stockStatus.class}`}>
                            {stockStatus.text}
                          </span>
                        </td>
                        <td className="book-actions">
                          <div className="action-buttons">
                            <button
                              onClick={() => openEditModal(book)}
                              className="btn btn-sm btn-primary action-btn"
                              title="Edit book"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="btn btn-sm btn-error action-btn"
                              disabled={deletingBook === book.id}
                              title="Delete book"
                            >
                              {deletingBook === book.id ? (
                                <span className="spinner-sm"></span>
                              ) : (
                                '🗑️'
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredBooks.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No books found</h3>
                  <p>Try adjusting your filters or add a new book to get started.</p>
                  <button onClick={openAddModal} className="btn btn-primary">
                    ➕ Add First Book
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Book Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>➕ Add New Book</h2>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="modal-close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddBook} className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">📖 Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.title ? 'error' : ''}`}
                      placeholder="Enter book title"
                    />
                    {formErrors.title && <span className="form-error">{formErrors.title}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">👤 Author *</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.author ? 'error' : ''}`}
                      placeholder="Enter author name"
                    />
                    {formErrors.author && <span className="form-error">{formErrors.author}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">📋 ISBN *</label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.isbn ? 'error' : ''}`}
                      placeholder="978-0000000000"
                    />
                    {formErrors.isbn && <span className="form-error">{formErrors.isbn}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">💰 Price (€) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.price ? 'error' : ''}`}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                    {formErrors.price && <span className="form-error">{formErrors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">📦 Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.stock ? 'error' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                    {formErrors.stock && <span className="form-error">{formErrors.stock}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">📂 Category *</label>
                    <select
                      name="category"
                      value={showNewCategoryInput ? '__new__' : formData.category}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.category ? 'error' : ''}`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      <option value="__new__">➕ Add New Category</option>
                    </select>
                    {showNewCategoryInput && (
                      <input
                        type="text"
                        name="newCategory"
                        value={formData.newCategory}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Enter new category name"
                        style={{marginTop: '10px'}}
                        autoFocus
                      />
                    )}
                    {formErrors.category && <span className="form-error">{formErrors.category}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">🖼️ Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://example.com/book-cover.jpg"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">📝 Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="4"
                    placeholder="Enter book description..."
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <span className="spinner-sm"></span>
                        Adding...
                      </>
                    ) : (
                      '➕ Add Book'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Book Modal */}
        {showEditModal && editingBook && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>✏️ Edit Book</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="modal-close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditBook} className="modal-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">📖 Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.title ? 'error' : ''}`}
                      placeholder="Enter book title"
                    />
                    {formErrors.title && <span className="form-error">{formErrors.title}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">👤 Author *</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.author ? 'error' : ''}`}
                      placeholder="Enter author name"
                    />
                    {formErrors.author && <span className="form-error">{formErrors.author}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">📋 ISBN *</label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.isbn ? 'error' : ''}`}
                      placeholder="978-0000000000 (required)"
                    />
                    {formErrors.isbn && <span className="form-error">{formErrors.isbn}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">💰 Price (€) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.price ? 'error' : ''}`}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                    {formErrors.price && <span className="form-error">{formErrors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">📦 Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.stock ? 'error' : ''}`}
                      placeholder="0"
                      min="0"
                    />
                    {formErrors.stock && <span className="form-error">{formErrors.stock}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">📂 Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`form-input ${formErrors.category ? 'error' : ''}`}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                      <option value="__new__">➕ Add New Category</option>
                    </select>
                    {formData.category === '__new__' && (
                      <input
                        type="text"
                        name="newCategory"
                        value={formData.newCategory || ''}
                        onChange={(e) => setFormData({...formData, newCategory: e.target.value, category: e.target.value})}
                        className="form-input"
                        placeholder="Enter new category name"
                        style={{marginTop: '10px'}}
                      />
                    )}
                    {formErrors.category && <span className="form-error">{formErrors.category}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">🖼️ Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="https://example.com/book-cover.jpg"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">📝 Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-input"
                    rows="4"
                    placeholder="Enter book description..."
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <span className="spinner-sm"></span>
                        Updating...
                      </>
                    ) : (
                      '💾 Update Book'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .admin-books {
          min-height: 100vh;
          padding: 40px 0;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          color: white;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 8px;
        }

        .page-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .add-book-btn {
          background: linear-gradient(45deg, var(--success-color), #059669);
          font-size: 1.1rem;
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

        .filters-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 25px;
        }

        .filters-container {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 20px;
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-label {
          color: white;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .filter-input, .filter-select {
          padding: 10px 15px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .filter-input:focus, .filter-select:focus {
          border-color: white;
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }

        .clear-filters-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          height: fit-content;
        }

        .books-table-container {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .table-wrapper {
          overflow-x: auto;
        }

        .books-table {
          width: 100%;
          border-collapse: collapse;
        }

        .books-table th {
          background: var(--bg-accent);
          padding: 15px;
          text-align: left;
          font-weight: 700;
          color: var(--text-primary);
          border-bottom: 2px solid var(--border-color);
          font-size: 0.9rem;
        }

        .books-table td {
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
          vertical-align: middle;
        }

        .book-row:hover {
          background: var(--bg-secondary);
        }

        .book-details {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .book-thumbnail {
          width: 50px;
          height: 65px;
          object-fit: cover;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .book-title {
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .book-isbn {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-family: monospace;
        }

        .book-author {
          font-weight: 600;
          color: var(--text-primary);
        }

        .category-badge {
          background: var(--primary-color);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .book-price {
          font-weight: 700;
          color: var(--success-color);
          font-size: 1.1rem;
        }

        .book-stock {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.in-stock {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.low-stock {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.out-of-stock {
          background: #fee2e2;
          color: #991b1b;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 1rem;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: var(--text-secondary);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 10px;
          color: var(--text-primary);
        }

        .empty-state p {
          margin-bottom: 30px;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
          color: white;
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

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: white;
          border-radius: 20px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px 30px;
          border-bottom: 2px solid var(--border-color);
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-secondary);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: var(--bg-accent);
          color: var(--text-primary);
        }

        .modal-form {
          padding: 30px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .form-input {
          padding: 12px 15px;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-input.error {
          border-color: var(--error-color);
        }

        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-error {
          color: var(--error-color);
          font-size: 0.8rem;
          margin-top: 4px;
        }

        .modal-actions {
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
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
            gap: 20px;
            text-align: center;
          }

          .page-title {
            font-size: 2rem;
          }

          .filters-container {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal {
            margin: 10px;
            max-height: 95vh;
          }

          .modal-form {
            padding: 20px;
          }

          .modal-actions {
            flex-direction: column;
          }

          .books-table th,
          .books-table td {
            padding: 10px 8px;
            font-size: 0.9rem;
          }

          .book-title {
            max-width: 150px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 5px;
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