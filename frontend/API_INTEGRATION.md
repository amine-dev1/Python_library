# Frontend - Backend Integration with Axios

This frontend application is connected to the FastAPI backend using Axios for HTTP requests.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── axios.js           # Axios instance configuration
│   │   ├── authService.js     # Authentication API calls
│   │   ├── booksService.js    # Books API calls
│   │   ├── loansService.js    # Loans API calls
│   │   ├── usersService.js    # Users API calls
│   │   └── index.js           # Export all services
│   ├── components/
│   │   ├── LoginExample.jsx   # Login/Auth demo
│   │   ├── BooksExample.jsx   # Books listing demo
│   │   └── LoansExample.jsx   # Loans management demo
│   ├── App.jsx                # Main application
│   └── main.jsx               # Entry point
├── .env                       # Environment variables
└── package.json
```

## 🚀 Getting Started

### Prerequisites

1. **Backend Server**: Make sure the FastAPI backend is running on `http://localhost:8000`
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Node.js**: Ensure you have Node.js installed (v16 or higher)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## 🔌 API Services

### 1. Authentication Service (`authService`)

```javascript
import { authService } from './api';

// Register a new user
await authService.register({
  email: 'user@example.com',
  username: 'username',
  password: 'password123'
});

// Login
await authService.login({
  username: 'username',
  password: 'password123'
});

// Get current user
const user = await authService.getCurrentUser();

// Change password
await authService.changePassword({
  old_password: 'oldpass',
  new_password: 'newpass'
});

// Logout
await authService.logout();

// Check if authenticated
const isAuth = authService.isAuthenticated();

// Get stored user data
const user = authService.getStoredUser();
```

### 2. Books Service (`booksService`)

```javascript
import { booksService } from './api';

// Get all books
const books = await booksService.getAllBooks({ skip: 0, limit: 100 });

// Get a specific book
const book = await booksService.getBookById(1);

// Create a book (admin only)
const newBook = await booksService.createBook({
  title: 'Book Title',
  author: 'Author Name',
  isbn: '978-1234567890',
  category: 'Fiction',
  description: 'Book description',
  publication_year: 2024,
  total_copies: 5
});

// Update a book (admin only)
const updated = await booksService.updateBook(1, {
  title: 'Updated Title'
});

// Delete a book (admin only)
await booksService.deleteBook(1);

// Search books
const results = await booksService.searchBooks('search query');
```

### 3. Loans Service (`loansService`)

```javascript
import { loansService } from './api';

// Borrow a book
const loan = await loansService.borrowBook(bookId, 14); // 14 days

// Return a book
await loansService.returnBook(loanId);

// Get my loans
const myLoans = await loansService.getMyLoans();

// Get active loans
const activeLoans = await loansService.getMyActiveLoans();

// Get loan history
const history = await loansService.getMyLoanHistory();

// Admin: Get all loans
const allLoans = await loansService.getAllLoans();

// Admin: Get overdue loans
const overdue = await loansService.getOverdueLoans();

// Admin: Create a loan
const newLoan = await loansService.createLoan({
  user_id: 1,
  book_id: 1,
  due_date: '2024-12-31'
});

// Admin: Update a loan
await loansService.updateLoan(loanId, {
  status: 'returned'
});

// Admin: Delete a loan
await loansService.deleteLoan(loanId);
```

### 4. Users Service (`usersService`)

```javascript
import { usersService } from './api';

// Admin: Get all users
const users = await usersService.getAllUsers();

// Admin: Get a specific user
const user = await usersService.getUserById(1);

// Admin: Create a user
const newUser = await usersService.createUser({
  email: 'user@example.com',
  username: 'username',
  password: 'password123'
});

// Admin: Update a user
await usersService.updateUser(1, {
  email: 'newemail@example.com'
});

// Admin: Update user role
await usersService.updateUserRole(1, 'admin');

// Admin: Activate user
await usersService.activateUser(1);

// Admin: Deactivate user
await usersService.deactivateUser(1);

// Admin: Delete user
await usersService.deleteUser(1);

// Admin: Search users
const results = await usersService.searchUsers('search query');
```

## 🔐 Authentication Flow

The application uses JWT (JSON Web Tokens) for authentication:

1. **Login**: User credentials are sent to `/auth/login`
2. **Token Storage**: Access token is stored in `localStorage`
3. **Automatic Headers**: Axios interceptor adds `Authorization: Bearer <token>` to all requests
4. **Token Refresh**: Use `authService.refreshToken()` to get a new token
5. **Logout**: Token is removed from `localStorage`

### Protected Routes

All API endpoints except `/auth/register` and `/auth/login` require authentication.

## 🛠️ Axios Configuration

The axios instance (`src/api/axios.js`) includes:

- **Base URL**: Configured from `.env` file (`VITE_API_URL`)
- **Request Interceptor**: Automatically adds JWT token to headers
- **Response Interceptor**: Handles errors globally
  - 401: Redirects to login
  - 403: Forbidden access
  - 404: Not found
  - 500: Server error

## 📝 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## 🎨 Example Components

The project includes three example components demonstrating API usage:

1. **LoginExample.jsx**: Authentication (login/logout)
2. **BooksExample.jsx**: Browse and search books
3. **LoansExample.jsx**: Borrow and return books

## 🐛 Error Handling

All API calls include error handling:

```javascript
try {
  const books = await booksService.getAllBooks();
  // Handle success
} catch (error) {
  // Error details are in error.response.data.detail
  console.error(error.response?.data?.detail || 'An error occurred');
}
```

## 📊 API Response Format

### Success Response
```json
{
  "id": 1,
  "title": "Book Title",
  "author": "Author Name",
  ...
}
```

### Error Response
```json
{
  "detail": "Error message here"
}
```

## 🔄 CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative port)

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Axios Documentation](https://axios-http.com/)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

When adding new API endpoints:

1. Add the endpoint to the appropriate service file
2. Add JSDoc comments for documentation
3. Handle errors appropriately
4. Test with the backend running

## 📄 License

This project is part of the Python Library Management System.
