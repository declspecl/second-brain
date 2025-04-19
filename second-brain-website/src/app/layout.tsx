import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CookiesProvider } from "next-client-cookies/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Second Brain",
  description: "Your digital memory and productivity sidekick",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <CookiesProvider>
        <body className={inter.className}>
          {children}
        </body>
      </CookiesProvider>
    </html>
  )
}
