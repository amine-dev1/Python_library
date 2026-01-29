from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from dotenv import load_dotenv
from database import get_db

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="Python Library API",
    description="Backend API for Python Library application",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative frontend port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
async def read_root():
    return {
        "message": "Welcome to Python Library API",
        "status": "running",
        "version": "1.0.0"
    }

# Health check endpoints
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/health/db")
async def health_check_db(db: Session = Depends(get_db)):
    try:
        # Try to execute a simple query to verify connection
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
