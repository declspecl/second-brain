from typing import Optional
from pydantic import BaseModel
from src.agent import send_agent_prompt
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
