# 📚 BookStore - Enterprise-Grade Full Stack E-commerce Application

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue.svg)](https://www.docker.com/)


## 🌟 Project Overview

A modern, enterprise-grade bookstore e-commerce application built with cutting-edge technologies. This project demonstrates professional software development practices including clean architecture, comprehensive authentication, advanced user management, real-time inventory tracking, and a complete shopping experience.


### 🎯 Key Highlights
- 🏗️ **Clean Architecture** with Repository → Service → Controller pattern
- 🔐 **Enterprise Authentication** with JWT and role-based access control
- 🛒 **Complete E-commerce Flow** from browsing to order fulfillment
- 👨‍💼 **Professional Admin Dashboard** with analytics and management tools
- 📱 **Mobile-First Responsive Design** with modern UX/UI
- 🐳 **Fully Containerized** development and deployment environment
- 📖 **Interactive API Documentation** with Swagger/OpenAPI
- 🛡️ **Production-Ready Security** with input validation and data sanitization

---

## 🏗️ Architecture & Design Patterns

### Backend Architecture (Node.js/Express)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Controllers   │ ── │    Services     │ ── │  Repositories   │
│ (API Endpoints) │    │ (Business Logic)│    │ (Data Access)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      DTOs       │    │   Middleware    │    │     Models      │
│ (Data Transfer) │    │ (Auth/Validation)│    │ (MongoDB Schema)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Frontend Architecture (React)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Pages       │ ── │   Components    │ ── │    Context      │
│ (Route Views)   │    │ (Reusable UI)   │    │ (Global State)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Services     │    │     Utils       │    │     Assets      │
│ (API Calls)     │    │ (Helpers)       │    │ (Static Files)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🛠️ Technology Stack

### Backend Technologies
| Technology | Version | Purpose | Implementation Details |
|------------|---------|---------|----------------------|
| **Node.js** | 18.x | Runtime Environment | Async/await patterns, ES6+ features |
| **Express.js** | 4.18.x | Web Framework | RESTful API, middleware architecture |
| **MongoDB** | 7.0 | NoSQL Database | Document-based storage, aggregation pipelines |
| **Mongoose** | 8.x | ODM | Schema validation, middleware, population |
| **JWT** | 9.0.x | Authentication | Stateless auth, role-based access control |
| **bcryptjs** | 2.4.x | Password Hashing | Salt rounds: 12, secure password storage |
| **express-validator** | 7.0.x | Input Validation | Schema validation, sanitization |
| **Swagger** | 6.2.x | API Documentation | Interactive docs, request/response examples |
| **CORS** | 2.8.x | Cross-Origin | Configured for development and production |

### Frontend Technologies
| Technology | Version | Purpose | Implementation Details |
|------------|---------|---------|----------------------|
| **React** | 18.2.x | UI Library | Hooks, functional components, Context API |
| **React Router** | 6.8.x | Navigation | Protected routes, nested routing |
| **Axios** | 1.3.x | HTTP Client | Interceptors, error handling, base configuration |
| **CSS3** | - | Styling | CSS Variables, Flexbox, Grid, animations |
| **Context API** | Built-in | State Management | Auth context, cart context |

### DevOps & Infrastructure
| Technology | Version | Purpose | Implementation Details |
|------------|---------|---------|----------------------|
| **Docker** | Latest | Containerization | Multi-container setup, development optimization |
| **Docker Compose** | 3.8 | Container Orchestration | Service definitions, networking, volumes |
| **MongoDB** | 7.0 | Database Container | Persistent volumes, initialization scripts |

---

## 🚀 Quick Start (Docker Only)

### Prerequisites
- **Docker** (20.x or later)
- **Docker Compose** (2.x or later)
- **Git**

### 🐳 One-Command Startup

```bash
# Clone the repository
git clone https://github.com/avasileios/bookstore.git
cd bookstore

# Start the entire application stack
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 📍 Application URLs
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/api/health
- **MongoDB**: localhost:27017

### 🛑 Stopping the Application
```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Stop and remove everything including images
docker-compose down -v --rmi all
```

---

## 🎯 Features & Functionality

### 👤 User Management System

#### Public Features
- ✅ **User Registration** with comprehensive validation
- ✅ **User Authentication** with JWT tokens
- ✅ **Password Security** with bcrypt hashing (12 salt rounds)
- ✅ **Profile Management** with editable user information

#### Authentication Flow
```
Registration → Email/Password Validation → Password Hashing → User Creation → JWT Generation → Auto Login
Login → Credential Validation → Password Verification → JWT Generation → Protected Access
```

### 📚 Book Catalog Management

#### User Features
- ✅ **Advanced Search** by title, author, ISBN, description
- ✅ **Category Filtering** with dynamic category loading
- ✅ **Sorting Options** by title, author, price (ascending/descending)
- ✅ **Pagination** for optimal performance
- ✅ **Book Details** with comprehensive information display
- ✅ **Stock Availability** real-time checking

#### Admin Features
- ✅ **Complete CRUD Operations** for book management
- ✅ **Inventory Management** with stock tracking
- ✅ **Category Management** with dynamic category creation
- ✅ **ISBN Validation** ensuring unique book identification
- ✅ **Image Management** with URL-based book covers
- ✅ **Low Stock Alerts** for inventory management

### 🛒 Shopping Experience

#### Shopping Cart
- ✅ **Persistent Cart** with localStorage integration
- ✅ **Real-time Updates** for quantity changes
- ✅ **Stock Validation** preventing overselling
- ✅ **Price Calculations** with automatic subtotals
- ✅ **Item Management** add, update, remove functionality

#### Checkout Process
```
Cart Review → Shipping Information → Order Validation → Stock Verification → Order Creation → Confirmation
```

### 📦 Order Management System

#### Order Lifecycle
```
Pending → Confirmed → Shipped → Delivered
                ↓
            Cancelled (with stock restoration)
```

#### User Features
- ✅ **Order Placement** with comprehensive validation
- ✅ **Order Tracking** with status updates
- ✅ **Order History** with detailed information
- ✅ **Order Cancellation** (pending orders only)

#### Admin Features
- ✅ **Order Processing** with status management
- ✅ **Inventory Updates** automatic stock adjustments
- ✅ **Revenue Tracking** with order analytics
- ✅ **Customer Management** through order interface

### 👨‍💼 Admin Dashboard

#### Analytics & Reporting
- ✅ **Revenue Metrics** with total and categorized reporting
- ✅ **Order Statistics** by status and time period
- ✅ **User Analytics** registration and role distribution
- ✅ **Inventory Reports** stock levels and alerts

#### Management Tools
- ✅ **User Management** role assignment, user deletion
- ✅ **Book Management** comprehensive catalog control
- ✅ **Order Management** status updates, processing
- ✅ **System Monitoring** health checks and status

---

## 🔐 Security Implementation

### Authentication & Authorization
```javascript
// JWT Token Structure
{
  "userId": "user_id_here",
  "iat": timestamp,
  "exp": timestamp + 7_days
}

// Role-Based Access Control
Admin: Full system access
User: Personal data and shopping features only
```

### Security Features
- ✅ **Password Hashing** bcrypt with 12 salt rounds
- ✅ **JWT Tokens** 7-day expiration with secure storage
- ✅ **Input Validation** comprehensive request sanitization
- ✅ **CORS Configuration** development and production ready
- ✅ **Error Sanitization** no sensitive data exposure
- ✅ **Route Protection** middleware-based access control

### Data Validation
```javascript
// Example validation rules
User Registration:
- Email: valid format, unique
- Password: minimum 6 characters
- Username: minimum 3 characters, unique
- Names: minimum 2 characters

Book Management:
- Title: required, string
- Author: required, string
- Price: positive number
- Stock: non-negative integer
- ISBN: required, unique, minimum 10 characters
```

---

## 🗄️ Database Schema & Operations

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique, min: 3),
  email: String (unique, valid email),
  password: String (bcrypt hashed),
  firstName: String (required),
  lastName: String (required),
  role: String (enum: ['user', 'admin'], default: 'user'),
  address: String (optional),
  phoneNumber: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

#### Books Collection
```javascript
{
  _id: ObjectId,
  title: String (required, indexed for search),
  author: String (required, indexed for search),
  isbn: String (unique, required),
  price: Number (required, min: 0),
  stock: Number (required, min: 0),
  category: String (required),
  description: String (optional, indexed for search),
  imageUrl: String (default provided),
  createdAt: Date,
  updatedAt: Date
}
```

#### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  items: [{
    bookId: ObjectId (ref: 'Book'),
    title: String,
    author: String,
    price: Number,
    quantity: Number,
    subtotal: Number
  }],
  totalAmount: Number,
  status: String (enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']),
  shippingAddress: String (required),
  orderDate: Date (default: now),
  notes: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### 💾 Database Connection & Queries

#### Connecting to MongoDB Container
```bash
# Connect to MongoDB container
docker exec -it bookstore_db mongosh

# Connect with authentication
docker exec -it bookstore_db mongosh -u admin -p password123 --authenticationDatabase admin

# Switch to bookstore database
use bookstore
```

#### Essential Database Operations

##### User Operations
```javascript
// Find all users
db.users.find().pretty()

// Find admin users
db.users.find({role: "admin"}).pretty()

// Find user by email
db.users.find({email: "admin@bookstore.com"}).pretty()

// Count total users
db.users.countDocuments()

// Find recently registered users (last 30 days)
db.users.find({
  createdAt: {
    $gte: new Date(Date.now() - 30*24*60*60*1000)
  }
}).pretty()

// User statistics by role
db.users.aggregate([
  {
    $group: {
      _id: "$role",
      count: { $sum: 1 }
    }
  }
])
```

##### Book Operations
```javascript
// Find all books
db.books.find().pretty()

// Find books by category
db.books.find({category: "Fiction"}).pretty()

// Find books with low stock (less than 10)
db.books.find({stock: {$lt: 10}}).pretty()

// Find books by price range
db.books.find({
  price: {
    $gte: 10,
    $lte: 25
  }
}).pretty()

// Search books by title (case insensitive)
db.books.find({
  title: {
    $regex: "javascript",
    $options: "i"
  }
}).pretty()

// Find most expensive books
db.books.find().sort({price: -1}).limit(5).pretty()

// Books by category with count
db.books.aggregate([
  {
    $group: {
      _id: "$category",
      count: { $sum: 1 },
      averagePrice: { $avg: "$price" },
      totalStock: { $sum: "$stock" }
    }
  },
  {
    $sort: { count: -1 }
  }
])

// Full-text search (requires text index)
db.books.find({
  $text: {
    $search: "programming javascript"
  }
}).pretty()
```

##### Order Operations
```javascript
// Find all orders
db.orders.find().pretty()

// Find orders by status
db.orders.find({status: "pending"}).pretty()

// Find orders by user (replace with actual user ID)
db.orders.find({userId: ObjectId("USER_ID_HERE")}).pretty()

// Find orders with total amount greater than 50
db.orders.find({totalAmount: {$gt: 50}}).pretty()

// Recent orders (last 7 days)
db.orders.find({
  createdAt: {
    $gte: new Date(Date.now() - 7*24*60*60*1000)
  }
}).sort({createdAt: -1}).pretty()

// Order statistics by status
db.orders.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 },
      totalRevenue: { $sum: "$totalAmount" }
    }
  }
])

// Top customers by order count
db.orders.aggregate([
  {
    $group: {
      _id: "$userId",
      orderCount: { $sum: 1 },
      totalSpent: { $sum: "$totalAmount" }
    }
  },
  {
    $sort: { totalSpent: -1 }
  },
  {
    $limit: 10
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "userDetails"
    }
  }
])

// Monthly revenue report
db.orders.aggregate([
  {
    $match: { status: { $ne: "cancelled" } }
  },
  {
    $group: {
      _id: {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" }
      },
      totalRevenue: { $sum: "$totalAmount" },
      orderCount: { $sum: 1 }
    }
  },
  {
    $sort: { "_id.year": -1, "_id.month": -1 }
  }
])
```

#### Advanced Analytics Queries
```javascript
// Most popular books (by order quantity)
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.bookId",
      title: { $first: "$items.title" },
      author: { $first: "$items.author" },
      totalOrdered: { $sum: "$items.quantity" },
      totalRevenue: { $sum: "$items.subtotal" }
    }
  },
  { $sort: { totalOrdered: -1 } },
  { $limit: 10 }
])

// Revenue by category
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "books",
      localField: "items.bookId",
      foreignField: "_id",
      as: "bookDetails"
    }
  },
  { $unwind: "$bookDetails" },
  {
    $group: {
      _id: "$bookDetails.category",
      totalRevenue: { $sum: "$items.subtotal" },
      totalItems: { $sum: "$items.quantity" }
    }
  },
  { $sort: { totalRevenue: -1 } }
])

// User activity report
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders"
    }
  },
  {
    $project: {
      username: 1,
      email: 1,
      firstName: 1,
      lastName: 1,
      role: 1,
      orderCount: { $size: "$orders" },
      totalSpent: {
        $sum: {
          $map: {
            input: "$orders",
            as: "order",
            in: "$$order.totalAmount"
          }
        }
      }
    }
  },
  { $sort: { totalSpent: -1 } }
])
```

#### Database Maintenance Commands
```javascript
// Create indexes for better performance
db.books.createIndex({ title: "text", author: "text", description: "text" })
db.books.createIndex({ category: 1 })
db.books.createIndex({ price: 1 })
db.orders.createIndex({ userId: 1 })
db.orders.createIndex({ status: 1 })
db.orders.createIndex({ createdAt: -1 })

// View existing indexes
db.books.getIndexes()
db.users.getIndexes()
db.orders.getIndexes()

// Database statistics
db.stats()
db.books.stats()
db.users.stats()
db.orders.stats()

// Collection document counts
db.users.countDocuments()
db.books.countDocuments()
db.orders.countDocuments()
```

---

## 🎨 Frontend Implementation

### React Architecture

#### Context Management
```javascript
// AuthContext - User authentication state
- User login/logout functionality
- JWT token management
- Role-based access control
- User profile information

// CartContext - Shopping cart state
- Add/remove items
- Quantity updates
- Price calculations
- localStorage persistence
```

#### Component Structure
```
src/
├── components/
│   ├── Navbar.js              # Navigation with auth state
│   └── ProtectedRoute.js       # Route protection wrapper
├── pages/
│   ├── Home.js                 # Landing page with featured books
│   ├── Books.js                # Book catalog with search/filter
│   ├── BookDetail.js           # Individual book details
│   ├── Cart.js                 # Shopping cart management
│   ├── Checkout.js             # Order placement process
│   ├── Orders.js               # User order history
│   ├── Profile.js              # User profile management
│   ├── Login.js                # User authentication
│   ├── Register.js             # User registration
│   └── admin/
│       ├── AdminDashboard.js   # Admin overview
│       ├── AdminBooks.js       # Book management
│       ├── AdminOrders.js      # Order management
│       └── AdminUsers.js       # User management
├── context/
│   ├── AuthContext.js          # Authentication state
│   └── CartContext.js          # Shopping cart state
└── services/
    └── api.js                  # API communication layer
```

### Responsive Design Features
- ✅ **Mobile-First Approach** optimized for all devices
- ✅ **CSS Grid & Flexbox** modern layout techniques
- ✅ **CSS Variables** consistent theming system
- ✅ **Smooth Animations** enhanced user experience
- ✅ **Touch-Friendly** mobile interaction optimization

---

## 📖 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
```json
Request:
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "address": "123 Main Street, City"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST `/api/auth/login`
```json
Request:
{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Book Management Endpoints

#### GET `/api/books`
```
Query Parameters:
- search: string (search in title, author, description)
- category: string (filter by category)
- page: number (pagination)
- limit: number (items per page)
- sortBy: string (title, author, price)
- sortOrder: string (asc, desc)

Response:
{
  "books": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalBooks": 50
  },
  "categories": ["Fiction", "Programming", ...]
}
```

#### POST `/api/books` (Admin Only)
```json
Request:
{
  "title": "Advanced JavaScript",
  "author": "John Smith",
  "isbn": "978-1234567890",
  "price": 29.99,
  "stock": 100,
  "category": "Programming",
  "description": "Comprehensive guide to JavaScript",
  "imageUrl": "https://example.com/book-cover.jpg"
}
```

### Order Management Endpoints

#### POST `/api/orders`
```json
Request:
{
  "items": [
    {
      "bookId": "book_id_here",
      "quantity": 2
    }
  ],
  "shippingAddress": "123 Main Street, City, Country",
  "notes": "Please handle with care"
}

Response:
{
  "message": "Order created successfully",
  "order": {
    "id": "order_id",
    "totalAmount": 59.98,
    "status": "pending",
    "items": [...]
  }
}
```

#### PUT `/api/orders/:id/status` (Admin Only)
```json
Request:
{
  "status": "shipped"
}

Response:
{
  "message": "Order status updated successfully",
  "order": {
    "id": "order_id",
    "status": "shipped",
    ...
  }
}
```

### Interactive API Documentation
- **Swagger UI**: http://localhost:5000/api-docs
- **Complete endpoint documentation** with request/response examples
- **Try it out functionality** for testing endpoints
- **Authentication integration** for protected endpoints

---

## 🔗 Pre-seeded Data

### Default User Accounts

#### Administrator Account
```
Email: admin@bookstore.com
Password: admin123
Role: Admin
Features: Full system access, user management, book management, order processing
```

#### Regular User Account
```
Email: john@example.com  
Password: user123
Role: User
Features: Browse books, place orders, manage profile
```

### Sample Books Catalog
The database is pre-populated with 10 diverse books across multiple categories:

1. **1984** by George Orwell (Fiction) - €13.99
2. **The Martian** by Andy Weir (Science Fiction) - €17.99
3. **The Da Vinci Code** by Dan Brown (Mystery) - €16.00
4. **The Notebook** by Nicholas Sparks (Romance) - €11.99
5. **Becoming** by Michelle Obama (Biography) - €24.99
6. **Sapiens** by Yuval Noah Harari (History) - €19.99
7. **The Name of the Wind** by Patrick Rothfuss (Fantasy) - €22.00
8. **Atomic Habits** by James Clear (Self-Help) - €18.99
9. **Meditations** by Marcus Aurelius (Philosophy) - €10.99
10. **Refactoring** by Martin Fowler (Programming) - €47.99

### Categories Available
- Fiction
- Science Fiction  
- Mystery
- Romance
- Biography
- History
- Fantasy
- Self-Help
- Philosophy
- Programming

---

## 🧪 Testing the Application

### Manual Testing Workflows

#### User Registration & Authentication Flow
```bash
1. Visit http://localhost:3000
2. Click "Sign Up" 
3. Fill registration form with valid data
4. Verify automatic login after registration
5. Test logout functionality
6. Test login with created credentials
```

#### Shopping Flow Testing
```bash
1. Browse books at http://localhost:3000/books
2. Use search and filter functionality
3. Add books to cart
4. Verify cart persistence (refresh page)
5. Proceed to checkout
6. Complete order placement
7. Verify order in "My Orders" section
```

#### Admin Features Testing
```bash
1. Login as admin (admin@bookstore.com / admin123)
2. Access admin dashboard at http://localhost:3000/admin
3. Test book management (add/edit/delete)
4. Test user management (role changes)
5. Test order management (status updates)
6. Verify analytics and statistics
```

### API Testing with curl

#### Authentication Test
```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "testpass123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bookstore.com",
    "password": "admin123"
  }'
```

#### Books API Test
```bash
# Get all books
curl -X GET "http://localhost:5000/api/books"

# Search books
curl -X GET "http://localhost:5000/api/books?search=javascript&category=Programming"

# Get single book
curl -X GET "http://localhost:5000/api/books/BOOK_ID_HERE"
```

#### Protected Routes Test
```bash
# Get user profile (requires auth token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create order (requires auth token)
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [{"bookId": "BOOK_ID", "quantity": 1}],
    "shippingAddress": "123 Test Street"
  }'
```

---

## 🐳 Docker Configuration Details

### Docker Compose Services

#### MongoDB Service
```yaml
mongodb:
  image: mongo:7.0
  container_name: bookstore_db
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: password123
    MONGO_INITDB_DATABASE: bookstore
  ports:
    - "27017:27017"
  volumes:
    - mongodb_data:/data/db
    - ./database/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro
```

#### Backend Service
```yaml
backend:
  build: ./backend
  container_name: bookstore_api
  environment:
    NODE_ENV: development
    MONGODB_URI: mongodb://admin:password123@mongodb:27017/bookstore?authSource=admin
    JWT_SECRET: your_super_secret_jwt_key_change_in_production
    PORT: 5000
  ports:
    - "5000:5000"
  depends_on:
    - mongodb
```

#### Frontend Service
```yaml
frontend:
  build: ./frontend
  container_name: bookstore_web  
  environment:
    REACT_APP_API_URL: http://localhost:5000/api
    CHOKIDAR_USEPOLLING: true
  ports:
    - "3000:3000"
  depends_on:
    - backend
```

### Container Management Commands

#### Development Commands
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Follow logs in real-time
docker-compose logs -f

# Restart specific service
docker-compose restart backend

# Rebuild specific service
docker-compose up --build backend

# Execute commands in running containers
docker-compose exec backend npm install new-package
docker-compose exec mongodb mongosh
```

#### Database Management
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p password123

# Backup database
docker-compose exec mongodb mongodump -u admin -p password123 --authenticationDatabase admin --db bookstore --out /backup

# Restore database  
docker-compose exec mongodb mongorestore -u admin -p password123 --authenticationDatabase admin --db bookstore /backup/bookstore
```

---

### Environment Variables for Production
```env
# Backend (.env)
NODE_ENV=production
MONGODB_URI=mongodb://username:password@production-host:27017/bookstore
JWT_SECRET=your_super_secure_production_jwt_secret_256_bit
PORT=5000

# Frontend (.env)
REACT_APP_API_URL=https://your-production-api-domain.com/api
GENERATE_SOURCEMAP=false
```

## 📊 Performance Metrics & Monitoring

### Database Performance
```javascript
// Index optimization for common queries
db.books.createIndex({ title: "text", author: "text", description: "text" })
db.books.createIndex({ category: 1, price: 1 })
db.books.createIndex({ createdAt: -1 })
db.orders.createIndex({ userId: 1, createdAt: -1 })
db.orders.createIndex({ status: 1 })

// Query performance analysis
db.books.find({category: "Programming"}).explain("executionStats")
db.orders.find({userId: ObjectId("USER_ID")}).explain("executionStats")
```

### Application Monitoring
```bash
# Container resource usage
docker stats

# Database performance
docker-compose exec mongodb mongostat
docker-compose exec mongodb mongotop

# Application logs
docker-compose logs -f --tail=100 backend
docker-compose logs -f --tail=100 frontend
```

### Performance Benchmarks
- **Page Load Time**: < 2 seconds
- **API Response Time**: < 200ms average
- **Database Query Time**: < 50ms average
- **Memory Usage**: < 512MB per container
- **CPU Usage**: < 50% under normal load

---

## 🔍 Troubleshooting Guide

### Common Issues & Solutions

#### Database Connection Issues
```bash
# Check MongoDB container status
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Test database connection
docker-compose exec mongodb mongosh -u admin -p password123

# Restart MongoDB service
docker-compose restart mongodb
```

#### Backend API Issues
```bash
# Check backend container status
docker-compose ps backend

# View backend logs
docker-compose logs backend

# Check API health endpoint
curl http://localhost:5000/api/health

# Restart backend service
docker-compose restart backend

# Rebuild backend with new changes
docker-compose up --build backend
```

#### Frontend Loading Issues
```bash
# Check frontend container status
docker-compose ps frontend

# View frontend logs
docker-compose logs frontend

# Clear browser cache and reload
# Check network tab in browser dev tools

# Restart frontend service
docker-compose restart frontend

# Rebuild frontend with new changes
docker-compose up --build frontend
```

#### Port Conflicts
```bash
# Check if ports are already in use
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
netstat -tulpn | grep :27017

# Kill processes using the ports
sudo kill -9 $(lsof -t -i:3000)
sudo kill -9 $(lsof -t -i:5000)
sudo kill -9 $(lsof -t -i:27017)
```

#### Docker Issues
```bash
# Clean up Docker system
docker system prune -a

# Remove all containers and volumes
docker-compose down -v --rmi all

# Rebuild everything from scratch
docker-compose up --build --force-recreate

# Check Docker daemon status
sudo systemctl status docker

# Restart Docker daemon
sudo systemctl restart docker
```

### Database Debugging Commands
```javascript
// Check database connectivity
db.runCommand({ connectionStatus: 1 })

// Verify collections exist
show collections

// Check collection document counts
db.users.countDocuments()
db.books.countDocuments()
db.orders.countDocuments()

// Find problematic documents
db.books.find({ price: { $type: "string" } }) // Price should be number
db.users.find({ email: { $regex: /.*@.*/, $options: "i" } }) // Valid emails
db.orders.find({ totalAmount: { $lte: 0 } }) // Invalid orders

// Check indexes
db.books.getIndexes()
db.users.getIndexes()
db.orders.getIndexes()
```

---


### ✅ Completed Features
- [x] User authentication and authorization
- [x] Book catalog with search and filtering
- [x] Shopping cart functionality
- [x] Order management system
- [x] Admin dashboard and management tools
- [x] Responsive design implementation
- [x] Docker containerization
- [x] API documentation with Swagger
- [x] Database seeding with sample data
- [x] Security implementation (JWT, bcrypt, validation)
- [x] Error handling and user feedback
- [x] Professional UI/UX design

### 🎯 Project Specifications Met
- [x] Domain Model implementation (Books, Users, Orders)
- [x] Database design and implementation (MongoDB)
- [x] Repository layer for data access
- [x] Service layer for business logic
- [x] DTO objects for data transformation
- [x] REST API controllers
- [x] Authentication system (backend and frontend)
- [x] Frontend framework implementation (React)
- [x] Full-stack integration
- [x] Professional documentation

---

## 📞 Support & Resources

### Documentation Links
- **Swagger API Docs**: http://localhost:5000/api-docs
- **MongoDB Documentation**: https://docs.mongodb.com/
- **React Documentation**: https://reactjs.org/docs/
- **Express.js Documentation**: https://expressjs.com/
- **Docker Documentation**: https://docs.docker.com/

### Quick Reference
```bash
# Essential Commands
docker-compose up --build          # Start application
docker-compose down               # Stop application
docker-compose logs -f            # View logs
docker exec -it bookstore_db mongosh  # Access database

# Application URLs
Frontend: http://localhost:3000
Backend:  http://localhost:5000
API Docs: http://localhost:5000/api-docs
Health:   http://localhost:5000/api/health
```



---




### Built with ❤️

