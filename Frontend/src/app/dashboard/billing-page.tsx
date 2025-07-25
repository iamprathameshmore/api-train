'use client'

import { useState } from "react"
import PageWrapper from "@/components/page-wrapper"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"

export default function BillingPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const invoices = [
    {
      id: "INV-001",
      date: "2025-07-01",
      amount: "₹499",
      status: "Paid",
      method: "Card",
    },
    {
      id: "INV-002",
      date: "2025-06-01",
      amount: "₹499",
      status: "Paid",
      method: "UPI",
    },
    {
      id: "INV-003",
      date: "2025-05-01",
      amount: "₹499",
      status: "Failed",
      method: "Card",
    },
  ]

  return (
    <PageWrapper
      title="Billing"
      subtitle="Manage your subscription and invoice history"
    >
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id} className="hover:bg-muted/50">
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      invoice.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {invoice.status}
                  </span>
                </TableCell>
                <TableCell>{invoice.method}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PageWrapper>
  )
}
