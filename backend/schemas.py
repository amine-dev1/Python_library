from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

# ============ User Schemas ============
class UserBase(BaseModel):
    email: EmailStr
    username: str

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to update user
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None

# Properties to return to client
class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ============ Book Schemas ============
class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    publication_year: Optional[int] = None
    total_copies: int = Field(default=1, ge=1)

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    publication_year: Optional[int] = None
    total_copies: Optional[int] = Field(default=None, ge=1)

class BookResponse(BookBase):
    id: int
    available_copies: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ============ Loan Schemas ============
class LoanBase(BaseModel):
    user_id: int
    book_id: int
    due_date: datetime

class LoanCreate(BaseModel):
    book_id: int
    days: int = Field(default=14, ge=1, le=90)  # Default 14 days, max 90

class LoanUpdate(BaseModel):
    due_date: Optional[datetime] = None
    status: Optional[str] = None

class LoanResponse(BaseModel):
    id: int
    user_id: int
    book_id: int
    loan_date: Optional[datetime] = None
    due_date: datetime
    return_date: Optional[datetime] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ============ Token Schemas ============
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# ============ Login Schema ============
class LoginRequest(BaseModel):
    username: str
    password: str

# ============ Password Change Schema ============
class PasswordChange(BaseModel):
    old_password: str
    new_password: str

