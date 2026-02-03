from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from database import get_db
import models
import schemas
import auth

router = APIRouter(
    prefix="/books",
    tags=["Books"]
)

@router.get("/", response_model=List[schemas.BookResponse])
def get_books(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all books (public)"""
    books = db.query(models.Book).offset(skip).limit(limit).all()
    return books

@router.get("/{book_id}", response_model=schemas.BookResponse)
def get_book(
    book_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific book by ID (public)"""
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.post("/create", response_model=schemas.BookResponse, status_code=status.HTTP_201_CREATED)
def create_book(
    book: schemas.BookCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Create a new book (requires admin role)"""
    # Check if book with ISBN already exists
    existing_book = db.query(models.Book).filter(models.Book.isbn == book.isbn).first()
    if existing_book:
        raise HTTPException(status_code=400, detail="Book with this ISBN already exists")
    
    now = datetime.utcnow()
    new_book = models.Book(
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        category=book.category,
        description=book.description,
        image_url=book.image_url,
        publication_year=book.publication_year,
        total_copies=book.total_copies,
        available_copies=book.total_copies,
        created_at=now,
        updated_at=now
    )
    
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    
    return new_book

@router.put("/{book_id}", response_model=schemas.BookResponse)
def update_book(
    book_id: int,
    book_update: schemas.BookUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Update a book (requires admin role)"""
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    if book_update.title is not None:
        book.title = book_update.title
    if book_update.author is not None:
        book.author = book_update.author
    if book_update.category is not None:
        book.category = book_update.category
    if book_update.description is not None:
        book.description = book_update.description
    if book_update.image_url is not None:
        book.image_url = book_update.image_url
    if book_update.publication_year is not None:
        book.publication_year = book_update.publication_year
    if book_update.total_copies is not None:
        # Update available copies proportionally
        diff = book_update.total_copies - book.total_copies
        book.total_copies = book_update.total_copies
        book.available_copies = max(0, book.available_copies + diff)
    
    book.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(book)
    
    return book

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
        models.Loan.status.in_([models.LoanStatus.BORROWED, models.LoanStatus.OVERDUE])
    ).count()
    
    if active_loans > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete book with active loans"
        )
    
    db.delete(book)
    db.commit()
    return {"message": "Book deleted successfully"}
