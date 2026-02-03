from database import engine
from sqlalchemy import text

def add_column():
    with engine.connect() as connection:
        # Transaction is auto-committed in some modes, but explicit commit is safer for DDL
        trans = connection.begin()
        try:
            # Check if column exists is hard across DBs in raw SQL without inspection
            # So we just try to add it and catch error if it fails
            connection.execute(text("ALTER TABLE books ADD COLUMN image_url VARCHAR(500)"))
            trans.commit()
            print("Successfully added image_url column to books table.")
        except Exception as e:
            trans.rollback()
            print(f"Migration might have failed or column already exists. Error: {e}")

if __name__ == "__main__":
    add_column()
