const express = require('express');
const { body, validationResult } = require('express-validator');
const BookService = require('../services/BookService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search books by title, author, or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of books with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/', async (req, res) => {
  try {
    const result = await BookService.getAllBooks(req.query);
    res.json(result);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error while fetching books' });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', async (req, res) => {
  try {
    const book = await BookService.getBookById(req.params.id);
    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    if (error.message === 'Book not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while fetching book' });
  }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - price
 *               - stock
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "The Great Book"
 *               author:
 *                 type: string
 *                 example: "Amazing Author"
 *               isbn:
 *                 type: string
 *                 example: "978-1234567890"
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 19.99
 *               stock:
 *                 type: integer
 *                 example: 50
 *               category:
 *                 type: string
 *                 example: "Fiction"
 *               description:
 *                 type: string
 *                 example: "An amazing book about amazing things"
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/book-cover.jpg"
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book created successfully"
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error or ISBN already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const result = await BookService.createBook(req.body);
    res.status(201).json({
      message: 'Book created successfully',
      book: result
    });

  } catch (error) {
    console.error('Create book error:', error);
    if (error.message === 'Book with this ISBN already exists') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while creating book' });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: float
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book updated successfully"
 *                 book:
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Book not found
 */
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('author').optional().notEmpty().withMessage('Author cannot be empty'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const result = await BookService.updateBook(req.params.id, req.body);
    res.json({
      message: 'Book updated successfully',
      book: result
    });

  } catch (error) {
    console.error('Update book error:', error);
    if (error.message === 'Book not found') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === 'Book with this ISBN already exists') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while updating book' });
  }
});

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book (Admin only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book deleted successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Book not found
 */
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await BookService.deleteBook(req.params.id);
    res.json(result);
  } catch (error) {
    console.error('Delete book error:', error);
    if (error.message === 'Book not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error while deleting book' });
  }
});

/**
 * @swagger
 * /api/books/categories/list:
 *   get:
 *     summary: Get all unique categories
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["Fiction", "Science Fiction", "Programming", "Romance"]
 */
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await BookService.getCategories();
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

module.exports = router;