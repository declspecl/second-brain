"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Brain, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [acceptTerms, setAcceptTerms] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        if (!acceptTerms) {
            newErrors.terms = "You must accept the terms and conditions"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        // Simulate registration delay
        setTimeout(() => {
        setIsLoading(false)
        // In a real app, you would register the user and store auth tokens
        // For demo, we'll just redirect to the sign-in page
        router.push("/sign-in")
        }, 1500)
    }

    return (
        <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-16">
            <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
                <div className="flex flex-col space-y-3 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-primary/10 p-4">
                            <Brain className="h-10 w-10 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                    <p className="text-sm text-muted-foreground">Sign up to start building your Second Brain</p>
                    </div>

                    <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Sign up</CardTitle>
                            <CardDescription>Enter your information to create an account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={errors.confirmPassword ? "border-red-500" : ""}
                            />
                            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                checked={acceptTerms}
                                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                                className={errors.terms ? "border-red-500" : ""}
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                I accept the{" "}
                                <Link href="#" className="text-primary hover:underline">
                                    terms and conditions
                                </Link>
                            </label>
                        </div>
                        {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}

                        {Object.keys(errors).length > 0 && (
                            <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>Please fix the errors above to continue</AlertDescription>
                            </Alert>
                        )}
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                                    Creating account...
                                </>
                                ) : (
                                "Create account"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                    </Card>

                    <div className="text-center text-sm">
                    <p className="text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-primary hover:underline">
                        Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}