from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Enum,
    ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum 

class UserRole(enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"

# définition du model de Users 
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)

    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)

    loans = relationship("Loan", back_populates="user")

# definition du model de livres 
class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    isbn = Column(String(20), unique=True, index=True, nullable=False)

    category = Column(String(100))
    description = Column(String(500))

    publication_year = Column(Integer)

    total_copies = Column(Integer, nullable=False, default=1)
    available_copies = Column(Integer, nullable=False, default=1)

    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)

    loans = relationship("Loan", back_populates="book")
# status de l'emprunt 
class LoanStatus(enum.Enum):
    BORROWED = "BORROWED"
    RETURNED = "RETURNED"
    OVERDUE = "OVERDUE"


class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)

    loan_date = Column(DateTime, nullable=True)
    due_date = Column(DateTime, nullable=False)
    return_date = Column(DateTime, nullable=True)

    status = Column(Enum(LoanStatus), default=LoanStatus.BORROWED, nullable=False)

    created_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="loans")
    book = relationship("Book", back_populates="loans")


