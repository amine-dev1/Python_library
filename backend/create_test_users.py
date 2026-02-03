from sqlalchemy.orm import Session
from database import get_db, engine
import models
import utils

def create_test_users():
    """Create test users if they don't exist"""
    db = next(get_db())
    
    # Check if admin exists
    admin = db.query(models.User).filter(models.User.username == "admin").first()
    user = db.query(models.User).filter(models.User.username == "user").first()
    
    print("\n" + "="*60)
    print("TEST USERS CREDENTIALS")
    print("="*60 + "\n")
    
    # Create admin if doesn't exist
    if not admin:
        admin_password = "admin123"
        admin = models.User(
            email="admin@library.com",
            username="admin",
            password_hash=utils.get_password_hash(admin_password),
            role=models.UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        print("✅ Admin user created!")
    else:
        admin_password = "admin123"  # Default password
        print("ℹ️  Admin user already exists")
    
    print(f"""
ADMIN CREDENTIALS:
------------------
Username: admin
Password: admin123
Email: admin@library.com
Role: ADMIN
    """)
    
    # Create regular user if doesn't exist
    if not user:
        user_password = "user123"
        user = models.User(
            email="user@library.com",
            username="user",
            password_hash=utils.get_password_hash(user_password),
            role=models.UserRole.USER,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print("✅ Regular user created!")
    else:
        user_password = "user123"  # Default password
        print("ℹ️  Regular user already exists")
    
    print(f"""
USER CREDENTIALS:
-----------------
Username: user
Password: user123
Email: user@library.com
Role: USER
    """)
    
    print("="*60)
    print("You can now use these credentials to login!")
    print("="*60 + "\n")
    
    db.close()

if __name__ == "__main__":
    # Create tables if they don't exist
    models.Base.metadata.create_all(bind=engine)
    create_test_users()
