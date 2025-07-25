'use client'

import { useState } from "react"
import PageWrapper from "@/components/page-wrapper"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Filter, Mail, Phone, User } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { toast } from "sonner" // shadcn toast if available
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function InvitePage() {
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    const user = {
        name: "Prathamesh More",
        email: "prathamesh@example.com",
        phone: "+91 9876543210",
        avatarUrl: "https://github.com/shadcn.png",
    }

    const inviteLink = "https://yourapp.com/invite/abc123"

    const inviteList = [
        {
            name: "John Doe",
            email: "john@example.com",
            status: "Pending",
            date: "2025-07-20",
        },
        {
            name: "Jane Smith",
            email: "jane@example.com",
            status: "Accepted",
            date: "2025-07-18",
        },
    ]

    const copyLink = async () => {
        await navigator.clipboard.writeText(inviteLink)
        toast("Copied invite link!")
    }

    return (
        <PageWrapper title="Invite" subtitle="Manage your APIs and their configurations"
            filters={
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <Input
                        readOnly
                        value={inviteLink}
                        className="rounded-none max-w-xs bg-white"
                    />
                    <Button
                        onClick={copyLink}
                        variant="outline"
                        className="rounded-none flex gap-2"
                    >
                        <Copy className="w-4 h-4" />
                        Copy Link
                    </Button>
                </div>
            }
            actions={
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="rounded-none">Send Invite</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm rounded-none">
                        <DialogHeader>
                            <DialogTitle>Send Invite</DialogTitle>
                            <DialogDescription>
                                Enter an email or phone number to send an invitation.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Input placeholder="name@example.com or +919876543210" className="rounded-none" />
                            <Button className="w-full rounded-none">Send</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            }
        >


            {/* Invite Table */}
            <div className="overflow-x-auto border shadow">
                <Table className="bg-white rounded-none">
                    <TableHeader className="">
                        <TableRow>
                            <TableHead className="px-4 py-2 text-left text-muted-foreground">Name</TableHead>
                            <TableHead className="px-4 py-2 text-left text-muted-foreground">Email</TableHead>
                            <TableHead className="px-4 py-2 text-left text-muted-foreground">Status</TableHead>
                            <TableHead className="px-4 py-2 text-left text-muted-foreground">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {inviteList.map((invite, index) => (
                            <TableRow key={index} className="hover:bg-muted/50 border-t">
                                <TableCell className="px-4 py-2">{invite.name}</TableCell>
                                <TableCell className="px-4 py-2">{invite.email}</TableCell>
                                <TableCell className="px-4 py-2">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${invite.status === "Accepted"
                                            ? "text-green-700 bg-green-100"
                                            : "text-yellow-700 bg-yellow-100"
                                            }`}
                                    >
                                        {invite.status}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-2">{invite.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </PageWrapper>
    )
}
