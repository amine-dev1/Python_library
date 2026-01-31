from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List

from database import get_db
import models
import auth

router = APIRouter(
    prefix="/loans",
    tags=["Loans"]
)

@router.post("/borrow/{book_id}")
def borrow_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Borrow a book (requires authentication)"""
    # Check if book exists
    book = db.query(models.Book).filter(models.Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if book is available
    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="Book not available")
    
    # Check if user already has an active loan for this book
    active_loan = db.query(models.Loan).filter(
        models.Loan.user_id == current_user.id,
        models.Loan.book_id == book_id,
        models.Loan.status == models.LoanStatus.BORROWED
    ).first()
    
    if active_loan:
        raise HTTPException(
            status_code=400,
            detail="You already have an active loan for this book"
        )
    
    # Create loan (14 days loan period)
    now = datetime.utcnow()
    due_date = now + timedelta(days=14)
    new_loan = models.Loan(
        user_id=current_user.id,
        book_id=book_id,
        loan_date=now,
        due_date=due_date,
        created_at=now,
        status=models.LoanStatus.BORROWED
    )
    
    # Update book availability
    book.available_copies -= 1
    
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    
    return {
        "message": "Book borrowed successfully",
        "loan_id": new_loan.id,
        "due_date": new_loan.due_date
    }

@router.post("/return/{loan_id}")
def return_book(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Return a borrowed book"""
    loan = db.query(models.Loan).filter(models.Loan.id == loan_id).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Check if loan belongs to current user (unless admin)
    if loan.user_id != current_user.id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to return this loan"
        )
    
    if loan.status == models.LoanStatus.RETURNED:
        raise HTTPException(status_code=400, detail="Book already returned")
    
    # Update loan status
    loan.status = models.LoanStatus.RETURNED
    loan.return_date = datetime.utcnow()
    
    # Update book availability
    book = db.query(models.Book).filter(models.Book.id == loan.book_id).first()
    book.available_copies += 1
    
    db.commit()
    
    return {"message": "Book returned successfully"}

@router.get("/my-loans")
def get_my_loans(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get current user's loan history"""
    loans = db.query(models.Loan).filter(
        models.Loan.user_id == current_user.id
    ).all()
    
    return [
        {
            "id": loan.id,
            "book_id": loan.book_id,
            "book_title": loan.book.title,
            "book_author": loan.book.author,
            "loan_date": loan.loan_date,
            "due_date": loan.due_date,
            "return_date": loan.return_date,
            "status": loan.status.value
        }
        for loan in loans
    ]

@router.get("/all")
def get_all_loans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Get all loans (admin only)"""
    loans = db.query(models.Loan).offset(skip).limit(limit).all()
    
    return [
        {
            "id": loan.id,
            "user_id": loan.user_id,
            "username": loan.user.username,
            "book_id": loan.book_id,
            "book_title": loan.book.title,
            "loan_date": loan.loan_date,
            "due_date": loan.due_date,
            "return_date": loan.return_date,
            "status": loan.status.value
        }
        for loan in loans
    ]

@router.get("/overdue")
def get_overdue_loans(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Get all overdue loans (admin only)"""
    now = datetime.utcnow()
    
    # Update overdue loans
    overdue_loans = db.query(models.Loan).filter(
        models.Loan.status == models.LoanStatus.BORROWED,
        models.Loan.due_date < now
    ).all()
    
    for loan in overdue_loans:
        loan.status = models.LoanStatus.OVERDUE
    
    db.commit()
    
    return [
        {
            "id": loan.id,
            "user_id": loan.user_id,
            "username": loan.user.username,
            "book_id": loan.book_id,
            "book_title": loan.book.title,
            "loan_date": loan.loan_date,
            "due_date": loan.due_date,
            "days_overdue": (now - loan.due_date).days
        }
        for loan in overdue_loans
    ]
