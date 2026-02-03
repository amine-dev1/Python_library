from sqlalchemy.orm import Session
from database import get_db
import models

def list_users():
    """List all users in the database"""
    db = next(get_db())
    
    users = db.query(models.User).all()
    
    print("\n" + "="*70)
    print("USERS IN DATABASE")
    print("="*70 + "\n")
    
    if not users:
        print("❌ No users found in database")
    else:
        print(f"Found {len(users)} user(s):\n")
        
        for user in users:
            print(f"{'='*70}")
            print(f"ID: {user.id}")
            print(f"Username: {user.username}")
            print(f"Email: {user.email}")
            print(f"Role: {user.role.value}")
            print(f"Active: {user.is_active}")
            print(f"Created: {user.created_at}")
            print(f"{'='*70}\n")
    
    print("\n" + "="*70)
    print("SUGGESTED LOGIN CREDENTIALS")
    print("="*70 + "\n")
    
    # Check for common usernames and suggest credentials
    admin_user = db.query(models.User).filter(models.User.role == models.UserRole.ADMIN).first()
    regular_user = db.query(models.User).filter(models.User.role == models.UserRole.USER).first()
    
    if admin_user:
        print(f"""
ADMIN LOGIN:
------------
Username: {admin_user.username}
Password: admin123 (or the password you set during registration)
Email: {admin_user.email}
Role: ADMIN
        """)
    
    if regular_user:
        print(f"""
USER LOGIN:
-----------
Username: {regular_user.username}
Password: user123 (or the password you set during registration)
Email: {regular_user.email}
Role: USER
        """)
    
    if not admin_user and not regular_user:
        print("⚠️  No users found. You need to register users first!")
        print("\nYou can register via the API:")
        print("POST http://localhost:8000/auth/register")
        print("""
Example JSON body:
{
  "email": "admin@library.com",
  "username": "admin",
  "password": "admin123"
}
        """)
    
    print("="*70 + "\n")
    
    db.close()

if __name__ == "__main__":
    list_users()
