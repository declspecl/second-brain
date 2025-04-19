"use client";

import { useState } from "react";
import { Check, Bold, Italic, List, ListOrdered, Save, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TextEditorProps {
  mode: "personal" | "professional";
}

export default function TextEditor({ mode }: TextEditorProps) {
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/info", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: JSON.stringify({ content: content }),
      });

      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }

      const data = await response.text();
      setContent("");
      setIsComplete(true);
    } catch (error: any) {
      console.error("Error submitting text:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    setSelectedFormat([]);
  };

  const handleFormatText = (format: string) => {
    // In a real implementation, this would apply formatting to the selected text
    // For this demo, we'll just toggle the format buttons
    if (selectedFormat.includes(format)) {
      setSelectedFormat(selectedFormat.filter((f) => f !== format));
    } else {
      setSelectedFormat([...selectedFormat, format]);
    }
  };

  const formatPlaceholder =
    mode === "personal"
      ? "Write your personal notes, ideas, or thoughts here..."
      : "Document your professional notes, meeting minutes, or project ideas here...";

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-4">Write and save text directly to your knowledge base.</p>

      {!isComplete ? (
        <div className="space-y-4">
          <div className="border rounded-md p-1">
            <ToggleGroup type="multiple" className="flex flex-wrap justify-start border-b p-1">
              <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => handleFormatText("bold")}>
                <Bold className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => handleFormatText("italic")}>
                <Italic className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="bullet"
                aria-label="Toggle bullet list"
                onClick={() => handleFormatText("bullet")}
              >
                <List className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="number"
                aria-label="Toggle numbered list"
                onClick={() => handleFormatText("number")}
              >
                <ListOrdered className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <Textarea
              placeholder={formatPlaceholder}
              className="min-h-[300px] border-0 focus-visible:ring-0 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!content.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Submit to Agent
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <Card className="p-6">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Note Saved</h3>
            <p className="text-sm text-muted-foreground text-center">
              Your note has been added to your {mode} knowledge base.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
