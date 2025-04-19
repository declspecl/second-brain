import sqlite3
from pathlib import Path

def create_schema():
    db_path = str(Path.home().joinpath("second-brain.db"))

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    users_schema = """
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """
    cursor.execute(users_schema)

    info_schema = """
        CREATE TABLE IF NOT EXISTS information (
            info_id INTEGER PRIMARY KEY AUTOINCREMENT,
            fk_user_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (fk_user_id) REFERENCES users(user_id) ON DELETE CASCADE
        )
    """
    cursor.execute(info_schema)

    conn.commit()
    conn.close()
