class BookDTO {
  constructor(book) {
    this.id = book._id;
    this.title = book.title;
    this.author = book.author;
    this.isbn = book.isbn;
    this.price = book.price;
    this.stock = book.stock;
    this.category = book.category;
    this.description = book.description;
    this.imageUrl = book.imageUrl;
    this.createdAt = book.createdAt;
    this.updatedAt = book.updatedAt;
  }

  static fromArray(books) {
    return books.map(book => new BookDTO(book));
  }

  static toPublicResponse(book) {
    return {
      id: book._id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      price: book.price,
      stock: book.stock,
      category: book.category,
      description: book.description,
      imageUrl: book.imageUrl,
      isAvailable: book.stock > 0
    };
  }

  static toAdminResponse(book) {
    return {
      id: book._id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      price: book.price,
      stock: book.stock,
      category: book.category,
      description: book.description,
      imageUrl: book.imageUrl,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt,
      isAvailable: book.stock > 0,
      lowStock: book.stock < 10
    };
  }

  static toListResponse(booksData) {
    return {
      books: booksData.books.map(book => BookDTO.toPublicResponse(book)),
      pagination: booksData.pagination,
      categories: booksData.categories || []
    };
  }

  static toCreateRequest(data) {
    return {
      title: data.title?.trim(),
      author: data.author?.trim(),
      isbn: data.isbn?.trim(),
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      category: data.category?.trim(),
      description: data.description?.trim(),
      imageUrl: data.imageUrl?.trim()
    };
  }
}

module.exports = BookDTO;