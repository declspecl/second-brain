import asyncio
import time

from pydantic import BaseModel

from mcp_agent.app import MCPApp
from mcp_agent.config import (
    GoogleSettings,
    Settings,
    LoggerSettings,
    MCPSettings,
    MCPServerSettings,
)
from mcp_agent.agents.agent import Agent
from mcp_agent.workflows.llm.augmented_llm_google import GoogleAugmentedLLM

class Essay(BaseModel):
    title: str
    body: str
    conclusion: str

settings = Settings(
    execution_engine="asyncio",
    logger=LoggerSettings(type="file", level="debug"),
    mcp=MCPSettings(
        servers={
            "fetch": MCPServerSettings(
                command="uvx",
                args=["mcp-server-fetch"],
            ),
        }
    ),
    google=GoogleSettings(
        default_model="gemini-2.0-flash",
    ),
)

app = MCPApp(
    name="second-brain-agent"
)


async def example_usage():
    async with app.run() as agent_app:
        logger = agent_app.logger
        context = agent_app.context

        logger.info("Current config:", data=context.config.model_dump())

        finder_agent = Agent(
            name="finder",
            instruction="""You are an agent with the ability to fetch URLs. Your job is to identify 
            the closest match to a user's request, make the appropriate tool calls, 
            and return the URI and CONTENTS of the closest match.""",
            server_names=["fetch"],
        )

        async with finder_agent:
            logger.info("finder: Connected to server, calling list_tools...")
            result = await finder_agent.list_tools()
            logger.info("Tools available:", data=result.model_dump())

            llm = await finder_agent.attach_llm(GoogleAugmentedLLM)

            result = await llm.generate_str(
                message="Print the first 2 paragraphs of https://modelcontextprotocol.io/introduction",
            )
            logger.info(f"First 2 paragraphs of Model Context Protocol docs: {result}")

            result = await llm.generate_structured(
                message="Create a short essay using the first 2 paragraphs.",
                response_model=Essay,
            )
            logger.info(f"Structured paragraphs: {result}")

async def main():
    start = time.time()
    await example_usage()
    end = time.time()
    t = end - start

    print(f"Total run time: {t:.2f}s")

if __name__ == "__main__":
    asyncio.run(main())
