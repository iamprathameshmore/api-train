"use client"

import React from "react"
import { Helmet } from "react-helmet"
import { Button } from "@/components/ui/button"
import {
  HomeIcon,
  DatabaseIcon,
  TerminalIcon,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Helmet>
        <title>APItrain – No-Code ML API Deployment</title>
        <meta
          name="description"
          content="Train, deploy, and manage ML models as REST APIs – no code required. Built for developers and data scientists."
        />
        <link rel="canonical" href="https://apitrain.dev/" />
      </Helmet>

      {/* HERO */}
      <section className="bg-gradient-to-r from-purple-200 to-white">
        <div className="container mx-auto text-center py-24 px-6 max-w-4xl">
          <h1 className="text-5xl font-extrabold leading-tight mb-4">
            Build & Deploy ML APIs in Minutes – No Code Needed
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Upload datasets, auto-train models, and serve them as RESTful APIs with a beautiful dashboard – built for speed and simplicity.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="/signup">
              <Button size="lg">Get Started Free</Button>
            </a>
            <a
              href="https://github.com/yourusername/apitrain"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="lg">View on GitHub</Button>
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">✨ Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<HomeIcon size={28} />}
            title="No-Code Model Training"
            desc="Automatically preprocess and train models on any CSV dataset using AutoGluon."
          />
          <FeatureCard
            icon={<TerminalIcon size={28} />}
            title="Auto-Generated REST API"
            desc="Trained models are instantly available via FastAPI with Swagger support."
          />
          <FeatureCard
            icon={<DatabaseIcon size={28} />}
            title="1-Click Docker Deployment"
            desc="Dockerized backend lets you deploy models on cloud, VPS or local machines with ease."
          />
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="dashboard" className="bg-muted py-20">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4">📊 Visual Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Monitor model performance, test APIs, and manage dataset training from an elegant dashboard — no terminal required.
            </p>
            <a href="/signup">
              <Button>Try the Dashboard</Button>
            </a>
          </div>
          <div className="lg:w-1/2">
            <img
              src="/assets/dashboard-screenshot.png"
              alt="APItrain Dashboard Screenshot"
              className="rounded-xl shadow-lg border"
            />
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto text-center px-6">
          <p className="text-sm uppercase text-muted-foreground tracking-wide mb-6">
            Trusted by teams at
          </p>
          <div className="flex justify-center items-center flex-wrap gap-8 grayscale opacity-80">
            <img src="/assets/logos/airbnb.svg" alt="Airbnb" className="h-8" />
            <img src="/assets/logos/google.svg" alt="Google" className="h-8" />
            <img src="/assets/logos/stripe.svg" alt="Stripe" className="h-8" />
            <img src="/assets/logos/vercel.svg" alt="Vercel" className="h-8" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-8">💬 What Our Users Say</h2>
          <blockquote className="bg-white p-6 rounded-lg shadow text-muted-foreground italic">
            "APItrain saved us weeks of ML engineering! We trained, deployed, and shared our model — all in one day."
            <div className="mt-4 text-sm text-gray-500">— Anjali R., Data Scientist</div>
          </blockquote>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-100 to-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to Deploy Your First ML API?</h2>
          <p className="text-muted-foreground mb-6">It’s fast, free, and requires no coding skills.</p>
          <a href="/signup">
            <Button size="lg">Get Started Free</Button>
          </a>
        </div>
      </section>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  desc: string
}

function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition duration-200">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  )
}
