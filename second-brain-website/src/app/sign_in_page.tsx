"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Brain } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate authentication delay
        setTimeout(() => {
        setIsLoading(false)
        // In a real app, you would store auth tokens, etc.
        // For demo, we'll just redirect to the dashboard
        router.push("/")
        }, 1500)
    }

    return (
        <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-16">
            <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
                <div className="flex flex-col space-y-3 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-4">
                            <Brain className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">Sign in to access your Second Brain</p>
                </div>

                <Card>
                <form onSubmit={handleSignIn}>
                    <CardHeader>
                        <CardTitle>Sign in with Email</CardTitle>
                        <CardDescription>Enter your email and password to access your account</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" required />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-xs text-primary hover:underline">
                            Forgot password?
                        </Link>
                        </div>
                        <Input id="password" type="password" required />
                    </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                Signing in...
                            </>
                            ) : (
                            "Sign In"
                            )}
                        </Button>
                    </CardFooter>
                </form>
                </Card>

                <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/sign-up" className="text-primary hover:underline">
                        Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
