# Complete CRUD API Documentation

This document provides a comprehensive overview of all CRUD (Create, Read, Update, Delete) operations available in the Library Management API.

## Authentication

All endpoints require JWT authentication unless specified otherwise. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📚 Books CRUD Operations

### Create Book
- **Endpoint:** `POST /books/`
- **Auth:** Admin only
- **Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "category": "Fiction",
  "description": "A classic American novel",
  "publication_year": 1925,
  "total_copies": 5
}
```
- **Response:** `201 Created` - Returns the created book object

### Read Books
- **Endpoint:** `GET /books/`
- **Auth:** Authenticated users
- **Query Params:** `skip` (default: 0), `limit` (default: 100)
- **Response:** Returns array of book objects

### Read Single Book
- **Endpoint:** `GET /books/{book_id}`
- **Auth:** Authenticated users
- **Response:** Returns single book object or `404 Not Found`

### Update Book
- **Endpoint:** `PUT /books/{book_id}`
- **Auth:** Admin only
- **Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "category": "Updated Category",
  "description": "Updated description",
  "publication_year": 2024,
  "total_copies": 10
}
```
- **Response:** Returns updated book object

### Delete Book
- **Endpoint:** `DELETE /books/{book_id}`
- **Auth:** Admin only
- **Response:** `{"message": "Book deleted successfully"}`
- **Note:** Cannot delete books with active loans

---

## 👥 Users CRUD Operations

### Create User
- **Endpoint:** `POST /auth/register`
- **Auth:** Public
- **Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}
```
- **Response:** `201 Created` - Returns user info and access token

### Read Users
- **Endpoint:** `GET /users/`
- **Auth:** Admin only
- **Query Params:** `skip` (default: 0), `limit` (default: 100)
- **Response:** Returns array of user objects

### Read Single User
- **Endpoint:** `GET /users/{user_id}`
- **Auth:** Admin only
- **Response:** Returns single user object or `404 Not Found`

### Update User
- **Endpoint:** `PUT /users/{user_id}`
- **Auth:** Admin only
- **Request Body:** (all fields optional)
```json
{
  "email": "newemail@example.com",
  "username": "newusername"
}
```
- **Response:** Returns updated user object
- **Note:** Email and username must be unique

### Update User Role
- **Endpoint:** `PUT /users/{user_id}/role`
- **Auth:** Admin only
- **Request Body:** `role` (string: "ADMIN" or "USER")
- **Response:** `{"message": "User role updated to ADMIN"}`

### Activate User
- **Endpoint:** `PUT /users/{user_id}/activate`
- **Auth:** Admin only
- **Response:** `{"message": "User activated successfully"}`

### Deactivate User
- **Endpoint:** `PUT /users/{user_id}/deactivate`
- **Auth:** Admin only
- **Response:** `{"message": "User deactivated successfully"}`
- **Note:** Cannot deactivate your own account

### Delete User
- **Endpoint:** `DELETE /users/{user_id}`
- **Auth:** Admin only
- **Response:** `{"message": "User deleted successfully"}`
- **Note:** Cannot delete users with active loans or your own account

---

## 📖 Loans CRUD Operations

### Create Loan (Admin)
- **Endpoint:** `POST /loans/`
- **Auth:** Admin only
- **Request Body:**
```json
{
  "user_id": 1,
  "book_id": 1,
  "due_date": "2024-02-15T00:00:00Z"
}
```
- **Response:** `201 Created` - Returns created loan object
- **Note:** Automatically decrements book's available_copies

### Read All Loans
- **Endpoint:** `GET /loans/all`
- **Auth:** Admin only
- **Query Params:** `skip` (default: 0), `limit` (default: 100)
- **Response:** Returns array of loan objects

### Read Single Loan
- **Endpoint:** `GET /loans/{loan_id}`
- **Auth:** Authenticated users (own loans) or Admin (any loan)
- **Response:** Returns single loan object or `404 Not Found`
- **Authorization:** Users can only view their own loans

### Update Loan
- **Endpoint:** `PUT /loans/{loan_id}`
- **Auth:** Admin only
- **Request Body:** (all fields optional)
```json
{
  "due_date": "2024-03-01T00:00:00Z",
  "status": "RETURNED"
}
```
- **Response:** Returns updated loan object
- **Note:** Updating status to "RETURNED" automatically increments book's available_copies

### Delete Loan
- **Endpoint:** `DELETE /loans/{loan_id}`
- **Auth:** Admin only
- **Response:** `{"message": "Loan deleted successfully"}`
- **Note:** Automatically restores book availability if loan was active

---

## 🎯 User-Facing Loan Operations

### Borrow Book
- **Endpoint:** `POST /loans/borrow/{book_id}`
- **Auth:** Authenticated users
- **Query Params:** `days` (default: 14, min: 1, max: 90)
- **Response:**
```json
{
  "message": "Book borrowed successfully",
  "loan_id": 1,
  "due_date": "2024-02-15T00:00:00Z",
  "book_title": "The Great Gatsby"
}
```
- **Validations:**
  - Book must exist and be available
  - User cannot have an active loan for the same book
  - Loan period must be between 1-90 days

### Return Book
- **Endpoint:** `POST /loans/return/{loan_id}`
- **Auth:** Authenticated users (own loans) or Admin (any loan)
- **Response:** `{"message": "Book returned successfully"}`
- **Note:** Automatically updates loan status and restores book availability

### Get My Loans
- **Endpoint:** `GET /loans/my-loans`
- **Auth:** Authenticated users
- **Response:** Returns array of current user's loans

### Get Overdue Loans
- **Endpoint:** `GET /loans/overdue`
- **Auth:** Admin only
- **Response:** Returns array of all overdue loans
- **Note:** Automatically updates BORROWED loans past due_date to OVERDUE status

---

## 📊 Response Models

### BookResponse
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "category": "Fiction",
  "description": "A classic American novel",
  "publication_year": 1925,
  "total_copies": 5,
  "available_copies": 3,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-15T00:00:00Z"
}
```

### UserResponse
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "role": "USER",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### LoanResponse
```json
{
  "id": 1,
  "user_id": 1,
  "book_id": 1,
  "loan_date": "2024-01-01T00:00:00Z",
  "due_date": "2024-01-15T00:00:00Z",
  "return_date": null,
  "status": "BORROWED",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## 🔐 Roles and Permissions

### USER Role
- Can view all books
- Can borrow and return books
- Can view their own loans
- Cannot perform any admin operations

### ADMIN Role
- All USER permissions
- Full CRUD operations on Books, Users, and Loans
- Can view all loans and overdue loans
- Can manage user roles and account status

---

## ⚠️ Common Error Responses

- `400 Bad Request` - Invalid input data or business logic violation
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions for the operation
- `404 Not Found` - Resource does not exist
- `409 Conflict` - Resource already exists (e.g., duplicate ISBN)

---

## 🚀 Quick Start Examples

### Example: Create and Borrow a Book

```bash
# 1. Register a user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","username":"testuser","password":"test123"}'

# 2. Login to get token
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=test123"

# 3. Create a book (as admin)
curl -X POST http://localhost:8000/books/ \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"1984","author":"George Orwell","isbn":"978-0451524935","total_copies":5}'

# 4. Borrow the book
curl -X POST "http://localhost:8000/loans/borrow/1?days=14" \
  -H "Authorization: Bearer YOUR_USER_TOKEN"

# 5. View my loans
curl -X GET http://localhost:8000/loans/my-loans \
  -H "Authorization: Bearer YOUR_USER_TOKEN"
```

---

## 📝 Summary

✅ **Books**: Full CRUD (Create, Read, Update, Delete)  
✅ **Users**: Full CRUD + Role Management + Activation/Deactivation  
✅ **Loans**: Full CRUD + User-friendly Borrow/Return operations  

All CRUD operations are now complete and properly secured with role-based access control!
