from pydantic import BaseModel
from fastapi import FastAPI
from sqlite3 import connect
from src.constants import DATABASE_FILE

app = FastAPI()

class StoreContentRequest(BaseModel):
    content: str

@app.post("/content")
async def handle_store_content(request: StoreContentRequest):
    conn = connect(DATABASE_FILE)
    cursor =  conn.cursor()

    cursor.execute(f"INSERT INTO content (content) VALUES ({request.content})")

    cursor.close()
    conn.close()