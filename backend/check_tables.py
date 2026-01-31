from database import engine
from sqlalchemy import inspect

inspector = inspect(engine)
if 'loans' in inspector.get_table_names():
    indexes = inspector.get_indexes('loans')
    print(f"Indexes on loans table: {indexes}")
else:
    print("Loans table does NOT exist.")
