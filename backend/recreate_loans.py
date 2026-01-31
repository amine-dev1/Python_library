from database import engine
from models import Base
from sqlalchemy import text

def recreate_loans():
    try:
        # Drop loans table
        with engine.connect() as connection:
            print("Dropping loans table...")
            connection.execute(text("DROP TABLE IF EXISTS loans"))
            connection.commit()
            print("Loans table dropped.")

        # Recreate tables (SQLAlchemy only creates missing tables)
        print("Recreating loans table...")
        Base.metadata.create_all(bind=engine)
        print("Loans table recreated successfully.")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    recreate_loans()
