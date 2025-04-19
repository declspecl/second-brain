import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const apiCookies = await cookies();

  try {
    const agentBackendUrl = process.env.AGENT_BACKEND_URL;
    if (!agentBackendUrl) {
      throw new Error("AGENT_BACKEND_URL is not defined in the environment variables.");
    }

    const userId = request.cookies.get("user_id")?.value;
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "No user ID provided in cookies" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    const { prompt, history } = data;

    if (!prompt || !prompt.trim()) {
      return new NextResponse(JSON.stringify({ error: "Prompt cannot be empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch(`${agentBackendUrl}/api/prompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `user_id=${userId}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        history: history || null,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const agentResponse = await response.json();

    return new NextResponse(JSON.stringify({ response: agentResponse.response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error forwarding prompt:", error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
