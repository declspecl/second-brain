from typing import Optional
from pydantic import BaseModel
from src.agent import send_agent_prompt
from src.sql import add_information, add_user, get_user_by_id
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, HTTPException, status, Depends

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    history: Optional[str] = None
    prompt: str

class PromptResponse(BaseModel):
    response: str

async def get_user_id(request: Request) -> int:
    user_id_str = request.cookies.get("user_id")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No user ID provided in cookies"
        )
    try:
        return int(user_id_str.strip())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format in cookie"
        )

@app.post("/api/prompt", response_model=PromptResponse)
async def handle_user_prompt(
    data: PromptRequest,
    user_id: int = Depends(get_user_id)
):
    """Handles user prompts, interacts with the agent, and returns the response."""
    print(f"Received request for user_id: {user_id}")
    print(f"History provided: {'Yes' if data.history else 'No'}")
    print(f"Prompt: {data.prompt}")

    if not data.prompt or not data.prompt.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Prompt cannot be empty"
        )

    prompt_content = data.prompt.strip()

    print("Sending prompt to agent...")
    try:
        agent_response_content = await send_agent_prompt(user_id, data.history, prompt_content)
        print(f"Got response from agent: {agent_response_content}")

        return PromptResponse(response=agent_response_content)

    except Exception as e:
        print(f"Error during agent interaction: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your request."
        )

class SaveToDBRequest(BaseModel):
    content: str

class SaveToDBResponse(BaseModel):
    info_id: int

@app.post("/api/info", response_model=SaveToDBResponse)
async def handle_save_info(
    data: SaveToDBRequest,
    user_id: int = Depends(get_user_id)
):
    print(f"Received request for user_id: {user_id}")
    print(f"Content to save: {data.content}")

    if not data.content or not data.content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Content cannot be empty"
        )

    content = data.content.strip()

    print("Saving content to database...")
    try:
        info_id = add_information(user_id, content)
        print("Content saved successfully.")

        return SaveToDBResponse(info_id=info_id)

    except Exception as e:
        print(f"Error during saving to DB: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while saving to the database."
        )

class UserCreate(BaseModel):
    username: str
    email: str

class User(BaseModel):
    id: int
    username: str
    email: str


@app.post("/api/users", response_model=User)
async def create_user(user: UserCreate):
    print(f"Received request to create user: {user}")

    try:
        user_id = add_user(user.username, user.email)
        print("User created successfully.")

        return User(id=user_id, username=user.username, email=user.email)

    except Exception as e:
        print(f"Error during user creation: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the user."
        )

@app.get("/api/users/{user_id}", response_model=User)
async def get_user(user_id: int):
    print(f"Received request to get user with ID: {user_id}")

    try:
        user = get_user_by_id(user_id)
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID {user_id} not found."
            )
        print("User retrieved successfully.")

        return User(id=user[0], username=user[1], email=user[2])

    except Exception as e:
        print(f"Error during user retrieval: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving the user."
        )
