# Login and Register Components

## 📁 Files Created

1. **`src/components/Login.jsx`** - Login component
2. **`src/components/Register.jsx`** - Registration component
3. **`src/components/Auth.css`** - Shared styling for auth components
4. **`src/components/AuthPage.jsx`** - Container component for auth flow

## ✨ Features

### Login Component
- ✅ Username and password fields
- ✅ Form validation
- ✅ Error handling with user-friendly messages
- ✅ Loading state with spinner
- ✅ Auto-clear errors on input change
- ✅ Switch to register link
- ✅ Callback for successful login

### Register Component
- ✅ Username, email, password, and confirm password fields
- ✅ Comprehensive form validation:
  - All fields required
  - Username minimum 3 characters
  - Valid email format
  - Password minimum 6 characters
  - Passwords must match
- ✅ Error handling with specific messages
- ✅ Success state with animation
- ✅ Auto-login after successful registration
- ✅ Switch to login link
- ✅ Callback for successful registration

### Styling (Auth.css)
- ✅ Modern gradient background
- ✅ Card-based design with shadow
- ✅ Smooth animations (slide-up, shake, scale)
- ✅ Focus states for inputs
- ✅ Hover effects on buttons
- ✅ Loading spinner animation
- ✅ Responsive design for mobile
- ✅ Error message styling
- ✅ Success message styling

### AuthPage Component
- ✅ Manages login/register switching
- ✅ Displays user profile after login
- ✅ Logout functionality
- ✅ Beautiful welcome screen

## 🚀 Usage

### Basic Usage

```jsx
import AuthPage from './components/AuthPage';

function App() {
  return <AuthPage />;
}
```

### Custom Usage with Callbacks

```jsx
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const handleLoginSuccess = (user) => {
    console.log('User logged in:', user);
    // Redirect to dashboard, etc.
  };

  return (
    <Login 
      onLoginSuccess={handleLoginSuccess}
      onSwitchToRegister={() => {/* handle switch */}}
    />
  );
}
```

### Register Component

```jsx
import Register from './components/Register';

function App() {
  const handleRegisterSuccess = (user) => {
    console.log('User registered:', user);
    // Redirect to dashboard, etc.
  };

  return (
    <Register 
      onRegisterSuccess={handleRegisterSuccess}
      onSwitchToLogin={() => {/* handle switch */}}
    />
  );
}
```

## 🎨 Component Props

### Login Props
| Prop | Type | Description |
|------|------|-------------|
| `onLoginSuccess` | `(user) => void` | Callback when login succeeds |
| `onSwitchToRegister` | `() => void` | Callback to switch to register |

### Register Props
| Prop | Type | Description |
|------|------|-------------|
| `onRegisterSuccess` | `(user) => void` | Callback when registration succeeds |
| `onSwitchToLogin` | `() => void` | Callback to switch to login |

## 🔐 Validation Rules

### Login
- Username: Required
- Password: Required

### Register
- Username: Required, minimum 3 characters
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Confirm Password: Must match password

## 🎯 User Flow

### Login Flow
1. User enters username and password
2. Form validates input
3. Submits to backend via `authService.login()`
4. On success: stores token and user data
5. Calls `onLoginSuccess` callback
6. Shows loading state during request

### Register Flow
1. User fills registration form
2. Client-side validation checks all fields
3. Submits to backend via `authService.register()`
4. On success: shows success message
5. Auto-login after 1.5 seconds
6. Calls `onRegisterSuccess` callback
7. If auto-login fails, switches to login page

## 🎨 Design Features

- **Gradient Background**: Purple gradient (667eea → 764ba2)
- **Card Design**: White card with rounded corners and shadow
- **Animations**:
  - Slide-up on mount
  - Shake on error
  - Scale-in for success icon
  - Spinner for loading
- **Responsive**: Adapts to mobile screens
- **Accessibility**: Proper labels and autocomplete attributes

## 🐛 Error Handling

The components handle various error scenarios:

- Empty fields
- Invalid email format
- Short username/password
- Password mismatch
- Backend errors (email/username already exists)
- Network errors

All errors are displayed with a friendly message and warning icon.

## 🔧 Integration with Backend

Both components use the `authService` from `src/api/authService.js`:

```javascript
import { authService } from '../api';

// Login
await authService.login({ username, password });

// Register
await authService.register({ username, email, password });
```

## 📱 Responsive Design

The components are fully responsive:
- Desktop: 450px max width
- Mobile: Adjusts padding and font sizes
- Touch-friendly button sizes

## 🎉 Example Integration in App.jsx

```jsx
import { useState } from 'react';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('access_token')
  );

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <Dashboard />;
}

export default App;
```

## 📝 Notes

- Components automatically clear errors when user starts typing
- Loading state disables all inputs and buttons
- Success state shows for 1.5 seconds before auto-login
- All sensitive data is handled securely via HTTPS in production
- Tokens are stored in localStorage (consider httpOnly cookies for production)

---

**Created**: 2026-02-01
**Status**: ✅ Ready to Use
