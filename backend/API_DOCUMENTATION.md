# Python Library API Documentation

## Overview
Complete authentication system for a library management application with role-based access control.

## Base URL
```
http://localhost:8000
```

## Authentication
The API uses JWT (JSON Web Token) bearer authentication. After login, include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## API Endpoints

### Authentication Endpoints

#### **POST /auth/register**
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "role": "USER",
  "is_active": true,
  "created_at": "2026-01-30T21:00:00Z"
}
```

---

#### **POST /auth/login**
Login with username and password to get access token.

**Request Body (form-data):**
```
username: your_username
password: your_password
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

#### **GET /auth/me**
Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "role": "USER",
  "is_active": true,
  "created_at": "2026-01-30T21:00:00Z"
}
```

---

#### **POST /auth/change-password**
Change current user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "old_password": "current_password",
  "new_password": "new_secure_password"
}
```

**Response (200 OK):**
```json
{
  "message": "Password updated successfully"
}
```

---

#### **POST /auth/refresh**
Refresh access token for current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### Books Endpoints

#### **GET /books/**
Get all books (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum records to return (default: 100)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Python Programming",
    "author": "John Doe",
    "isbn": "978-0-123456-78-9",
    "category": "Programming",
    "description": "A comprehensive guide to Python",
    "publication_year": 2024,
    "total_copies": 5,
    "available_copies": 3,
    "created_at": "2026-01-30T21:00:00Z",
    "updated_at": "2026-01-30T21:00:00Z"
  }
]
```

---

#### **GET /books/{book_id}**
Get a specific book by ID (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Python Programming",
  "author": "John Doe",
  "isbn": "978-0-123456-78-9",
  "category": "Programming",
  "description": "A comprehensive guide to Python",
  "publication_year": 2024,
  "total_copies": 5,
  "available_copies": 3,
  "created_at": "2026-01-30T21:00:00Z",
  "updated_at": "2026-01-30T21:00:00Z"
}
```

---

#### **POST /books/**
Create a new book (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `title` (required)
- `author` (required)
- `isbn` (required)
- `category` (optional)
- `description` (optional)
- `publication_year` (optional)
- `total_copies` (optional, default: 1)

**Response (201 Created):**
```json
{
  "message": "Book created successfully",
  "book_id": 1
}
```

---

#### **PUT /books/{book_id}**
Update a book (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters (all optional):**
- `title`
- `author`
- `category`
- `description`
- `publication_year`
- `total_copies`

**Response (200 OK):**
```json
{
  "message": "Book updated successfully"
}
```

---

#### **DELETE /books/{book_id}**
Delete a book (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "message": "Book deleted successfully"
}
```

---

### Loans Endpoints

#### **POST /loans/borrow/{book_id}**
Borrow a book (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Book borrowed successfully",
  "loan_id": 1,
  "due_date": "2026-02-13T21:00:00Z"
}
```

---

#### **POST /loans/return/{loan_id}**
Return a borrowed book.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Book returned successfully"
}
```

---

#### **GET /loans/my-loans**
Get current user's loan history.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "book_id": 1,
    "book_title": "Python Programming",
    "book_author": "John Doe",
    "loan_date": "2026-01-30T21:00:00Z",
    "due_date": "2026-02-13T21:00:00Z",
    "return_date": null,
    "status": "BORROWED"
  }
]
```

---

#### **GET /loans/all**
Get all loans (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum records to return (default: 100)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "username": "john_doe",
    "book_id": 1,
    "book_title": "Python Programming",
    "loan_date": "2026-01-30T21:00:00Z",
    "due_date": "2026-02-13T21:00:00Z",
    "return_date": null,
    "status": "BORROWED"
  }
]
```

---

#### **GET /loans/overdue**
Get all overdue loans (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "username": "john_doe",
    "book_id": 1,
    "book_title": "Python Programming",
    "loan_date": "2026-01-15T21:00:00Z",
    "due_date": "2026-01-29T21:00:00Z",
    "days_overdue": 1
  }
]
```

---

### Users Endpoints

#### **GET /users/**
Get all users (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `skip` (optional): Number of records to skip (default: 0)
- `limit` (optional): Maximum records to return (default: 100)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "username": "username",
    "role": "USER",
    "is_active": true,
    "created_at": "2026-01-30T21:00:00Z"
  }
]
```

---

#### **GET /users/{user_id}**
Get a specific user by ID (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "role": "USER",
  "is_active": true,
  "created_at": "2026-01-30T21:00:00Z"
}
```

---

#### **PUT /users/{user_id}/role**
Update user role (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `role`: "ADMIN" or "USER"

**Response (200 OK):**
```json
{
  "message": "User role updated to ADMIN"
}
```

---

#### **PUT /users/{user_id}/activate**
Activate a user account (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "message": "User activated successfully"
}
```

---

#### **PUT /users/{user_id}/deactivate**
Deactivate a user account (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "message": "User deactivated successfully"
}
```

---

#### **DELETE /users/{user_id}**
Delete a user (requires ADMIN role).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Email already registered"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

---

## User Roles

- **USER**: Can view books, borrow/return books, view their own loans
- **ADMIN**: Full access to all endpoints including user management and book management

---

## Testing the API

### Using cURL

1. **Register a new user:**
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'
```

2. **Login:**
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123"
```

3. **Get current user (replace TOKEN):**
```bash
curl -X GET "http://localhost:8000/auth/me" \
  -H "Authorization: Bearer TOKEN"
```

### Using Swagger UI

Navigate to `http://localhost:8000/docs` in your browser for interactive API documentation.

### Using ReDoc

Navigate to `http://localhost:8000/redoc` in your browser for alternative API documentation.

---

## Environment Variables

Make sure to configure the following in your `.env` file:

```env
# Server Configuration
PORT=8000
HOST=0.0.0.0
DEBUG=True

# Database
DATABASE_URL=mysql+mysqlconnector://username:password@host:port/database

# JWT Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## Running the Server

```bash
cd backend
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
