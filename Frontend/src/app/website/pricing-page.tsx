// src/app/website/pricing-page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">💰 Pricing</h1>
      <p className="text-muted-foreground text-center max-w-xl mx-auto">
        APItrain is open source and free to use for personal or academic projects. For teams and enterprises, you can self-host or contact us for support plans.
      </p>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🎓 Free</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <ul className="list-disc list-inside">
              <li>All features</li>
              <li>Unlimited API deployments</li>
              <li>Local Docker support</li>
              <li>MIT Licensed</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>👨‍💼 Team (Self-host)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <ul className="list-disc list-inside">
              <li>Team dashboard</li>
              <li>Private APIs</li>
              <li>Email/Discord support</li>
              <li>Early access to features</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏢 Enterprise (Custom)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-muted-foreground">
            <ul className="list-disc list-inside">
              <li>Custom ML models</li>
              <li>Data privacy agreements</li>
              <li>On-premise deployment</li>
              <li>Premium support</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
