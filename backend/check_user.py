from database import SessionLocal
from models import User
from utils import verify_password
import sys

def check_user(username, password):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        if not user:
            print(f"User '{username}' not found in database.")
            return

        print(f"User '{username}' found.")
        print(f"ID: {user.id}")
        print(f"Email: {user.email}")
        print(f"Role: {user.role}")
        print(f"Is Active: {user.is_active}")
        
        is_valid = verify_password(password, user.password_hash)
        if is_valid:
            print(f"Password '{password}' is CORRECT.")
        else:
            print(f"Password '{password}' is INCORRECT.")
            
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_user("amine123", "elidrissi2002")
