// src/app/website/about-page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-6">
      <h1 className="text-3xl font-bold">🚀 About APItrain</h1>

      <Card>
        <CardHeader>
          <CardTitle>Built for Developers, by Developers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            APItrain is an open-source no-code ML API generator created by{" "}
            <strong>Prathamesh More</strong> from Amravati, India 🇮🇳.
          </p>
          <p className="mt-2">
            The goal is simple: let anyone build and deploy ML models without touching ML code — powered by FastAPI, React, and AutoML.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Why APItrain?</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>🔥 Converts any CSV dataset into a working API</li>
            <li>⚙️ Powered by AutoML (AutoGluon, sklearn)</li>
            <li>📦 Docker-ready and open source</li>
            <li>💡 Great for students, researchers, devs, and teams</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
