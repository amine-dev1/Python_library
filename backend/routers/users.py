from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
import models
import schemas
import auth
import utils

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/", response_model=schemas.UserResponse)
def create_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Create a new user (admin only)"""
    # Check if user already exists
    db_user_email = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user_username = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user_username:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Hash password
    hashed_password = utils.get_password_hash(user.password)
    
    # Create new user
    new_user = models.User(
        email=user.email,
        username=user.username,
        password_hash=hashed_password,
        role=models.UserRole.USER,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.get("/", response_model=List[schemas.UserResponse])
def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Get all users (admin only)"""
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Get a specific user by ID (admin only)"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Update user information (admin only)"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.email is not None:
        existing_user = db.query(models.User).filter(
            models.User.email == user_update.email,
            models.User.id != user_id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        user.email = user_update.email
    
    if user_update.username is not None:
        existing_user = db.query(models.User).filter(
            models.User.username == user_update.username,
            models.User.id != user_id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username already taken"
            )
        user.username = user_update.username
    
    from datetime import datetime
    user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(user)
    
    return user

@router.put("/{user_id}/role")
def update_user_role(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Update user role (admin only)"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    try:
        new_role = models.UserRole(role)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid role. Must be one of: {', '.join([r.value for r in models.UserRole])}"
        )
    
    user.role = new_role
    db.commit()
    
    return {"message": f"User role updated to {role}"}

@router.put("/{user_id}/activate")
def activate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Activate a user account (admin only)"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = True
    db.commit()
    
    return {"message": "User activated successfully"}

@router.put("/{user_id}/deactivate")
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Deactivate a user account (admin only)"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot deactivate your own account"
        )
    
    user.is_active = False
    db.commit()
    
    return {"message": "User deactivated successfully"}

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_active_admin)
):
    """Delete a user (admin only)"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent deleting yourself
    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete your own account"
        )
    
    active_loans = db.query(models.Loan).filter(
        models.Loan.user_id == user_id,
        models.Loan.status.in_([models.LoanStatus.BORROWED, models.LoanStatus.OVERDUE])
    ).count()
    
    if active_loans > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete user with active loans"
        )
    
    db.delete(user)
    db.commit()
    
    return {"message": "User deleted successfully"}
