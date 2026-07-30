"use client"

import { Outlet } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import downloadGif from "@/assets/download.gif"

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Panel */}
      <section className="flex flex-1 items-center justify-center px-8 py-10 bg-white">
        <Card className="w-full max-w-lg border-0 shadow-none">
          <CardContent className="flex flex-col h-full min-h-[80vh] justify-between">

            {/* Header */}
            <header className="space-y-1">
              <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
                Welcome to APITrain
              </h1>
              <p className="text-sm text-muted-foreground">
                Build AI APIs with zero boilerplate
              </p>
            </header>

            {/* Main Form Area */}
            <main className="flex justify-start">
              <div className="w-full">
                <Outlet />
              </div>
            </main>

            {/* Footer */}
            <footer>
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} API Train • Made with ❤️ in India
              </p>
            </footer>
          </CardContent>
        </Card>
      </section>

      {/* Right Illustration Panel */}
      <section className="hidden md:flex flex-1 items-center justify-center bg-black relative overflow-hidden">
        <img
          src={downloadGif}
          alt="AI workflow animation"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Optional dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </section>
    </div>
  )
}
