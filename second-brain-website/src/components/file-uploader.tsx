"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, Mic } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"

interface FileUploaderProps {
  mode: "personal" | "professional"
}

export default function FileUploader({ mode }: FileUploaderProps) {
  const [fileType, setFileType] = useState("document")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    // Simulate file upload
    if (e.dataTransfer.files.length > 0) {
      simulateUpload()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload()
    }
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsUploading(false)
          }, 500)
          return 100
        }
        return prev + 5
      })
    }, 100)
  }

  return (
    <div className="space-y-6">
      {!isUploading ? (
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-200 dark:border-gray-800"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Drag & drop your files</h3>
              <p className="text-sm text-muted-foreground">or click to browse from your computer</p>
            </div>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Select File
              </div>
              <input
                id="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileSelect}
                accept={fileType === "document" ? ".pdf,.txt,.doc,.docx" : ".mp3,.wav,.m4a"}
              />
            </Label>
          </div>
        </div>
      ) : (
        <div className="space-y-4 p-6 border rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Uploading...</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Your file is being uploaded and processed. This might take a moment.
          </p>
        </div>
      )}
    </div>
  )
}
