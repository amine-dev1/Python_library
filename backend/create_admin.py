"""
Script to create an admin user in the database
"""
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from datetime import datetime
from passlib.context import CryptContext

# Create a simple password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__ident="2b")

def create_admin_user():
    """Create an admin user if it doesn't exist"""
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        admin_username = "admin"
        existing_admin = db.query(models.User).filter(
            models.User.username == admin_username
        ).first()
        
        if existing_admin:
            print(f"[!] Admin user '{admin_username}' already exists!")
            print(f"   Email: {existing_admin.email}")
            print(f"   Role: {existing_admin.role.value}")
            return
        
        # Create admin user
        admin_email = "admin@library.com"
        admin_password = "admin123"  # Change this password after first login!
        
        # Hash the password directly
        try:
            hashed_password = pwd_context.hash(admin_password)
        except Exception as e:
            # Fallback: use bcrypt directly
            import bcrypt
            hashed_password = bcrypt.hashpw(
                admin_password.encode('utf-8'), 
                bcrypt.gensalt()
            ).decode('utf-8')
        
        # Create admin user object
        admin_user = models.User(
            email=admin_email,
            username=admin_username,
            password_hash=hashed_password,
            role=models.UserRole.ADMIN,
            is_active=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Add to database
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("[SUCCESS] Admin user created successfully!")
        print(f"   Username: {admin_username}")
        print(f"   Email: {admin_email}")
        print(f"   Password: {admin_password}")
        print(f"   Role: {admin_user.role.value}")
        print("\n[WARNING] IMPORTANT: Change the password after first login!")
        
    except Exception as e:
        print(f"[ERROR] Error creating admin user: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating admin user...")
    create_admin_user()
