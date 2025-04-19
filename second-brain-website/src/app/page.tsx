"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Dashboard from "@/components/dashboard"
import { Button } from "@/components/ui/button"
import { UserAccountNav } from "@/components/user-account-nav"
import { useCookies } from 'next-client-cookies';

export default function Home() {
  const [mode, setMode] = useState<"personal" | "professional">("personal")

  const cookies = useCookies();

  // Mock authentication state - in a real app, this would come from your auth provider
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const userId = cookies.get("user_id");
    console.log(userId);
    if (userId) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  })

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Second Brain</h1>
          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <Button asChild>
                <Link href="/sign-in">
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="bg-background">
        <div className="container mx-auto px-4 py-8 bg-background">
          <Tabs value={mode} onValueChange={(value) => setMode(value as "personal" | "professional")} className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="personal">Personal Mode</TabsTrigger>
              <TabsTrigger value="professional">Professional Mode</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <Dashboard mode="personal" />
            </TabsContent>
            <TabsContent value="professional">
              <Dashboard mode="professional" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
