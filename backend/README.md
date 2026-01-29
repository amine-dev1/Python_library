# Python Library Backend (FastAPI)

Backend API server for the Python Library application built with FastAPI.

## Prerequisites

- Python 3.8+ (Download from [python.org](https://www.python.org/downloads/))

## Installation Steps

### 1. Install Python

Download and install Python from: https://www.python.org/downloads/

**Important**: During installation, check the box "Add Python to PATH"

### 2. Create Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

## Running the Server

### Development Mode

```bash
# Make sure virtual environment is activated
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or simply run:

```bash
python main.py
```

The server will start at: **http://localhost:8000**

### API Documentation

Once the server is running, you can access:
- **Interactive API docs (Swagger UI)**: http://localhost:8000/docs
- **Alternative docs (ReDoc)**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── main.py              # Main FastAPI application
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

## Available Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/items` - Example API endpoint

## Dependencies

- **FastAPI** - Modern, fast web framework for building APIs
- **Uvicorn** - ASGI server for running FastAPI
- **python-dotenv** - Environment variable management
- **Pydantic** - Data validation
- **python-multipart** - Form data handling

## Environment Variables

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

## CORS Configuration

The API is configured to accept requests from:
- http://localhost:5173 (Vite dev server)
- http://localhost:3000 (Alternative frontend)

Modify `origins` in `main.py` to add more allowed origins.
