"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileUploader from "@/components/file-uploader"
import ChatInterface from "@/components/chat-interface"
import ActionPanel from "@/components/action-panel"
import LiveRecording from "@/components/live-recording"
import TextEditor from "@/components/text-editor"
import RecentUploads from "@/components/recent-uploads"

interface DashboardProps {
  mode: "personal" | "professional"
}

export default function Dashboard({ mode }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("upload")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Your Second Brain</CardTitle>
          <CardDescription>
            {mode === "personal"
              ? "Manage your personal knowledge and memories"
              : "Organize your professional information and tasks"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="write">Write Text</TabsTrigger>
              <TabsTrigger value="record">Record Audio</TabsTrigger>
              <TabsTrigger value="ask">Ask</TabsTrigger>
              <TabsTrigger value="action">Take Action</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <FileUploader mode={mode} />
            </TabsContent>

            <TabsContent value="write" className="mt-0">
              <TextEditor mode={mode} />
            </TabsContent>

            <TabsContent value="record" className="mt-0">
              <LiveRecording mode={mode} />
            </TabsContent>

            <TabsContent value="ask" className="mt-0">
              <ChatInterface mode={mode} />
            </TabsContent>

            <TabsContent value="action" className="mt-0">
              <ActionPanel mode={mode} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <RecentUploads mode={mode} />
    </div>
  )
}
