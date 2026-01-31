"""
Script to drop all tables and recreate them from scratch.
Use this if you're having database migration issues.
"""

from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as connection:
        # Drop all existing tables
        print("Dropping existing tables...")
        connection.execute(text("DROP TABLE IF EXISTS loans"))
        connection.execute(text("DROP TABLE IF EXISTS books"))
        connection.execute(text("DROP TABLE IF EXISTS users"))
        connection.commit()
        print("All tables dropped successfully!")
        print("\nNow you can run main.py to create fresh tables.")
        
except Exception as e:
    print(f"Error: {e}")
