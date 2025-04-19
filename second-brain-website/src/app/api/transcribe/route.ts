import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
// Ensure OPENAI_API_KEY is set in your environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set.")
    return NextResponse.json(
      { error: "Server configuration error: Missing API key." },
      { status: 500 }
    )
  }

  const requestCookies = await cookies();
  const userId = requestCookies.get("user_id")?.value;
  if (!userId) {
    console.error("User ID not found in cookies.")
    return NextResponse.json(
      { error: "User authentication error." },
      { status: 401 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get("audio") as Blob | null
    const title = formData.get("title") as string | null // Optional: Get title if needed later

    if (!file) {
      return NextResponse.json({ error: "No audio file provided." }, { status: 400 })
    }

    // Convert Blob to a File object which the OpenAI SDK expects
    const fileName = title ? `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav` : "recording.wav";
    const audioFile = new File([file], fileName, { type: file.type });

    console.log(`Received audio file "${fileName}" for transcription.`)

    // Call OpenAI Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      // You can add optional parameters like 'language' if needed
      // language: "en",
    })

    console.log("Transcription successful:", transcription.text)

    await fetch(`${process.env.AGENT_BACKEND_URL}/api/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": "user_id=" + userId,
      },
      body: JSON.stringify({
        content: transcription.text,
      }),
    })

    // Here you might want to save the transcription text along with the title
    // to your database or knowledge base. For now, just return it.

    return NextResponse.json({ transcription: transcription.text })
  } catch (error) {
    console.error("Error processing transcription request:", error)
    let errorMessage = "Failed to transcribe audio."
    if (error instanceof Error) {
      errorMessage = error.message
    }
    // Check for specific OpenAI errors if needed
    if (error instanceof OpenAI.APIError) {
        console.error("OpenAI API Error:", error.status, error.message, error.code, error.type);
        errorMessage = `OpenAI Error: ${error.message}`;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
