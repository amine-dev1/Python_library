# Quick Start Guide - API Integration

## 🚀 Quick Setup

1. **Start Backend**:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Open Browser**: `http://localhost:5173`

## 📖 Common Usage Patterns

### Pattern 1: Simple API Call

```javascript
import { booksService } from './api';

function MyComponent() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await booksService.getAllBooks();
        setBooks(data);
      } catch (error) {
        console.error('Error:', error.response?.data?.detail);
      }
    };
    fetchBooks();
  }, []);

  return <div>{/* Render books */}</div>;
}
```

### Pattern 2: Form Submission

```javascript
import { authService } from './api';

function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(formData);
      // Redirect or update UI
    } catch (error) {
      alert(error.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="username" 
        value={formData.username}
        onChange={(e) => setFormData({...formData, username: e.target.value})}
      />
      <input 
        type="password"
        name="password" 
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Pattern 3: Protected Component

```javascript
import { authService } from './api';

function ProtectedComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    
    const currentUser = authService.getStoredUser();
    setUser(currentUser);
  }, []);

  if (!user) return <div>Loading...</div>;

  return <div>Welcome, {user.username}!</div>;
}
```

## 🔑 API Endpoints Reference

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout user
- `POST /auth/change-password` - Change password
- `POST /auth/refresh` - Refresh token

### Books
- `GET /books/` - Get all books
- `GET /books/{id}` - Get book by ID
- `POST /books/create` - Create book (admin)
- `PUT /books/{id}` - Update book (admin)
- `DELETE /books/{id}` - Delete book (admin)

### Loans
- `GET /loans/my-loans` - Get user's loans
- `POST /loans/borrow/{book_id}` - Borrow a book
- `POST /loans/return/{loan_id}` - Return a book
- `GET /loans/all` - Get all loans (admin)
- `GET /loans/overdue` - Get overdue loans (admin)
- `POST /loans/` - Create loan (admin)
- `PUT /loans/{id}` - Update loan (admin)
- `DELETE /loans/{id}` - Delete loan (admin)

### Users (Admin Only)
- `GET /users/` - Get all users
- `GET /users/{id}` - Get user by ID
- `POST /users/` - Create user
- `PUT /users/{id}` - Update user
- `PUT /users/{id}/role` - Update user role
- `PUT /users/{id}/activate` - Activate user
- `PUT /users/{id}/deactivate` - Deactivate user
- `DELETE /users/{id}` - Delete user

## 💡 Tips

1. **Always handle errors**: Wrap API calls in try-catch blocks
2. **Check authentication**: Use `authService.isAuthenticated()` before protected operations
3. **Loading states**: Show loading indicators during API calls
4. **Token expiry**: Implement token refresh logic for long sessions
5. **CORS**: Ensure backend CORS settings allow your frontend URL

## 🐛 Troubleshooting

### "Network Error"
- ✅ Check if backend is running on port 8000
- ✅ Verify VITE_API_URL in .env file
- ✅ Check CORS settings in backend

### "401 Unauthorized"
- ✅ User needs to login first
- ✅ Token might be expired - try logging in again
- ✅ Check if token is being sent in headers

### "403 Forbidden"
- ✅ User doesn't have required permissions
- ✅ Some endpoints require admin role

### "404 Not Found"
- ✅ Check endpoint URL is correct
- ✅ Verify resource ID exists in database
