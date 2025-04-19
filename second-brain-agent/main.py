import asyncio
import uvicorn  # Import uvicorn
from src.agent import agent

async def run_mcp():
    print("Starting MCP servers...")
    async with agent.run_mcp_servers():
        print("MCP servers running.")
        await asyncio.Future()

async def run_api():
    print("Starting FastAPI server with Uvicorn...")
    config = uvicorn.Config("src.api:app", host="127.0.0.1", port=8000, reload=True, lifespan="on")
    server = uvicorn.Server(config)
    # try:
    #     # Disable Uvicorn's signal handlers to let asyncio manage shutdown
    #     server.install_signal_handlers = lambda: None
    # except AttributeError:
    #     print("Warning: install_signal_handlers attribute not found in Uvicorn Server class.")
    await server.serve()

async def main():
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
