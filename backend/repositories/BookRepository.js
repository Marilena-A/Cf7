const Book = require('../models/Book');

class BookRepository {
  async findAll(query = {}, options = {}) {
    const { page = 1, limit = 12, sortBy = 'title', sortOrder = 'asc' } = options;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const books = await Book.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);

    return {
      books,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBooks: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }

  async findById(id) {
    return await Book.findById(id);
  }

  async findOne(query) {
    return await Book.findOne(query);
  }

  async create(bookData) {
    const book = new Book(bookData);
    return await book.save();
  }

  async updateById(id, updateData) {
    return await Book.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
  }

  async deleteById(id) {
    return await Book.findByIdAndDelete(id);
  }

  async updateStock(id, quantity) {
    return await Book.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true }
    );
  }

  async getCategories() {
    return await Book.distinct('category');
  }

  async searchBooks(searchTerm) {
    return await Book.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { author: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    });
  }

  async findByCategory(category) {
    return await Book.find({ category });
  }

  async checkStock(id, requiredQuantity) {
    const book = await this.findById(id);
    return book && book.stock >= requiredQuantity;
  }

  async getStockCount(id) {
    const book = await this.findById(id);
    return book ? book.stock : 0;
  }
}

module.exports = new BookRepository();