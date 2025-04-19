import { cookies } from "next/headers";

export async function POST(request: Request) {
  const requestCookies = await cookies();
  const userId = requestCookies.get("user_id")?.value;
  if (!userId) {
    console.error("User ID not found in cookies.");
    return new Response("User authentication error.", { status: 401 });
  }

  try {
    const { content } = await request.json();
    if (!content) {
      return new Response("No content provided", { status: 400 });
    }

    const agentBackendUrl = process.env.AGENT_BACKEND_URL;

    if (!agentBackendUrl) {
      throw new Error("AGENT_BACKEND_URL is not defined in the environment variables.");
    }

    const response = await fetch(agentBackendUrl + "/api/info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `user_id=${userId}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error("Agent backend responded with status: " + response.status);
    }

    const responseData = await response.text();
    return new Response(responseData, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error: any) {
    console.error("Error submitting text to agent backend:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
