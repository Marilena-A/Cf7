const BookRepository = require('../repositories/BookRepository');
const BookDTO = require('../dto/BookDTO');

class BookService {
  async getAllBooks(queryParams) {
    const { search, category, page, limit, sortBy, sortOrder } = queryParams;

    // Build query
    let query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    const options = { page, limit, sortBy, sortOrder };
    const result = await BookRepository.findAll(query, options);

    // Get categories for filter
    const categories = await BookRepository.getCategories();

    return BookDTO.toListResponse({
      ...result,
      categories
    });
  }

  async getBookById(id) {
    const book = await BookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }
    return BookDTO.toPublicResponse(book);
  }

  async createBook(bookData) {
    // Validate ISBN uniqueness
    if (bookData.isbn) {
      const existingBook = await BookRepository.findOne({ isbn: bookData.isbn });
      if (existingBook) {
        throw new Error('Book with this ISBN already exists');
      }
    }

    const processedData = BookDTO.toCreateRequest(bookData);
    const book = await BookRepository.create(processedData);
    return BookDTO.toAdminResponse(book);
  }

  async updateBook(id, updateData) {
    const book = await BookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    // Check ISBN uniqueness if being updated
    if (updateData.isbn && updateData.isbn !== book.isbn) {
      const existingBook = await BookRepository.findOne({ isbn: updateData.isbn });
      if (existingBook) {
        throw new Error('Book with this ISBN already exists');
      }
    }

    const updatedBook = await BookRepository.updateById(id, updateData);
    return BookDTO.toAdminResponse(updatedBook);
  }

  async deleteBook(id) {
    const book = await BookRepository.findById(id);
    if (!book) {
      throw new Error('Book not found');
    }

    await BookRepository.deleteById(id);
    return { message: 'Book deleted successfully' };
  }

  async getCategories() {
    return await BookRepository.getCategories();
  }

  async checkStock(bookId, quantity) {
    return await BookRepository.checkStock(bookId, quantity);
  }

  async updateStock(bookId, quantity) {
    const book = await BookRepository.updateStock(bookId, quantity);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  }

  async searchBooks(searchTerm) {
    const books = await BookRepository.searchBooks(searchTerm);
    return BookDTO.fromArray(books);
  }

  async getBooksByCategory(category) {
    const books = await BookRepository.findByCategory(category);
    return BookDTO.fromArray(books);
  }

  async getLowStockBooks(threshold = 10) {
    const books = await BookRepository.findAll({ stock: { $lt: threshold } });
    return books.books.map(book => BookDTO.toAdminResponse(book));
  }

  async validateBookOrder(items) {
    const validationResults = [];

    for (const item of items) {
      const book = await BookRepository.findById(item.bookId);
      
      if (!book) {
        validationResults.push({
          bookId: item.bookId,
          valid: false,
          error: 'Book not found'
        });
        continue;
      }

      if (book.stock < item.quantity) {
        validationResults.push({
          bookId: item.bookId,
          title: book.title,
          valid: false,
          error: `Insufficient stock. Available: ${book.stock}, Requested: ${item.quantity}`
        });
        continue;
      }

      validationResults.push({
        bookId: item.bookId,
        title: book.title,
        author: book.author,
        price: book.price,
        valid: true,
        availableStock: book.stock
      });
    }

    return validationResults;
  }
}

module.exports = new BookService();