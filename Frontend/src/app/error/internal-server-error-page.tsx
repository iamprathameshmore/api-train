// src/app/website/internal-error-page.tsx
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { BugIcon } from "lucide-react"

export default function InternalErrorPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <BugIcon className="w-12 h-12 text-yellow-600" />
        </div>
        <h1 className="text-4xl font-bold">500 – Internal Server Error</h1>
        <p className="text-muted-foreground">
          Something went wrong on our end. We're working on it. Try again later.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button variant="default" onClick={() => navigate("/")}>
            Go to Home
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    </div>
  )
}
