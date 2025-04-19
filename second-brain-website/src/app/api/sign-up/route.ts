import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { name, email } = await request.json();
  const agentBackendUrl = process.env.AGENT_BACKEND_URL;

  if (!agentBackendUrl) {
    return new NextResponse(JSON.stringify({ error: 'AGENT_BACKEND_URL is not defined' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const res = await fetch(`${agentBackendUrl}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: name, email }),
    });

    if (!res.ok) {
      console.error('Error response from agent backend:', await res.text());
      return new NextResponse(
        JSON.stringify({ error: `Agent backend returned an error: ${res.status} ${res.statusText}` }),
        {
          status: res.status,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const { id: user_id } = await res.json();

    if (typeof user_id !== 'number') {
      console.error('Invalid user_id received:', user_id);
      return new NextResponse(JSON.stringify({ error: 'Invalid user_id received from agent backend' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const response = NextResponse.redirect("/");
    response.headers.set(
      'Set-Cookie',
      `user_id=${user_id}; Path=/;`
    );

    return response;

  } catch (error) {
    console.error('Error during sign-up:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to sign up user' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
