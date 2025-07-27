'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch } from "@/store/hook"
import { inviteMemberSchema } from "@/validation/team-validation"
import type { InviteMemberData } from "@/validation/team-validation"
import PageWrapper from "@/components/page-wrapper"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { 
    Copy, 
    Users, 
    UserPlus, 
    Loader2,
    Mail,
    CheckCircle
} from "lucide-react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function InvitePage() {
    const dispatch = useAppDispatch()
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
    const [inviteLoading, setInviteLoading] = useState(false)

    // Form for inviting members
    const inviteForm = useForm<InviteMemberData>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: "",
            role: "developer",
            message: "",
        },
    })

    const inviteLink = "https://yourapp.com/invite/abc123"

    // Mock data for pending invites
    const pendingInvites = [
        {
            id: 1,
            email: "john@example.com",
            role: "Developer",
            invitedAt: "2025-01-20",
            status: "Pending"
        },
        {
            id: 2,
            email: "jane@example.com",
            role: "Viewer",
            invitedAt: "2025-01-19",
            status: "Pending"
        },
        {
            id: 3,
            email: "mike@example.com",
            role: "Developer",
            invitedAt: "2025-01-18",
            status: "Accepted"
        }
    ]

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink)
            toast.success("Invite link copied to clipboard!")
        } catch (error) {
            toast.error("Failed to copy link")
        }
    }

    const handleInviteSubmit = async (data: InviteMemberData) => {
        setInviteLoading(true)
        try {
            // Mock API call - replace with actual dispatch
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success(`Invitation sent to ${data.email}`)
            inviteForm.reset()
            setInviteDialogOpen(false)
        } catch (error) {
            toast.error("Failed to send invitation")
        } finally {
            setInviteLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Accepted":
                return "text-green-700 bg-green-100"
            case "Pending":
                return "text-yellow-700 bg-yellow-100"
            case "Expired":
                return "text-red-700 bg-red-100"
            default:
                return "text-gray-700 bg-gray-100"
        }
    }

    return (
        <PageWrapper 
            title="Invite Team Members" 
            subtitle="Invite colleagues to join your organization"
            actions={
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center gap-2">
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
                    <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-none flex gap-2">
                                <UserPlus className="w-4 h-4" />
                                Invite Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md rounded-none">
                            <DialogHeader>
                                <DialogTitle>Invite Team Member</DialogTitle>
                                <DialogDescription>
                                    Send an invitation to join your organization.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...inviteForm}>
                                <form onSubmit={inviteForm.handleSubmit(handleInviteSubmit)} className="space-y-4">
                                    <FormField
                                        control={inviteForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="colleague@company.com" {...field} className="rounded-none" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={inviteForm.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Default Role</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-none">
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="developer">
                                                            <div>
                                                                <div className="font-medium">Developer</div>
                                                                <div className="text-xs text-muted-foreground">Can create and manage APIs</div>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="viewer">
                                                            <div>
                                                                <div className="font-medium">Viewer</div>
                                                                <div className="text-xs text-muted-foreground">Read-only access</div>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={inviteForm.control}
                                        name="message"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Personal Message (Optional)</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="Add a personal message to your invitation..."
                                                        {...field} 
                                                        className="rounded-none" 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <Button 
                                            type="submit" 
                                            className="w-full rounded-none"
                                            disabled={inviteLoading}
                                        >
                                            {inviteLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send Invitation"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            }
        >
            {/* Organization Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-6 bg-white border rounded-none">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <h3 className="font-semibold">Total Members</h3>
                    </div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Active team members</p>
                </div>
                <div className="p-6 bg-white border rounded-none">
                    <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-semibold">Pending Invites</h3>
                    </div>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Awaiting response</p>
                </div>
                <div className="p-6 bg-white border rounded-none">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <h3 className="font-semibold">Active APIs</h3>
                    </div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-sm text-muted-foreground">Managed APIs</p>
                </div>
            </div>

            {/* Pending Invites Table */}
            <div className="bg-white border rounded-none">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold">Recent Invitations</h3>
                    <p className="text-sm text-muted-foreground">Track the status of your team invitations</p>
                </div>
                {pendingInvites.length > 0 ? (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-6 py-3 text-left text-muted-foreground">Email</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-muted-foreground">Role</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-muted-foreground">Invited</TableHead>
                                    <TableHead className="px-6 py-3 text-left text-muted-foreground">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingInvites.map((invite) => (
                                    <TableRow key={invite.id} className="hover:bg-muted/50">
                                        <TableCell className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarFallback>{invite.email.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{invite.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className="font-medium">{invite.role}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">{invite.invitedAt}</TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(invite.status)}`}>
                                                {invite.status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No invitations yet</h3>
                        <p className="text-gray-500 mb-4">Start building your team by sending your first invitation</p>
                        <Button 
                            onClick={() => setInviteDialogOpen(true)}
                            className="rounded-none"
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Send First Invite
                        </Button>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 p-6 bg-white border rounded-none">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-none">
                        <h4 className="font-medium mb-2">Bulk Invite</h4>
                        <p className="text-sm text-muted-foreground mb-3">Invite multiple team members at once</p>
                        <Button variant="outline" className="rounded-none">
                            Upload CSV
                        </Button>
                    </div>
                    <div className="p-4 border rounded-none">
                        <h4 className="font-medium mb-2">Team Settings</h4>
                        <p className="text-sm text-muted-foreground mb-3">Configure organization-wide settings</p>
                        <Button variant="outline" className="rounded-none">
                            Manage Settings
                        </Button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
} 