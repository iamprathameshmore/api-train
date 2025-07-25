import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GithubIcon, Linkedin } from "lucide-react"

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
          <CardTitle>Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Democratize machine learning by removing barriers to entry. No setup. No code. Just results.
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

      <Card>
        <CardHeader>
          <CardTitle>Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">APItrain uses modern tools:</p>
          <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
            <li>Frontend: React, TypeScript, TailwindCSS</li>
            <li>Backend: FastAPI, Pydantic, SQLAlchemy</li>
            <li>ML: AutoGluon, scikit-learn</li>
            <li>Infra: Docker, GitHub Actions, Firebase</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meet the Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <strong>Prathamesh More</strong> is a passionate engineer from Maharashtra, India 🇮🇳. He loves working at the intersection of AI and developer tooling.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="https://github.com/prathameshmr" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <GithubIcon className="mr-2" /> GitHub
              </Button>
            </a>
            <a href="https://linkedin.com/in/prathameshmr" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Linkedin className="mr-2" /> LinkedIn
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contribute</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We welcome contributors! Star the repo, fork it, open issues or submit PRs — every bit helps.
          </p>
          <a href="https://github.com/yourusername/apitrain" target="_blank" rel="noopener noreferrer">
            <Button className="mt-4">Contribute on GitHub</Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
