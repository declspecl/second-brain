#!/usr/bin/env python3

import asyncio
from mcp_agent.app import MCPApp
from mcp_agent.agents.agent import Agent
from mcp_agent.workflows.llm.augmented_llm_google import GoogleAugmentedLLM

app = MCPApp(
    name="second-brain-app",
)

async def execute_prompt() -> str:
    async with app.run() as agent_app:
        logger = agent_app.logger
        context = agent_app.context

        logger.info("Current config:", data=context.config.model_dump())

        agent = Agent(
            name="second-brain-agent",
            instruction="""You are an agent with many abilities, such as fetching websites' content as well as querying google maps. You must use these tools intelligently to automate
            actions for the user and minimize the amount of redundant work they do. You are to be a second brain for the user:
            a clone of their mind that can think and act for them.""",
            server_names=["fetch", "googlemaps", "airbnb"],
        )

        async with agent:
            result = await agent.list_tools()
            logger.info("Tools available:", data=result.model_dump())
            llm = await agent.attach_llm(GoogleAugmentedLLM)
            result = await llm.generate_str(message=input("Enter a prompt: "))
            logger.info(result)

            return result

async def main():
    await execute_prompt()

if __name__ == "__main__":
    asyncio.run(main())
