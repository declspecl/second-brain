import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStdio

load_dotenv()

gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set")

assert gemini_api_key is not None

google_maps_api_key = os.getenv("GOOGLE_MAPS_API_KEY")
if not google_maps_api_key:
    raise ValueError("GOOGLE_MAPS_API_KEY environment variable not set")

assert google_maps_api_key is not None

model_name = "gemini-2.0-flash"
mcp_servers = {
    "fetch": MCPServerStdio(
        'uvx',
        args=[
            "mcp-server-fetch"
        ]
    ),
    "airbnb": MCPServerStdio(
        'npx',
        args=[
            '-y',
            '@openbnb/mcp-server-airbnb',
            '--ignore-robots-txt',
        ]
    ),
    "googlemaps": MCPServerStdio(
        "npx",
        args=[
            "-y",
            "@modelcontextprotocol/server-google-maps"
        ],
        env={
            "GOOGLE_MAPS_API_KEY": str(google_maps_api_key)
        }
    ),
    "datetime": MCPServerStdio(
        "uvx",
        args=[
            "mcp-datetime"
        ]
    ),
    "sqlite": MCPServerStdio(
        "uv",
        args=[
            "--directory",
            str(Path.home().joinpath("mcp-servers/src/sqlite")),
            "run",
            "mcp-server-sqlite",
            "--db-path",
            str(Path.home().joinpath("second-brain.db"))
        ]
    ),
}

agent = Agent(model_name, mcp_servers=list(mcp_servers.values()))

def create_system_prompt(user_id: int, history: str | None, user_input: str) -> str:
    current_chat_content: str

    if history:
        current_chat_content = f"""
You and the user, in this current chat, have the following previous messages:

{history}
"""
    else:
        current_chat_content = "The user has no previous chat history. This is the first chat."

    return f"""
## Context

You are Second Brain, a sidekick agent that learns the user's preferences and habits over time. You learn from their
meetings, notes, and other interactions. You can also use the following tools to help the user:
- **fetch**: Fetch data from the web.
- **airbnb**: Search for Airbnb listings.
- **googlemaps**: Search for places and get directions.
- **datetime**: Get the current date and time.
- **sqlite**: Query the SQLite database.

### SQLite Database

The SQLite database is located at {str(Path.home().joinpath("test.db"))}.
You can ONLY query the database using SQL. You cannot modify it.
This database is the CORE of your knowledge. All of the user's knowledge is stored here and is associated with the user_id.
In this case, the user_id is "{user_id}".
The database has these tables with these schemas:

#### users
- `user_id`: The user's ID.
- `name`: The user's name.
- `email`: The user's email address.

### information
- `info_id`: The information's ID.
- `fk_user_id`: The user's ID. Foreign key to the users table.
- `content`: The information's content.
- `created_at`: The date and time the note was created.

## Current Chat

{current_chat_content}

## Task

The user has asked you to do the following:

{user_input}

## Instructions

You are a helpful assistant. You will respond to the user in a friendly and informative manner.
You will use the tools provided to you to help the user.
You will query the SQLite database across the information table to find relevant information.
Even for queries that are not directly related to the user, you will use the information in the database to help you form better responses.
For example, if the user asks you about a specific topic, you will check the database to see if there is any relevant information stored there, like opinions or preferences they have.
You will use the information you find to help the user.
"""

async def send_agent_prompt(user_id: int, history: str | None, user_input: str):
    system_prompt = create_system_prompt(user_id, history, user_input)
    print(f"Prompting agent with system prompt of len {len(system_prompt)}")
    result = await agent.run(system_prompt)
    print(f"Agent result: {result}")
    return result.output
