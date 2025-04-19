import asyncio
from src.agent import agent
from src.api import app

async def main():
    async with agent.run_mcp_servers():
        app.run(host="0.0.0.0", port=8888, debug=True)

if __name__ == "__main__":
    asyncio.run(main())
        