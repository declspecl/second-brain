import asyncio
import uvicorn
from src.app import app

async def start_api_server():
    config = uvicorn.Config("src.app:app", host="127.0.0.1", port="54321", lifespan="on")
    server = uvicorn.Server(config)
    await server.serve()

async def main():
    api_server_task = asyncio.create_task(start_api_server())

    done, pending = await asyncio.wait(
        [api_server_task],
        return_when=asyncio.FIRST_COMPLETED
    )

    for task in pending:
        task.cancel()
    await asyncio.gather(*pending, return_exceptions=True)

if __name__ == "__main__":
    try:
        print("Starting application")
        asyncio.run(main())
    finally:
        print("Application shutdown complete")