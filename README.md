# BookStore - Full Stack E-commerce Application

## Build & Deploy Instructions

Η εφαρμογή έχει υλοποιηθεί με Docker ώστε να μπορεί να τρέξει εύκολα χωρίς να χρειάζεται να εγκατασταστούν τοπικά όλα τα απαραίτητα requirements (Node.js, MongoDB, React κ.λπ.).

### Βήματα Εκτέλεσης

```bash
# 1. Κλωνοποίηση του repository
git clone https://github.com/Marilena-A/Cf7.git
cd Cf7

# 2. Εκκίνηση όλου του stack
docker-compose up -d --build

# 3. Τερματισμός όλων των containers
docker-compose down
```

### Application URLs
- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000  
- API Documentation (Swagger): http://localhost:5000/api-docs  
- Health Check: http://localhost:5000/api/health  

---

## Default Accounts (για δοκιμές)
- Admin → `admin@bookstore.com` / `admin123`  
- User → `john@example.com` / `user123`

---

Σημείωση: Η εργασία παραδίδεται σε Dockerized περιβάλλον ώστε το build και το deploy να γίνονται με μία εντολή (`docker-compose up --build`).

## Αναλυτική Τεκμηρίωση

Για περισσότερες λεπτομέρειες σχετικά με την αρχιτεκτονική, τη βάση δεδομένων, τα API endpoints και την τεκμηρίωση του κώδικα, δείτε το αρχείο [DOCUMENTATION.md](./DOCUMENTATION.md).
