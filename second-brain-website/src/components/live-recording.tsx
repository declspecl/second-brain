"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, StopCircle, Loader2, Check, AlertCircle, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type RecordingStatus = "idle" | "recording" | "uploading" | "transcribing" | "success" | "error"

interface LiveRecordingProps {
  mode: "personal" | "professional"
  onTranscriptionComplete?: (transcription: string, title: string) => void // Optional callback
}

export default function LiveRecording({ mode, onTranscriptionComplete }: LiveRecordingProps) {
  const [status, setStatus] = useState<RecordingStatus>("idle")
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingTitle, setRecordingTitle] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      // Start recording
      mediaRecorder.start()
      setStatus("recording")
      setErrorMessage(null) // Clear previous errors

      // Start timer
      setRecordingTime(0) // Reset timer
      let seconds = 0
      timerRef.current = setInterval(() => {
        seconds++
        setRecordingTime(seconds)
      }, 1000)

      // Handle recording data
      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      // Handle recording stop
      mediaRecorder.onstop = () => {
        // Create blob from recorded data
        const blob = new Blob(chunks, { type: "audio/wav" }) // Using wav as it's often better supported by Whisper

        // Upload the blob to the server
        uploadRecording(blob)
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      setErrorMessage("Could not access microphone. Please check permissions.")
      setStatus("error")
    }
  }

  const uploadRecording = async (blob: Blob) => {
    setStatus("uploading")
    setErrorMessage(null)

    const formData = new FormData()
    const safeTitle = recordingTitle || `Recording ${new Date().toISOString()}`
    const fileName = `${safeTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.wav`;
    formData.append("audio", blob, fileName)
    formData.append("title", safeTitle) // Send title along

    try {
      console.log(`Uploading ${fileName}...`)
      setStatus("transcribing") // Move to transcribing state after upload starts
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("Transcription received:", result.transcription)
      setStatus("success")

      // Optional: Call callback with result
      if (onTranscriptionComplete) {
        onTranscriptionComplete(result.transcription, safeTitle)
      }

      // Reset after a delay
      setTimeout(() => {
        setStatus("idle")
        setRecordingTitle("")
      }, 5000) // Increased delay to show success message longer

    } catch (error) {
      console.error("Error uploading/transcribing recording:", error)
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred during upload/transcription.")
      setStatus("error")
      // Optionally reset after error display
       setTimeout(() => {
         setStatus("idle")
       }, 5000)
    }
  }

  const stopRecording = () => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Stop media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }

    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    // Don't change status here, uploadRecording handles transitions
    // setStatus("idle") // This would interrupt the upload process
  }

  const renderStatusUI = () => {
    switch (status) {
      case "idle":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recording-title">Recording Title (Optional)</Label>
              <Input
                id="recording-title"
                placeholder={`My ${mode} audio recording`}
                value={recordingTitle}
                onChange={(e) => setRecordingTitle(e.target.value)}
              />
            </div>
            <Card className="flex flex-col items-center justify-center p-10 border-dashed">
              <div className="rounded-full bg-primary/10 p-6 mb-4">
                <Mic className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Ready to record</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Click the button below to start recording audio.
              </p>
              <Button onClick={startRecording}>Start Recording</Button>
            </Card>
          </div>
        )
      case "recording":
        return (
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center mb-4">
                <div className="h-4 w-4 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                <span className="text-lg font-medium">Recording {formatTime(recordingTime)}</span>
              </div>
              <div className="w-full mb-6">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/20">
                    <div
                      style={{ width: "100%" }}
                      className="animate-pulse shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex justify-center items-center space-x-2">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="h-2 w-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <Button variant="destructive" onClick={stopRecording}>
                  <StopCircle className="h-4 w-4 mr-2" />
                  Stop Recording
                </Button>
              </div>
            </div>
          </Card>
        )
      case "uploading":
      case "transcribing":
        return (
          <Card className="p-6">
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {status === "uploading" ? "Uploading..." : "Transcribing..."}
              </h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {status === "uploading"
                  ? "Sending your audio to the server."
                  : "Processing your audio with AI. This may take a moment."}
              </p>
              <Progress value={status === "uploading" ? 30 : 70} className="w-full" />
            </div>
          </Card>
        )
      case "success":
        return (
          <Card className="p-6 border-green-500">
            <div className="flex flex-col items-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Transcription Complete</h3>
              <p className="text-sm text-muted-foreground text-center">
                Your audio recording has been transcribed successfully.
              </p>
            </div>
          </Card>
        )
      case "error":
        return (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {errorMessage || "An unknown error occurred."}
            </AlertDescription>
             <Button variant="secondary" size="sm" onClick={() => setStatus("idle")} className="mt-4">
               Try Again
             </Button>
          </Alert>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">
        Record audio notes, meetings, or ideas. The audio will be transcribed automatically.
      </p>
      {renderStatusUI()}
    </div>
  )
}
