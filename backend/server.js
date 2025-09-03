const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');

// Import Swagger configuration
const swaggerConfig = require('./config/swagger');

const app = express();

// Add CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

// API Documentation
app.use('/api-docs', swaggerConfig.serve, swaggerConfig.setup);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Book Store API is running with SWAGGER DOCS!',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    features: {
      repositories: '✅ Implemented',
      services: '✅ Implemented', 
      dtos: '✅ Implemented',
      swagger: '✅ LIVE!',
      documentation: '/api-docs'
    }
  });
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    name: 'Book Store API',
    version: '2.0.0',
    description: 'Professional REST API with Repository/Service/DTO pattern',
    documentation: '/api-docs',
    endpoints: {
      authentication: '/api/auth',
      books: '/api/books',
      orders: '/api/orders',
      users: '/api/users'
    },
    features: [
      'Repository Pattern',
      'Service Layer', 
      'DTO Objects',
      'JWT Authentication',
      'Role-based Authorization',
      'Interactive API Documentation'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  // Handle service layer errors
  if (error.message) {
    return res.status(400).json({
      message: error.message
    });
  }

  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    availableEndpoints: {
      health: '/api/health',
      documentation: '/api-docs',
      api: '/api'
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Book Store API: http://localhost:${PORT}/api`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
});