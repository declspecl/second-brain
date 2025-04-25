from src.config import Config
from pydantic_ai.agent import Agent
from src.constants import DATABASE_FILE
from pydantic_ai.mcp import MCPServerStdio

def build_mcp_servers():
    return {
        "fetch": MCPServerStdio(
            "uvx",
            args=[
                "mcp-server-fetch"
            ]
        ),
        "datetime": MCPServerStdio(
            "uvx",
            args=[
                "mcp-datetime"
            ]
        ),
        "sqlite": MCPServerStdio(
            "uvx",
            args=[
                "mcp-server-sqlite",
                "--db-file",
                DATABASE_FILE
            ]
        ),
    }

def build_agent(config: Config) -> Agent:
    return Agent(
        config["providers"][config["current_provider"]].model,
        mcp_servers=list(build_mcp_servers().values()),
    )

def build_prompt(user_prompt: str) -> str:
    return f"""
    You are a helpful assistant. Your name is Second Brain. You are a large language model trained by OpenAI.
    You can answer questions, provide information, and assist with various tasks.

    User prompt: {user_prompt}
    """

async def prompt_agent(agent: Agent, user_prompt: str) -> str:
    prompt = build_prompt(user_prompt)
    return (await agent.run(prompt)).output
