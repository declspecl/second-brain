"use client"

import { useState } from "react"
import { Calendar, FileText, Mail, MapPin, LinkIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface ActionPanelProps {
  mode: "personal" | "professional"
}

export default function ActionPanel({ mode }: ActionPanelProps) {
  const [actionType, setActionType] = useState("document")
  const [instruction, setInstruction] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleSubmit = () => {
    if (instruction.trim() === "") return

    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)

      // Reset after showing completion
      setTimeout(() => {
        setIsComplete(false)
        setInstruction("")
      }, 3000)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tell your Second Brain what to do</h3>
        <p className="text-sm text-muted-foreground">
          Instruct your {mode} Second Brain to take actions based on your knowledge base.
        </p>
      </div>

      <RadioGroup value={actionType} onValueChange={setActionType} className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div>
          <RadioGroupItem value="document" id="document" className="sr-only" />
          <Label
            htmlFor="document"
            className={`flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
              actionType === "document" ? "border-primary" : "border-muted"
            }`}
          >
            <FileText className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Create Document</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="calendar" id="calendar" className="sr-only" />
          <Label
            htmlFor="calendar"
            className={`flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
              actionType === "calendar" ? "border-primary" : "border-muted"
            }`}
          >
            <Calendar className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Calendar Event</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="email" id="email" className="sr-only" />
          <Label
            htmlFor="email"
            className={`flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
              actionType === "email" ? "border-primary" : "border-muted"
            }`}
          >
            <Mail className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Draft Email</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="location" id="location" className="sr-only" />
          <Label
            htmlFor="location"
            className={`flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
              actionType === "location" ? "border-primary" : "border-muted"
            }`}
          >
            <MapPin className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Find Location</span>
          </Label>
        </div>

        <div>
          <RadioGroupItem value="link" id="link" className="sr-only" />
          <Label
            htmlFor="link"
            className={`flex flex-col items-center justify-center rounded-md border-2 p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
              actionType === "link" ? "border-primary" : "border-muted"
            }`}
          >
            <LinkIcon className="mb-2 h-6 w-6" />
            <span className="text-sm font-medium">Create Link</span>
          </Label>
        </div>
      </RadioGroup>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            {actionType === "document" && "Create a Document"}
            {actionType === "calendar" && "Schedule a Calendar Event"}
            {actionType === "email" && "Draft an Email"}
            {actionType === "location" && "Find a Location"}
            {actionType === "link" && "Create a Link"}
          </CardTitle>
          <CardDescription>Provide instructions for your Second Brain</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder={
              actionType === "document"
                ? "Create a document summarizing my meeting notes from yesterday..."
                : actionType === "calendar"
                  ? "Schedule a team meeting for next Tuesday at 2pm..."
                  : actionType === "email"
                    ? "Draft an email to the marketing team about the new campaign..."
                    : actionType === "location"
                      ? "Find the nearest coffee shop to my office..."
                      : "Create a link to the research paper I read last week about AI..."
            }
            className="min-h-[100px] resize-none"
          />

          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={instruction.trim() === "" || isProcessing || isComplete}
              className="relative"
            >
              {isProcessing ? (
                <>
                  <span className="opacity-0">Process</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin"></div>
                  </div>
                </>
              ) : isComplete ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Complete
                </>
              ) : (
                "Process"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
