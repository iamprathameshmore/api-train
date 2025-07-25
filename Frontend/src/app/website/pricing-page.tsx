"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import axios from "axios"

// RazorpayModal utility
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const proMonthly = 299
  const proYearly = 2999
  const teamMonthly = 899
  const teamYearly = 9500
  const extraStorageNote = "Includes Cloudflare R2. Additional storage available on request."

  const handleProPayment = async () => {
    setIsLoading(true)
    const amount = isYearly ? proYearly * 100 : proMonthly * 100 // convert to paise

    try {
      const res = await axios.post("http://localhost:8000/payment/order", {
        amount,
        receipt: "rcptid_pro_" + Date.now(),
      })

      const order = res.data

      const isLoaded = await loadRazorpay()
      if (!isLoaded) {
        alert("Failed to load Razorpay SDK")
        return
      }

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Your App",
        description: "Pro Plan Subscription",
        order_id: order.order_id,
        handler: function (response: any) {
          alert("✅ Payment Successful!")
          console.log("Payment Details", response)
          // You can now verify payment via backend if needed
        },
        prefill: {
          name: "Your User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#f472b6", // Tailwind pink-400
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (err) {
      alert("Payment failed to initialize")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
      {/* Title & Billing Toggle */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">💰 Simple & Transparent Pricing</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Build and deploy AI models with flexible plans that scale with your needs.
        </p>

        <div className="flex justify-center items-center gap-2 pt-4">
          <Label className="text-sm">Monthly</Label>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <Label className="text-sm">Yearly <span className="text-green-600">(Save 17%)</span></Label>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Free Plan */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-xl">🧪 Free</CardTitle>
            <p className="text-muted-foreground pt-1">₹0 / forever</p>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>1 active project</li>
              <li>5MB dataset limit</li>
              <li>Projects expire in 7 days</li>
              <li>12 projects/month</li>
              <li>Preview only</li>
            </ul>
            <Button disabled variant="outline" className="w-full mt-4">
              Current Plan
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-primary border-2 shadow rounded-none">
          <CardHeader>
            <CardTitle className="text-xl">🚀 Pro</CardTitle>
            <p className="text-muted-foreground pt-1">
              ₹{isYearly ? proYearly : proMonthly}/{isYearly ? "year" : "month"}
            </p>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>10 active projects</li>
              <li>50MB per model</li>
              <li>10GB R2 storage</li>
              <li>Priority training</li>
              <li>API access & tokens</li>
            </ul>
            <Button
              disabled={isLoading}
              onClick={handleProPayment}
              className="w-full bg-pink-500 hover:bg-black mt-4"
            >
              {isLoading ? "Processing..." : `Buy Pro – ₹${isYearly ? proYearly : proMonthly}`}
            </Button>
          </CardContent>
        </Card>

        {/* Team Plan */}
        <Card className="rounded-none">
          <CardHeader>
            <CardTitle className="text-xl">👥 Team</CardTitle>
            <p className="text-muted-foreground pt-1">₹{isYearly ? teamYearly : teamMonthly}/month</p>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>25 active projects</li>
              <li>20GB R2 quota</li>
              <li>Shared team dashboard</li>
              <li>Team roles & access control</li>
              <li>Email/Discord support</li>
            </ul>
            <Button className="w-full bg-primary mt-4">Contact Sales</Button>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card className="rounded-none bg-muted">
          <CardHeader>
            <CardTitle className="text-xl">🏢 Enterprise</CardTitle>
            <p className="text-muted-foreground pt-1">Custom Pricing</p>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>Dedicated GPU training</li>
              <li>Unlimited storage</li>
              <li>SSO, audit logs</li>
              <li>SLA-backed uptime</li>
              <li>Custom integrations</li>
            </ul>
            <Button variant="outline" className="w-full mt-4">Request Demo</Button>
          </CardContent>
        </Card>
      </div>

      {/* Storage Note */}
      <p className="text-xs text-center text-muted-foreground pt-8 max-w-xl mx-auto">
        {extraStorageNote}
      </p>
    </div>
  )
}
