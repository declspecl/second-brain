"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, StopCircle, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LiveRecordingProps {
  mode: "personal" | "professional"
}

export default function LiveRecording({ mode }: LiveRecordingProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [recordingTitle, setRecordingTitle] = useState("")
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
      setIsRecording(true)

      // Start timer
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
        const blob = new Blob(chunks, { type: "audio/webm" })

        // In a real app, you would upload this blob to your server
        console.log("Recording complete", blob)

        // Simulate processing
        setIsProcessing(true)
        setTimeout(() => {
          setIsProcessing(false)
          setIsComplete(true)

          setTimeout(() => {
            setIsComplete(false)
            setRecordingTitle("")
          }, 3000)
        }, 2000)
      }
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check permissions.")
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

    setIsRecording(false)
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">
        Record audio notes, meetings, or ideas to add to your knowledge base.
      </p>

      {!isRecording && !isProcessing && !isComplete ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recording-title">Recording Title</Label>
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
      ) : isRecording ? (
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
      ) : isProcessing ? (
        <Card className="p-6">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-medium mb-2">Processing your recording</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Your audio is being processed and added to your knowledge base.
            </p>
            <Progress value={50} className="w-full" />
          </div>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Recording Complete</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your audio recording has been added to your {mode} knowledge base.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
