import asyncio
import uvicorn
from src.agent import agent
from src.sql_setup import create_schema

async def run_mcp():
    print("Starting MCP servers...")
    async with agent.run_mcp_servers():
        print("MCP servers running.")
        await asyncio.Future()

async def run_api():
    print("Starting FastAPI server with Uvicorn...")
    config = uvicorn.Config("src.api:app", host="0.0.0.0", port=8000, reload=True, lifespan="on")
    server = uvicorn.Server(config)
    await server.serve()

async def main():
    print("Creating database schema...")
    create_schema()
    print("Database schema created.")

    mcp_task = asyncio.create_task(run_mcp())
    api_task = asyncio.create_task(run_api())

    done, pending = await asyncio.wait(
        [mcp_task, api_task],
        return_when=asyncio.FIRST_COMPLETED,
    )

    for task in pending:
        task.cancel()
    await asyncio.gather(*pending, return_exceptions=True)

    for task in done:
        if task.exception():
            print(f"Task {task.get_name()} raised an exception: {task.exception()}")


if __name__ == "__main__":
    try:
        print("Starting application...")
        asyncio.run(main())
    finally:
        print("Application shutdown complete.")
