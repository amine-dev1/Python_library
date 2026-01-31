from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
import auth

router = APIRouter(
    prefix="/books",
    tags=["Books"]
)

@router.get("/", response_model=List[dict])
def get_books(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get all books (requires authentication)"""
    books = db.query(models.Book).offset(skip).limit(limit).all()
    return [
        {
            "id": book.id,
            "title": book.title,
            "author": book.author,
            "isbn": book.isbn,
            "category": book.category,
            "description": book.description,
            "publication_year": book.publication_year,
            "total_copies": book.total_copies,
            "available_copies": book.available_copies,
            "created_at": book.created_at,
            "updated_at": book.updated_at
        }
        for book in books
    ]

@router.get("/{book_id}", response_model=dict)
def get_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get a specific book by ID (requires authentication)"""
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    return {
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "isbn": book.isbn,
        "category": book.category,
        "description": book.description,
        "publication_year": book.publication_year,
        "total_copies": book.total_copies,
        "available_copies": book.available_copies,
        "created_at": book.created_at,
        "updated_at": book.updated_at
    }

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_book(
    title: str,
    author: str,
    isbn: str,
    category: str = None,
    description: str = None,
    publication_year: int = None,
    total_copies: int = 1,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Create a new book (requires admin role)"""
    # Check if book with ISBN already exists
    existing_book = db.query(models.Book).filter(models.Book.isbn == isbn).first()
    if existing_book:
        raise HTTPException(status_code=400, detail="Book with this ISBN already exists")
    
    new_book = models.Book(
        title=title,
        author=author,
        isbn=isbn,
        category=category,
        description=description,
        publication_year=publication_year,
        total_copies=total_copies,
        available_copies=total_copies
    )
    
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    
    return {
        "message": "Book created successfully",
        "book_id": new_book.id
    }

@router.put("/{book_id}")
def update_book(
    book_id: int,
    title: str = None,
    author: str = None,
    category: str = None,
    description: str = None,
    publication_year: int = None,
    total_copies: int = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Update a book (requires admin role)"""
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if title is not None:
        book.title = title
    if author is not None:
        book.author = author
    if category is not None:
        book.category = category
    if description is not None:
        book.description = description
    if publication_year is not None:
        book.publication_year = publication_year
    if total_copies is not None:
        # Update available copies proportionally
        diff = total_copies - book.total_copies
        book.total_copies = total_copies
        book.available_copies = max(0, book.available_copies + diff)
    
    db.commit()
    return {"message": "Book updated successfully"}

@router.delete("/{book_id}")
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Delete a book (requires admin role)"""
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if book has active loans
    active_loans = db.query(models.Loan).filter(
        models.Loan.book_id == book_id,
        models.Loan.status == models.LoanStatus.BORROWED
    ).count()
    
    if active_loans > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete book with active loans"
        )
    
    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}
