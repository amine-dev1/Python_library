# Architecture Diagram - Frontend-Backend Integration

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Vite)                  │
│                      http://localhost:5173                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Axios HTTP Requests
                                 │ (with JWT Token)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI + Python)                    │
│                      http://localhost:8000                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ SQLAlchemy ORM
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE (SQLite)                           │
│                        sql_app.db                                │
└─────────────────────────────────────────────────────────────────┘
```

## 📂 Frontend Structure

```
frontend/
│
├── src/
│   │
│   ├── api/                          # API Layer
│   │   ├── axios.js                  # ⚙️ Axios Configuration
│   │   │   ├── Base URL setup
│   │   │   ├── Request interceptor (add JWT)
│   │   │   └── Response interceptor (handle errors)
│   │   │
│   │   ├── authService.js            # 🔐 Authentication
│   │   │   ├── register()
│   │   │   ├── login()
│   │   │   ├── logout()
│   │   │   ├── getCurrentUser()
│   │   │   ├── changePassword()
│   │   │   └── refreshToken()
│   │   │
│   │   ├── booksService.js           # 📚 Books Management
│   │   │   ├── getAllBooks()
│   │   │   ├── getBookById()
│   │   │   ├── createBook()
│   │   │   ├── updateBook()
│   │   │   ├── deleteBook()
│   │   │   └── searchBooks()
│   │   │
│   │   ├── loansService.js           # 📖 Loans Management
│   │   │   ├── borrowBook()
│   │   │   ├── returnBook()
│   │   │   ├── getMyLoans()
│   │   │   ├── getAllLoans()
│   │   │   ├── getOverdueLoans()
│   │   │   ├── createLoan()
│   │   │   ├── updateLoan()
│   │   │   └── deleteLoan()
│   │   │
│   │   ├── usersService.js           # 👥 User Management
│   │   │   ├── getAllUsers()
│   │   │   ├── getUserById()
│   │   │   ├── createUser()
│   │   │   ├── updateUser()
│   │   │   ├── updateUserRole()
│   │   │   ├── activateUser()
│   │   │   ├── deactivateUser()
│   │   │   └── deleteUser()
│   │   │
│   │   └── index.js                  # Export all services
│   │
│   ├── components/                   # UI Components
│   │   ├── LoginExample.jsx          # Login/Logout UI
│   │   ├── BooksExample.jsx          # Books List & Search
│   │   └── LoansExample.jsx          # Borrow/Return UI
│   │
│   ├── App.jsx                       # Main Application
│   └── main.jsx                      # Entry Point
│
├── .env                              # Environment Variables
├── package.json                      # Dependencies
└── vite.config.js                    # Vite Configuration
```

## 🔄 Request Flow

### Example: User Borrows a Book

```
┌──────────────┐
│   User UI    │
│ (Component)  │
└──────┬───────┘
       │ 1. User clicks "Borrow Book"
       ▼
┌──────────────────────┐
│  loansService.js     │
│  borrowBook(id, 14)  │
└──────┬───────────────┘
       │ 2. Call API method
       ▼
┌──────────────────────┐
│     axios.js         │
│  (Interceptor adds   │
│   JWT token)         │
└──────┬───────────────┘
       │ 3. POST /loans/borrow/{id}?days=14
       │    Headers: Authorization: Bearer <token>
       ▼
┌──────────────────────────────┐
│  Backend API                 │
│  POST /loans/borrow/{id}     │
│  - Verify JWT token          │
│  - Check book availability   │
│  - Create loan record        │
│  - Update book copies        │
└──────┬───────────────────────┘
       │ 4. Return loan data
       ▼
┌──────────────────────┐
│  loansService.js     │
│  return response     │
└──────┬───────────────┘
       │ 5. Update UI
       ▼
┌──────────────┐
│   User UI    │
│ (Show success│
│  message)    │
└──────────────┘
```

## 🔐 Authentication Flow

```
┌─────────────┐
│   Login     │
│   Form      │
└──────┬──────┘
       │ username + password
       ▼
┌──────────────────────┐
│  authService.login() │
└──────┬───────────────┘
       │ POST /auth/login
       ▼
┌──────────────────────┐
│  Backend validates   │
│  credentials         │
└──────┬───────────────┘
       │ Returns JWT token
       ▼
┌──────────────────────┐
│  Store in            │
│  localStorage        │
│  - access_token      │
│  - user data         │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────────┐
│  All subsequent requests     │
│  include:                    │
│  Authorization: Bearer <JWT> │
└──────────────────────────────┘
```

## 🛡️ Error Handling Flow

```
┌──────────────┐
│  API Request │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Axios Response  │
│  Interceptor     │
└──────┬───────────┘
       │
       ├─── 200 OK ────────────────► Return data
       │
       ├─── 401 Unauthorized ──────► Clear token → Redirect to login
       │
       ├─── 403 Forbidden ─────────► Show "No permission" error
       │
       ├─── 404 Not Found ─────────► Show "Resource not found"
       │
       ├─── 500 Server Error ──────► Show "Server error"
       │
       └─── Network Error ─────────► Show "Connection failed"
```

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │  Components  │◄────►│  API Services│                    │
│  │  (UI Layer)  │      │  (Business   │                    │
│  │              │      │   Logic)     │                    │
│  └──────────────┘      └──────┬───────┘                    │
│                               │                             │
│                        ┌──────▼───────┐                    │
│                        │  Axios       │                    │
│                        │  Instance    │                    │
│                        └──────┬───────┘                    │
└───────────────────────────────┼─────────────────────────────┘
                                │
                         HTTP Requests
                         (JSON + JWT)
                                │
┌───────────────────────────────▼─────────────────────────────┐
│                        BACKEND                               │
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   Routers    │◄────►│   Models     │                    │
│  │  (Endpoints) │      │  (Database)  │                    │
│  └──────────────┘      └──────────────┘                    │
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │    Auth      │      │   Schemas    │                    │
│  │  (JWT Logic) │      │ (Validation) │                    │
│  └──────────────┘      └──────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Component Interaction

```
App.jsx
  │
  ├─► LoginExample.jsx
  │     └─► authService
  │           └─► POST /auth/login
  │           └─► POST /auth/logout
  │           └─► GET /auth/me
  │
  ├─► BooksExample.jsx
  │     └─► booksService
  │           └─► GET /books/
  │           └─► GET /books/{id}
  │
  └─► LoansExample.jsx
        └─► loansService
              └─► POST /loans/borrow/{id}
              └─► POST /loans/return/{id}
              └─► GET /loans/my-loans
```

## 🔑 Key Integration Points

1. **Axios Instance** (`axios.js`)
   - Centralized HTTP client
   - Automatic token injection
   - Global error handling

2. **Service Layer** (`*Service.js`)
   - Abstraction over API calls
   - Consistent error handling
   - Type documentation (JSDoc)

3. **Component Layer** (`*.jsx`)
   - UI presentation
   - User interaction
   - State management

4. **Environment Config** (`.env`)
   - API URL configuration
   - Environment-specific settings

---

**This architecture ensures**:
- ✅ Separation of concerns
- ✅ Reusable API services
- ✅ Centralized authentication
- ✅ Consistent error handling
- ✅ Easy maintenance and testing
