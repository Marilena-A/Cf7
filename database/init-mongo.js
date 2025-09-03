// MongoDB initialization script
// This runs when the database container starts for the first time

db = db.getSiblingDB('bookstore');

// Create collections
db.createCollection('users');
db.createCollection('books');
db.createCollection('orders');
db.createCollection('categories');

// Insert sample categories
db.categories.insertMany([
  { name: 'Fiction', description: 'Novels and fictional stories' },
  { name: 'Science Fiction', description: 'Futuristic and scientific fiction' },
  { name: 'Mystery', description: 'Mystery and thriller books' },
  { name: 'Romance', description: 'Love and romance stories' },
  { name: 'Biography', description: 'Life stories of real people' },
  { name: 'Programming', description: 'Technical books about programming' },
  { name: 'History', description: 'Historical accounts and nonfiction' },
  { name: 'Fantasy', description: 'Magic, mythical beings, and epic quests' },
  { name: 'Self-Help', description: 'Books to improve personal life and productivity' },
  { name: 'Philosophy', description: 'Exploring the nature of knowledge and existence' }
]);


// Insert sample books
db.books.insertMany([
  {
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0-452-28423-4',
    price: 13.99,
    stock: 40,
    category: 'Fiction',
    description: 'A dystopian novel about totalitarianism.',
    imageUrl: 'https://m.media-amazon.com/images/I/71wANojhEKL.jpg',
    createdAt: new Date()
  },
  {
    title: 'The Martian',
    author: 'Andy Weir',
    isbn: '978-0-8041-3902-1',
    price: 17.99,
    stock: 20,
    category: 'Science Fiction',
    description: 'A stranded astronaut on Mars uses science to survive.',
    imageUrl: 'https://m.media-amazon.com/images/I/810W+zAp2DL._UF1000,1000_QL80_.jpg',
    createdAt: new Date()
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    isbn: '978-0-385-50420-8',
    price: 16.00,
    stock: 25,
    category: 'Mystery',
    description: 'A symbologist uncovers a secret society.',
    imageUrl: 'https://m.media-amazon.com/images/I/71QST3bEo8L._SL1500_.jpg',
    createdAt: new Date()
  },
  {
    title: 'The Notebook',
    author: 'Nicholas Sparks',
    isbn: '978-0-446-52080-5',
    price: 11.99,
    stock: 35,
    category: 'Romance',
    description: 'A touching love story across decades.',
    imageUrl: 'https://m.media-amazon.com/images/I/81WIhP1ca9L.jpg',
    createdAt: new Date()
  },
  {
    title: 'Becoming',
    author: 'Michelle Obama',
    isbn: '978-1-5247-6313-8',
    price: 24.99,
    stock: 22,
    category: 'Biography',
    description: 'The former First Lady shares her inspiring journey.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/0/09/Becoming_%28Michelle_Obama_book%29.jpg',
    createdAt: new Date()
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    isbn: '978-0-06-231609-7',
    price: 19.99,
    stock: 30,
    category: 'History',
    description: 'A brief history of humankind.',
    imageUrl: 'https://m.media-amazon.com/images/I/919PxBmnG1L._UF1000,1000_QL80_.jpg',
    createdAt: new Date()
  },
  {
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    isbn: '978-0-7564-0475-7',
    price: 22.00,
    stock: 28,
    category: 'Fantasy',
    description: 'The legendary tale of a gifted young magician.',
    imageUrl: 'https://m.media-amazon.com/images/I/61663XePEpL._UF1000,1000_QL80_.jpg',
    createdAt: new Date()
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0-7352-1129-2',
    price: 18.99,
    stock: 50,
    category: 'Self-Help',
    description: 'Tiny changes, remarkable results.',
    imageUrl: 'https://m.media-amazon.com/images/I/71F4+7rk2eL._UF894,1000_QL80_.jpg',
    createdAt: new Date()
  },
  {
    title: 'Meditations',
    author: 'Marcus Aurelius',
    isbn: '978-0-14-044933-4',
    price: 10.99,
    stock: 45,
    category: 'Philosophy',
    description: 'Reflections of a Roman emperor on life and leadership.',
    imageUrl: 'https://m.media-amazon.com/images/I/71FCbiv0tTL._UF1000,1000_QL80_.jpg',
    createdAt: new Date()
  },
  {
    title: 'Refactoring',
    author: 'Martin Fowler',
    isbn: '978-0-13-475759-9',
    price: 47.99,
    stock: 18,
    category: 'Programming',
    description: 'Improving the design of existing code.',
    imageUrl: 'https://m.media-amazon.com/images/I/71TGolfP8fL._UF1000,1000_QL80_.jpg',
    createdAt: new Date()
  }
]);

// Create admin user (password: admin123)
db.users.insertOne({
  username: 'admin',
  email: 'admin@bookstore.com',
  password: '$2a$12$RTHc.aTuLDgrsrOVAqCane0pIL.N.jSTTk6tsThOMJz3POZQqwimi', // This is 'admin123' hashed
  role: 'admin',
  firstName: 'Admin',
  lastName: 'User',
  address: '123 Admin Street',
  createdAt: new Date()
});

// Create sample user (password: user123)
db.users.insertOne({
  username: 'john_doe',
  email: 'john@example.com',
  password: '$2a$12$iVVNQi8TFFw8xAehDQ8k4OB7ee7gCO5XeHQZxAej/8cJQtvwuMfmy', // This is 'user123' hashed
  role: 'user',
  firstName: 'John',
  lastName: 'Doe',
  address: '456 User Avenue',
  createdAt: new Date()
});

print('Database initialized with sample data!');
print('Admin user: admin@bookstore.com / admin123');
print('Sample user: john@example.com / user123');