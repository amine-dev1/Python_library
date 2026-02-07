# BiblioTech - Library Management System
## Project Technology Stack & Architecture

---

## 📋 Project Overview

**BiblioTech** is a modern full-stack web application for library management, built with cutting-edge technologies to provide a fast, secure, and user-friendly experience.

---

## 🏗️ Architecture

### **Full-Stack Architecture**
- **Frontend**: React + Vite (Single Page Application)
- **Backend**: FastAPI (RESTful API)
- **Database**: SQLite (Development) / MySQL-compatible (Production)
- **Communication**: REST API with CORS enabled

```
┌─────────────────┐      HTTP/REST      ┌─────────────────┐      ORM      ┌──────────┐
│                 │  ←─────────────→    │                 │  ←──────→     │          │
│  React Frontend │      Port 5173      │  FastAPI Server │   Port 8000   │ Database │
│   (Vite + UI)   │                     │   (Python API)  │               │ (SQLite) │
└─────────────────┘                     └─────────────────┘               └──────────┘
```

---

## 🎨 Frontend Technologies

### **Core Framework**
- **React 19** - Latest version of React for building interactive user interfaces
  - Component-based architecture
  - Virtual DOM for optimal performance
  - React Hooks for state management

### **Build Tool**
- **Vite 7.3.1** - Next-generation frontend tooling
  - ⚡ Lightning-fast Hot Module Replacement (HMR)
  - Optimized production builds
  - Native ES modules support
  - Instant server start

### **Styling & UI**
- **Tailwind CSS v4** - Utility-first CSS framework
  - Custom design system
  - Responsive design out of the box
  - Dark mode support
  - Modern glassmorphism effects
  
- **Lucide React** - Beautiful, consistent icon library
  - 1000+ pixel-perfect icons
  - Tree-shakeable for optimal bundle size

### **Routing**
- **React Router DOM v7** - Declarative routing for React
  - Client-side routing
  - Protected routes for authentication
  - Nested routing support

### **HTTP Client**
- **Axios** - Promise-based HTTP client
  - Interceptors for request/response handling
  - Automatic JSON transformation
  - Built-in CSRF protection

### **Data Visualization**
- **Recharts** - Composable charting library
  - Built on React components
  - Customizable charts and graphs
  - Used for library statistics and analytics

### **User Experience**
- **React Hot Toast** - Elegant toast notifications
  - Lightweight and customizable
  - Smooth animations
  - Position control

---

## ⚙️ Backend Technologies

### **Core Framework**
- **FastAPI** - Modern, high-performance web framework for Python
  - Automatic API documentation (Swagger/ReDoc)
  - Built-in data validation with Pydantic
  - Async support for high performance
  - Type hints and auto-completion

### **Server**
- **Uvicorn** - ASGI server implementation
  - Lightning-fast performance
  - Production-ready
  - Auto-reload in development mode

### **Database & ORM**
- **SQLAlchemy** - Python SQL toolkit and ORM
  - Object-Relational Mapping
  - Database abstraction layer
  - Query builder
  
- **SQLite** - Embedded database (Development)
  - Zero-configuration
  - File-based storage
  - ACID compliant

### **Authentication & Security**
- **Passlib** - Password hashing library
  - Bcrypt algorithm for secure password storage
  - Configurable rounds for enhanced security

- **Python-Jose** - JWT (JSON Web Token) implementation
  - Secure token-based authentication
  - Token expiration handling
  - Claims validation

- **Python-Multipart** - Multipart form data handling
  - File upload support
  - Form data parsing

### **Data Validation**
- **Pydantic** - Data validation using Python type hints
  - Automatic request/response validation
  - Schema generation
  - Error handling

### **Environment Management**
- **Python-dotenv** - Environment variable management
  - Secure configuration
  - Development/production separation

---

## 🔐 Security Features

### **Authentication System**
- JWT-based authentication
- Secure password hashing (Bcrypt)
- Token expiration and refresh
- Role-based access control (Admin, Librarian, User)

### **API Security**
- CORS (Cross-Origin Resource Sharing) configuration
- Request validation
- SQL injection prevention (via ORM)
- XSS protection

---

## 📦 Key Features

### **User Management**
- User registration and login
- Role-based permissions (Admin, Librarian, Member)
- Profile management
- Password reset functionality

### **Book Management**
- Complete CRUD operations for books
- Book categorization
- ISBN tracking
- Availability status

### **Borrowing System**
- Book checkout and return
- Borrowing history
- Due date tracking
- Overdue notifications

### **Admin Dashboard**
- Library statistics and analytics
- User management
- Book inventory management
- System configuration

### **Modern UI/UX**
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Interactive charts and graphs
- Real-time notifications
- Smooth animations and transitions

---

## 🚀 Development Workflow

### **Frontend Development**
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
```

### **Backend Development**
```bash
cd backend
python -m venv venv              # Create virtual environment
venv\Scripts\activate            # Activate venv (Windows)
pip install -r requirements.txt  # Install dependencies
uvicorn main:app --reload        # Start server (port 8000)
```

---

## 📊 API Documentation

The backend automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Features:
- Try out endpoints directly in the browser
- View request/response schemas
- Authentication testing
- Complete endpoint documentation

---

## 🌐 CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` - Vite dev server
- `http://localhost:3000` - Alternative frontend port

---

## 📈 Performance Optimizations

### **Frontend**
- Code splitting with Vite
- Lazy loading for routes
- Tree-shaking for minimal bundle size
- Asset optimization (images, CSS)

### **Backend**
- Async/await for non-blocking operations
- Database query optimization
- Connection pooling
- Response caching

---

## 🛠️ Development Tools

### **Code Quality**
- **ESLint** - JavaScript/React linting
- **Prettier** (optional) - Code formatting

### **Version Control**
- **Git** - Source code management
- **.gitignore** - Configured for Python and Node.js

---

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Laptops (1024px and up)
- 🖥️ Desktops (1280px and up)

---

## 🎯 Project Highlights

### **Modern Tech Stack**
- Latest versions of React, Vite, and FastAPI
- Type-safe development with Pydantic
- Fast development with HMR

### **Developer Experience**
- Auto-reload in development
- Interactive API documentation
- Component-based architecture
- Clear project structure

### **User Experience**
- Fast page loads
- Smooth animations
- Real-time feedback
- Intuitive interface

### **Security First**
- JWT authentication
- Secure password storage
- Role-based access control
- Input validation

---

## 📚 Documentation

- `README.md` - Main project documentation
- `backend/API_DOCUMENTATION.md` - API endpoints documentation
- `backend/CRUD_ENDPOINTS.md` - CRUD operations guide
- `frontend/ARCHITECTURE.md` - Frontend architecture
- `frontend/API_INTEGRATION.md` - API integration guide
- `frontend/QUICK_START.md` - Quick start guide

---

## 🔄 Version Information

### **Frontend**
- React: 19.x
- Vite: 7.3.1
- Tailwind CSS: 4.x
- React Router: 7.x
- Axios: Latest
- Recharts: Latest

### **Backend**
- Python: 3.13+
- FastAPI: Latest
- Uvicorn: Latest
- SQLAlchemy: Latest
- Pydantic: Latest

---

## 🎓 Learning Resources

This project demonstrates proficiency in:
- Modern JavaScript/React development
- RESTful API design
- Database modeling and ORM
- Authentication and authorization
- Full-stack integration
- Responsive web design
- API documentation

---

## 📞 Support & Maintenance

### **Development Server URLs**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### **Quick Start Commands**
```bash
# Start both servers
# Terminal 1 - Backend
cd backend && venv\Scripts\activate && uvicorn main:app --reload

# Terminal 2 - Frontend
cd frontend && npm run dev
```

---

**Built with ❤️ using modern web technologies**
