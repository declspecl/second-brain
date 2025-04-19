import { FileText, Mic, PenTool, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentUploadsProps {
  mode: "personal" | "professional"
}

export default function RecentUploads({ mode }: RecentUploadsProps) {
  // Mock data - in a real app, this would come from your database
  const uploads = [
    {
      id: 1,
      title: mode === "personal" ? "Family Vacation Planning" : "Q2 Marketing Strategy",
      type: "document",
      date: "2 hours ago",
      size: "1.2 MB",
    },
    {
      id: 2,
      title: mode === "personal" ? "Cooking Recipe Audio" : "Team Meeting Recording",
      type: "audio",
      date: "Yesterday",
      size: "8.5 MB",
    },
    {
      id: 3,
      title: mode === "personal" ? "Book Notes" : "Client Presentation Notes",
      type: "document",
      date: "3 days ago",
      size: "4.7 MB",
    },
    {
      id: 4,
      title: mode === "personal" ? "Journal Entry" : "Project Ideas",
      type: "text",
      date: "Just now",
      size: "2 KB",
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />
      case "audio":
        return <Mic className="h-4 w-4" />
      case "text":
        return <PenTool className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Uploads</CardTitle>
        <CardDescription>Your recently uploaded files in {mode} mode</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {uploads.map((upload) => (
            <div key={upload.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary/10 p-2">{getIcon(upload.type)}</div>
                <div>
                  <p className="font-medium">{upload.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {upload.type}
                    </Badge>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {upload.date}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{upload.size}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
