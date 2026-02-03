from sqlalchemy.orm import Session
from database import get_db
import models
import utils

def reset_admin_password():
    """Reset admin password to a known value"""
    db = next(get_db())
    
    # Find admin user
    admin = db.query(models.User).filter(models.User.username == "admin").first()
    
    if not admin:
        print("Admin user not found!")
        print("\nAvailable admin users:")
        admins = db.query(models.User).filter(models.User.role == models.UserRole.ADMIN).all()
        for adm in admins:
            print(f"  - {adm.username} ({adm.email})")
        db.close()
        return
    
    # Reset password
    new_password = "admin123"
    admin.password_hash = utils.get_password_hash(new_password)
    db.commit()
    
    print("\n" + "="*60)
    print("ADMIN PASSWORD RESET SUCCESSFUL!")
    print("="*60 + "\n")
    print(f"Username: {admin.username}")
    print(f"Email: {admin.email}")
    print(f"New Password: {new_password}")
    print(f"Role: {admin.role.value}")
    print("\n" + "="*60 + "\n")
    
    db.close()

if __name__ == "__main__":
    reset_admin_password()
