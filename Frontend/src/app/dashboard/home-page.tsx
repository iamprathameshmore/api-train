'use client'

import { useState } from "react"
import PageWrapper from "@/components/page-wrapper"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BadgeCheck, CreditCard, Calendar, Receipt } from "lucide-react"

export default function HomePage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const transactions = [
    { id: "INV-001", date: "2025-07-01", amount: "₹499", status: "Paid" },
    { id: "INV-002", date: "2025-06-01", amount: "₹499", status: "Paid" },
    { id: "INV-003", date: "2025-05-01", amount: "₹499", status: "Failed" },
  ]

  return (
    <PageWrapper title="Overview" subtitle="Welcome back, Check you status">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        <Card className="rounded-none">
          <CardHeader className="pb-2">
            <CardDescription>Total Invoices</CardDescription>
            <CardTitle className="text-2xl">₹1,497</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm flex items-center gap-2">
            <Receipt className="w-4 h-4" /> 3 invoices
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader className="pb-2">
            <CardDescription>Current Plan</CardDescription>
            <CardTitle className="text-2xl">Pro</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-green-600" /> Active
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader className="pb-2">
            <CardDescription>Billing Cycle</CardDescription>
            <CardTitle className="text-2xl">Monthly</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Renews every 1st
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader className="pb-2">
            <CardDescription>Upcoming Payment</CardDescription>
            <CardTitle className="text-2xl">₹499</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Aug 1, 2025
          </CardContent>
        </Card>
      </div>

     
    </PageWrapper>
  )
}
