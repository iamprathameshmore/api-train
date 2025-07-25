"use client"

import { Outlet } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import downloadGif from "@/assets/download.gif"

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left: Form Section */}
      <div className="flex flex-1 bg-white px-6 py-12 items-center justify-center">
        <Card className="w-full min-w-3xs shadow-none border-none">
          {/* Make vertical layout here */}
          <CardContent className="h-[80vh] flex flex-col justify-between">
            {/* Header */}
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">Welcome to APITrain</h1>
              <p className="text-sm text-muted-foreground">
                Build AI APIs with zero boilerplate
              </p>
            </div>

            {/* Form Area (Outlet) */}
            <div className="flex justify-center max-w-2xl">
              <Outlet />
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-400 text-center">
              © {new Date().getFullYear()} API Train — Made with ❤️ in India
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Right: Illustration Section */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-black">
        <img
          src={downloadGif}
          alt="AI workflow animation"
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  )
}
