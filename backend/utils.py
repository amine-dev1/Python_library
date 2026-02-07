from passlib.context import CryptContext
import bcrypt

# Configure bcrypt with truncate_error=False to handle passwords > 72 bytes
pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto",
    bcrypt__ident="2b",
    bcrypt__default_rounds=12
)

def verify_password(plain_password, hashed_password):
    try:
        # Try using passlib first
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # Fallback to direct bcrypt usage
        try:
            # Handle bytes/string conversion for bcrypt
            if isinstance(plain_password, str):
                plain_password = plain_password.encode('utf-8')
            if isinstance(hashed_password, str):
                hashed_password = hashed_password.encode('utf-8')
            
            return bcrypt.checkpw(plain_password, hashed_password)
        except Exception as e:
            print(f"Password verification error: {e}")
            return False

def get_password_hash(password):
    try:
        # Truncate to 72 bytes if necessary (bcrypt limitation)
        if len(password.encode('utf-8')) > 72:
            password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
        return pwd_context.hash(password)
    except Exception:
        # Fallback to direct bcrypt usage
        if isinstance(password, str):
            password = password.encode('utf-8')
        # Truncate for bcrypt direct usage too
        if len(password) > 72:
            password = password[:72]
            
        return bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')
