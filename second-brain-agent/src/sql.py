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

def add_user(name: str, email: str) -> int:
    db_path = str(Path.home().joinpath("second-brain.db"))

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("INSERT INTO users (name, email) VALUES (?, ?)", (name, email))
    user_id = cursor.lastrowid
    assert user_id is not None, "Failed to retrieve user ID after insertion"

    conn.commit()
    conn.close()

    return user_id

def add_information(user_id: int, content: str) -> int:
    db_path = str(Path.home().joinpath("second-brain.db"))

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("INSERT INTO information (fk_user_id, content) VALUES (?, ?)", (user_id, content))
    info_id = cursor.lastrowid
    assert info_id is not None, "Failed to retrieve information ID after insertion"

    conn.commit()
    conn.close()

    return info_id

def get_user_by_id(user_id: int):
    db_path = str(Path.home().joinpath("second-brain.db"))

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT user_id, name, email FROM users WHERE user_id = ?", (user_id,))
    user = cursor.fetchone()

    conn.close()

    return user

def get_all_users_from_db():
    db_path = str(Path.home().joinpath("second-brain.db"))

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT user_id, name, email FROM users")
    users = cursor.fetchall()

    conn.close()

    return users
