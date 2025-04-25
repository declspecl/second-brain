from sqlite3 import connect
from pydantic import BaseModel
from src.constants import DATABASE_FILE
from fastapi import FastAPI, HTTPException, status

app = FastAPI()

class StoreContentRequest(BaseModel):
    content: str

@app.post("/content")
async def handle_store_content(request: StoreContentRequest):
    content = request.content.strip()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Content cannot be empty"
        )

    conn = connect(DATABASE_FILE)
    cursor =  conn.cursor()

    cursor.execute(f"INSERT INTO content (content) VALUES ({request.content})")

    cursor.close()
    conn.close()
