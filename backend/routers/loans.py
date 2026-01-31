from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List

from database import get_db
import models
import schemas
import auth

router = APIRouter(
    prefix="/loans",
    tags=["Loans"]
)

# ============ CRUD Operations (Admin) ============

@router.get("/all", response_model=List[schemas.LoanResponse])
def get_all_loans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Get all loans (admin only)"""
    loans = db.query(models.Loan).offset(skip).limit(limit).all()
    return loans

@router.get("/{loan_id}", response_model=schemas.LoanResponse)
def get_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get a specific loan by ID"""
    loan = db.query(models.Loan).filter(models.Loan.id == loan_id).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Users can only view their own loans unless they're admin
    if loan.user_id != current_user.id and current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this loan"
        )
    
    return loan

@router.post("/", response_model=schemas.LoanResponse, status_code=status.HTTP_201_CREATED)
def create_loan_admin(
    loan_create: schemas.LoanBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Create a loan manually (admin only)"""
    # Verify user exists
    user = db.query(models.User).filter(models.User.id == loan_create.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify book exists
    book = db.query(models.Book).filter(models.Book.id == loan_create.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    # Check if book is available
    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="Book not available")
    
    # Check for existing active loan
    active_loan = db.query(models.Loan).filter(
        models.Loan.user_id == loan_create.user_id,
        models.Loan.book_id == loan_create.book_id,
        models.Loan.status.in_([models.LoanStatus.BORROWED, models.LoanStatus.OVERDUE])
    ).first()
    
    if active_loan:
        raise HTTPException(
            status_code=400,
            detail="User already has an active loan for this book"
        )
    
    # Create the loan
    now = datetime.utcnow()
    new_loan = models.Loan(
        user_id=loan_create.user_id,
        book_id=loan_create.book_id,
        loan_date=now,
        due_date=loan_create.due_date,
        created_at=now,
        status=models.LoanStatus.BORROWED
    )
    
    # Update book availability
    book.available_copies -= 1
    
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    
    return new_loan

@router.put("/{loan_id}", response_model=schemas.LoanResponse)
def update_loan(
    loan_id: int,
    loan_update: schemas.LoanUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Update a loan (admin only)"""
    loan = db.query(models.Loan).filter(models.Loan.id == loan_id).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # Update fields if provided
    if loan_update.due_date is not None:
        loan.due_date = loan_update.due_date
    
    if loan_update.status is not None:
        try:
            new_status = models.LoanStatus(loan_update.status)
            old_status = loan.status
            loan.status = new_status
            
            # If changing from BORROWED/OVERDUE to RETURNED, update book availability
            if old_status in [models.LoanStatus.BORROWED, models.LoanStatus.OVERDUE] and new_status == models.LoanStatus.RETURNED:
                book = db.query(models.Book).filter(models.Book.id == loan.book_id).first()
                book.available_copies += 1
                loan.return_date = datetime.utcnow()
                
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join([s.value for s in models.LoanStatus])}"
            )
    
    db.commit()
    db.refresh(loan)
    
    return loan

@router.delete("/{loan_id}")
def delete_loan(
    loan_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Delete a loan record (admin only)"""
    loan = db.query(models.Loan).filter(models.Loan.id == loan_id).first()
    
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    
    # If loan is active, restore book availability
    if loan.status in [models.LoanStatus.BORROWED, models.LoanStatus.OVERDUE]:
        book = db.query(models.Book).filter(models.Book.id == loan.book_id).first()
        if book:
            book.available_copies += 1
    
    db.delete(loan)
    db.commit()
    
    return {"message": "Loan deleted successfully"}

# ============ User-Facing Operations ============

@router.post("/borrow/{book_id}")
def borrow_book(
    book_id: int,
    days: int = 14,
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
        models.Loan.status.in_([models.LoanStatus.BORROWED, models.LoanStatus.OVERDUE])
    ).first()
    
    if active_loan:
        raise HTTPException(
            status_code=400,
            detail="You already have an active loan for this book"
        )
    
    # Validate days
    if days < 1 or days > 90:
        raise HTTPException(
            status_code=400,
            detail="Loan period must be between 1 and 90 days"
        )
    
    # Create loan
    now = datetime.utcnow()
    due_date = now + timedelta(days=days)
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
        "due_date": new_loan.due_date,
        "book_title": book.title
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

@router.get("/my-loans", response_model=List[schemas.LoanResponse])
def get_my_loans(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get current user's loan history"""
    loans = db.query(models.Loan).filter(
        models.Loan.user_id == current_user.id
    ).all()
    
    return loans

@router.get("/overdue", response_model=List[schemas.LoanResponse])
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
    
    # Get all overdue loans
    all_overdue = db.query(models.Loan).filter(
        models.Loan.status == models.LoanStatus.OVERDUE
    ).all()
    
    return all_overdue
