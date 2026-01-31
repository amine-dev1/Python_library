from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from database import get_db
import models
import schemas
import utils
import auth

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
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
        role=models.UserRole.USER
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Login with JSON body"""
    # Find user by username
    user = db.query(models.User).filter(models.User.username == credentials.username).first()
    
    # Verify user and password
    if not user or not utils.verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "role": user.role.value}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserResponse)
async def get_current_user_profile(current_user: models.User = Depends(auth.get_current_user)):
    """Get current authenticated user's profile"""
    return current_user

@router.post("/change-password")
async def change_password(
    password_change: schemas.PasswordChange,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    """Change current user's password"""
    # Verify old password
    if not utils.verify_password(password_change.old_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )
    
    # Update password
    current_user.password_hash = utils.get_password_hash(password_change.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}

@router.post("/refresh", response_model=schemas.Token)
async def refresh_token(current_user: models.User = Depends(auth.get_current_user)):
    """Refresh access token for current user"""
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": current_user.username, "role": current_user.role.value}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(current_user: models.User = Depends(auth.get_current_user)):
    """
    Logout the current user. 
    Note: For JWT, key action is client-side (deleting token).
    """
    return {"message": "Successfully logged out"}
