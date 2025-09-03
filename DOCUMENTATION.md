# 📚 BookStore - Enterprise-Grade Full Stack E-commerce Application

##  Project Overview

A modern, enterprise-grade bookstore e-commerce application built with cutting-edge technologies. This project demonstrates professional software development practices including clean architecture, comprehensive authentication, advanced user management, real-time inventory tracking, and a complete shopping experience.


##  Quick Start (Docker Only)

### Prerequisites
- **Docker** (20.x or later)
- **Docker Compose** (2.x or later)
- **Git**

###  One-Command Startup

```bash
# Clone the repository
git clone https://github.com/Marilena-A/Cf7.git
cd Cf7

# Start the entire application stack
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

###  Application URLs
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/api/health
- **MongoDB**: localhost:27017

###  Stopping the Application
```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Stop and remove everything including images
docker-compose down -v --rmi all
```

---

## Features & Functionality

### User Management System

#### Public Features
- ✅ **User Registration** with comprehensive validation
- ✅ **User Authentication** with JWT tokens
- ✅ **Password Security** with bcrypt hashing (12 salt rounds)
- ✅ **Profile Management** with editable user information



### Book Catalog Management

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

### Shopping Experience

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

### Order Management System

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

### Admin Dashboard

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

##  Security Implementation

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

## Database Schema 

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

##  API Documentation

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

##  Testing the Application

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



---

## Troubleshooting Guide

#### Docker Issues
```bash
# Remove all containers and volumes
docker-compose down -v --rmi all

# Rebuild everything from scratch
docker-compose up --build --force-recreate

```

## ✅ Completed Features
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

## 🎯 Project Specifications Met
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

##  Support

### Documentation Links
- **Swagger API Docs**: http://localhost:5000/api-docs

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

