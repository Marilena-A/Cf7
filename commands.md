# 🚀 BookStore - Quick Commands Reference

## ⚡ Essential Commands (Copy & Paste Ready)

### 🐳 Docker Commands

#### Start the Application
```bash
# Start everything (first time)
docker-compose up --build

# Start everything (subsequent times)
docker-compose up

# Start in background (detached mode)
docker-compose up -d
```

#### Stop the Application
```bash
# Stop all containers
docker-compose down

# Stop and remove everything (fresh start)
docker-compose down -v --rmi all
```

#### View Status & Logs
```bash
# Check running containers
docker-compose ps

# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Follow logs in real-time
docker-compose logs -f
```

#### Restart Services
```bash
# Restart specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mongodb

# Rebuild and restart specific service
docker-compose up --build backend
```

---

## 🗄️ Database Commands

### Connect to MongoDB
```bash
# Connect to MongoDB container
docker exec -it bookstore_db mongosh

# Connect with authentication
docker exec -it bookstore_db mongosh -u admin -p password123 --authenticationDatabase admin

# Switch to bookstore database (once connected)
use bookstore
```

### Quick Database Queries

#### View All Data
```javascript
// See all users
db.users.find().pretty()

// See all books
db.books.find().pretty()

// See all orders
db.orders.find().pretty()

// Count documents
db.users.countDocuments()
db.books.countDocuments()
db.orders.countDocuments()
```

#### Find Specific Data
```javascript
// Find admin users
db.users.find({role: "admin"}).pretty()

// Find books by category
db.books.find({category: "Fiction"}).pretty()

// Find low stock books
db.books.find({stock: {$lt: 10}}).pretty()

// Find pending orders
db.orders.find({status: "pending"}).pretty()

// Find user by email
db.users.find({email: "admin@bookstore.com"}).pretty()
```

#### Useful Analytics
```javascript
// Users by role
db.users.aggregate([{$group: {_id: "$role", count: {$sum: 1}}}])

// Orders by status
db.orders.aggregate([{$group: {_id: "$status", count: {$sum: 1}, total: {$sum: "$totalAmount"}}}])

// Books by category
db.books.aggregate([{$group: {_id: "$category", count: {$sum: 1}, avgPrice: {$avg: "$price"}}}])

// Total revenue
db.orders.aggregate([{$match: {status: {$ne: "cancelled"}}}, {$group: {_id: null, totalRevenue: {$sum: "$totalAmount"}}}])
```

---

## 🌐 Application URLs

```bash
# Frontend (User Interface)
http://localhost:3000

# Backend API
http://localhost:5000

# API Documentation (Swagger)
http://localhost:5000/api-docs

# Health Check
http://localhost:5000/api/health
```

---

## 🔐 Default Login Accounts

### Admin Account
```
Email: admin@bookstore.com
Password: admin123
Access: Full admin panel, user management, book management
```

### User Account
```
Email: john@example.com
Password: user123
Access: Browse books, place orders, manage profile
```

---

## 🧪 API Testing Commands (curl)

### Authentication
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

### Books API
```bash
# Get all books
curl -X GET "http://localhost:5000/api/books"

# Search books
curl -X GET "http://localhost:5000/api/books?search=javascript"

# Get books by category
curl -X GET "http://localhost:5000/api/books?category=Programming"
```

### Protected Routes (Need JWT Token)
```bash
# Get user profile (replace YOUR_JWT_TOKEN)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create order (replace YOUR_JWT_TOKEN and BOOK_ID)
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "items": [{"bookId": "BOOK_ID", "quantity": 1}],
    "shippingAddress": "123 Test Street"
  }'
```

---

## 🛠️ Troubleshooting Commands

### Check If Ports Are Used
```bash
# Check if ports are busy
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
netstat -tulpn | grep :27017

# Kill processes on ports (if needed)
sudo kill -9 $(lsof -t -i:3000)
sudo kill -9 $(lsof -t -i:5000)
sudo kill -9 $(lsof -t -i:27017)
```

### Docker Cleanup
```bash
# Remove unused Docker resources
docker system prune -a

# Remove all containers and volumes
docker-compose down -v --rmi all

# Rebuild everything from scratch
docker-compose up --build --force-recreate
```

### Container Resource Usage
```bash
# Check container resource usage
docker stats

# Check specific container
docker stats bookstore_web bookstore_api bookstore_db
```

---

## 📊 Quick Health Checks

### Test if Everything is Running
```bash
# Check frontend
curl -I http://localhost:3000

# Check backend health
curl http://localhost:5000/api/health

# Check API docs
curl -I http://localhost:5000/api-docs

# Test database connection
docker exec bookstore_db mongosh --eval "db.runCommand('ping')"
```

### Verify Sample Data Loaded
```bash
# Quick check if data exists
docker exec -it bookstore_db mongosh --eval "
use bookstore
print('Users:', db.users.countDocuments())
print('Books:', db.books.countDocuments())
print('Admin exists:', db.users.findOne({role: 'admin'}) ? 'Yes' : 'No')
"
```

---

## 🎯 One-Line Shortcuts

```bash
# Complete restart
docker-compose down && docker-compose up --build

# Quick database check
docker exec -it bookstore_db mongosh --eval "use bookstore; db.stats()"

# View last 50 log lines
docker-compose logs --tail=50

# Start and show logs
docker-compose up -d && docker-compose logs -f

# Nuclear reset (remove everything)
docker-compose down -v --rmi all && docker system prune -a

# Health check all services
curl -s http://localhost:3000 > /dev/null && echo "Frontend: ✅" || echo "Frontend: ❌"; curl -s http://localhost:5000/api/health > /dev/null && echo "Backend: ✅" || echo "Backend: ❌"
```

---

## 🚨 Emergency Commands

### If Application Won't Start
```bash
# Reset Docker completely
docker system prune -a
docker-compose up --build
```

### If Database Won't Connect
```bash
# Restart just the database
docker-compose restart mongodb

# Check database logs
docker-compose logs mongodb

# Recreate database container
docker-compose stop mongodb
docker-compose rm mongodb
docker-compose up mongodb
```

---

## 💡 Pro Tips

1. **Always use `docker-compose up --build`** for the first run
2. **Use `docker-compose logs -f`** to debug issues
3. **Run `docker-compose down -v`** to reset everything cleanly
4. **Check `docker-compose ps`** to see which containers are running
5. **Use MongoDB commands inside the container** with `docker exec -it bookstore_db mongosh`

---

## 📞 Quick Reference Card

| What you want to do | Command |
|-------------------|---------|
| Start application | `docker-compose up --build` |
| Stop application | `docker-compose down` |
| View logs | `docker-compose logs -f` |
| Connect to database | `docker exec -it bookstore_db mongosh` |
| Reset everything | `docker-compose down -v --rmi all` |
| Check status | `docker-compose ps` |
| Emergency restart | `docker-compose down && docker-compose up --build` |

**Remember**: Always run commands from the project root directory (where `docker-compose.yml` is located)!