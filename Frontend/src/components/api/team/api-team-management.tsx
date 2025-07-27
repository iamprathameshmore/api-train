'use client'

import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch, useAppSelector } from "@/store/hook"
import { 
    fetchTeamMembers, 
    inviteTeamMember, 
    removeTeamMember, 
    updateMemberRole,
    clearTeamError 
} from "@/store/slices/team-slice"
import { inviteMemberSchema, editMemberSchema } from "@/validation/team-validation"
import type { InviteMemberData, EditMemberData } from "@/validation/team-validation"
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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
    Shield, 
    Settings, 
    Trash2, 
    Edit, 
    Search,
    AlertTriangle,
    CheckCircle,
    UserPlus,
    Loader2,
    Eye,
    Code,
    Database,
    Key
} from "lucide-react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TeamMember, TeamRole, TeamMemberStatus, Permission, TeamRoleConfig } from "@/types/team-types"

interface ApiTeamManagementProps {
    apiId: string;
    apiName: string;
}

export default function ApiTeamManagement({ apiId, apiName }: ApiTeamManagementProps) {
    const dispatch = useAppDispatch()
    const { members, loading, error, inviteLoading } = useAppSelector(state => state.team)
    
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState("all")
    const [statusFilter, setStatusFilter] = useState("all")
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

    // Form for inviting members
    const inviteForm = useForm<InviteMemberData>({
        resolver: zodResolver(inviteMemberSchema),
        defaultValues: {
            email: "",
            role: "developer",
            message: "",
        },
    })

    // Form for editing members
    const editForm = useForm<EditMemberData>({
        resolver: zodResolver(editMemberSchema),
        defaultValues: {
            role: "developer",
            permissions: ["Read"],
        },
    })

    const inviteLink = `https://yourapp.com/api/${apiId}/team/join/abc123`

    // API-specific roles with granular permissions
    const apiRoles: TeamRoleConfig[] = [
        { 
            value: "admin", 
            label: "API Admin", 
            description: "Full control over this API",
            permissions: ["Read", "Write", "Delete", "Manage Team", "Billing Access", "Deploy", "Monitor"]
        },
        { 
            value: "developer", 
            label: "Developer", 
            description: "Can develop and test the API",
            permissions: ["Read", "Write", "Deploy", "Monitor"]
        },
        { 
            value: "tester", 
            label: "Tester", 
            description: "Can test and monitor the API",
            permissions: ["Read", "Monitor"]
        },
        { 
            value: "viewer", 
            label: "Viewer", 
            description: "Read-only access to API",
            permissions: ["Read"]
        },
    ]

    // Fetch API-specific team members
    useEffect(() => {
        dispatch(fetchTeamMembers()) // This should be modified to fetch API-specific members
    }, [dispatch, apiId])

    // Clear errors when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearTeamError())
        }
    }, [dispatch])

    // Filtered members based on search and filters
    const filteredMembers = useMemo(() => {
        return members.filter(member => {
            const matchesSearch = member.name.toLowerCase().includes(search.toLowerCase()) ||
                                member.email.toLowerCase().includes(search.toLowerCase())
            const matchesRole = roleFilter === "all" || member.role.toLowerCase() === roleFilter
            const matchesStatus = statusFilter === "all" || member.status.toLowerCase() === statusFilter
            
            return matchesSearch && matchesRole && matchesStatus
        })
    }, [members, search, roleFilter, statusFilter])

    // Check if current user is admin
    const isCurrentUserAdmin = useMemo(() => {
        const currentUser = members.find(m => m.email === "prathamesh@example.com") // Replace with actual user email
        return currentUser?.role === "Admin"
    }, [members])

    // Check if user can be removed (not last admin)
    const canRemoveMember = (member: TeamMember) => {
        if (member.role === "Admin") {
            const adminCount = members.filter(m => m.role === "Admin" && m.status === "Active").length
            return adminCount > 1
        }
        return true
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink)
            toast.success("API team invite link copied to clipboard!")
        } catch (error) {
            toast.error("Failed to copy link")
        }
    }

    const handleInviteSubmit = async (data: InviteMemberData) => {
        try {
            await dispatch(inviteTeamMember(data)).unwrap()
            toast.success(`Invitation sent to ${data.email} for ${apiName}`)
            inviteForm.reset()
            setInviteDialogOpen(false)
        } catch (error) {
            toast.error(error as string)
        }
    }

    const handleEditMember = (member: TeamMember) => {
        setSelectedMember(member)
        editForm.reset({
            role: member.role.toLowerCase() as any,
            permissions: member.permissions,
        })
        setEditDialogOpen(true)
    }

    const handleEditSubmit = async (data: EditMemberData) => {
        if (!selectedMember) return
        
        try {
            await dispatch(updateMemberRole({
                memberId: selectedMember.id,
                role: data.role.charAt(0).toUpperCase() + data.role.slice(1) as TeamRole
            })).unwrap()
            toast.success(`Updated ${selectedMember.name}'s role for ${apiName}`)
            setEditDialogOpen(false)
            setSelectedMember(null)
        } catch (error) {
            toast.error(error as string)
        }
    }

    const handleRemoveMember = async (member: TeamMember) => {
        if (!canRemoveMember(member)) {
            toast.error("Cannot remove the last admin from the API team")
            return
        }

        try {
            await dispatch(removeTeamMember(member.id)).unwrap()
            toast.success(`Removed ${member.name} from ${apiName} team`)
        } catch (error) {
            toast.error(error as string)
        }
    }

    const getStatusColor = (status: TeamMemberStatus) => {
        switch (status) {
            case "Active":
                return "text-green-700 bg-green-100"
            case "Pending":
                return "text-yellow-700 bg-yellow-100"
            case "Inactive":
                return "text-red-700 bg-red-100"
            default:
                return "text-gray-700 bg-gray-100"
        }
    }

    const getRoleIcon = (role: TeamRole) => {
        switch (role) {
            case "Admin":
                return <Shield className="w-4 h-4 text-red-500" />
            case "Developer":
                return <Code className="w-4 h-4 text-blue-500" />
            case "Tester":
                return <Eye className="w-4 h-4 text-purple-500" />
            case "Viewer":
                return <Eye className="w-4 h-4 text-gray-500" />
            default:
                return <Shield className="w-4 h-4 text-gray-500" />
        }
    }

    const getPermissionIcon = (permission: Permission) => {
        switch (permission) {
            case "Read":
                return <Eye className="w-3 h-3" />
            case "Write":
                return <Code className="w-3 h-3" />
            case "Delete":
                return <Trash2 className="w-3 h-3" />
            case "Deploy":
                return <Database className="w-3 h-3" />
            case "Monitor":
                return <Key className="w-3 h-3" />
            default:
                return <Shield className="w-3 h-3" />
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading API team members...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Team Management</h2>
                    <p className="text-muted-foreground">Manage team members for {apiName}</p>
                </div>
                <div className="flex gap-2">
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
                            <Button className="rounded-none flex gap-2" disabled={!isCurrentUserAdmin}>
                                <UserPlus className="w-4 h-4" />
                                Invite to API
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md rounded-none">
                            <DialogHeader>
                                <DialogTitle>Invite to {apiName}</DialogTitle>
                                <DialogDescription>
                                    Add a team member to work on this specific API.
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
                                                <FormLabel>API Role</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-none">
                                                            <SelectValue placeholder="Select role" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {apiRoles.map((role) => (
                                                            <SelectItem key={role.value} value={role.value}>
                                                                <div>
                                                                    <div className="font-medium">{role.label}</div>
                                                                    <div className="text-xs text-muted-foreground">{role.description}</div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
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
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-none">
                    <div className="flex items-center gap-2 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search team members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-none max-w-xs bg-white pl-10"
                    />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[150px] bg-white rounded-none">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">API Admin</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="tester">Tester</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] bg-white rounded-none">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Team Members Table */}
            {filteredMembers.length > 0 ? (
                <div className="overflow-x-auto border shadow">
                    <Table className="bg-white rounded-none">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="px-4 py-2 text-left text-muted-foreground">Member</TableHead>
                                <TableHead className="px-4 py-2 text-left text-muted-foreground">Role</TableHead>
                                <TableHead className="px-4 py-2 text-left text-muted-foreground">Permissions</TableHead>
                                <TableHead className="px-4 py-2 text-left text-muted-foreground">Status</TableHead>
                                <TableHead className="px-4 py-2 text-left text-muted-foreground">Joined</TableHead>
                                <TableHead className="px-4 py-2 text-left text-muted-foreground">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMembers.map((member) => (
                                <TableRow key={member.id} className="hover:bg-muted/50 border-t">
                                    <TableCell className="px-4 py-2">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={member.avatarUrl} />
                                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{member.name}</div>
                                                <div className="text-sm text-muted-foreground">{member.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            {getRoleIcon(member.role)}
                                            <span className="font-medium">{member.role}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        <div className="flex flex-wrap gap-1">
                                            {member.permissions.map((permission) => (
                                                <span
                                                    key={permission}
                                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                                                >
                                                    {getPermissionIcon(permission)}
                                                    {permission}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(member.status)}`}>
                                            {member.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-2">{member.date}</TableCell>
                                    <TableCell className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            {isCurrentUserAdmin && (
                                                <>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditMember(member)}
                                                        className="h-8 w-8 p-0 rounded-none"
                                                        disabled={member.email === "prathamesh@example.com"}
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 rounded-none text-red-600 hover:text-red-700"
                                                                disabled={!canRemoveMember(member) || member.email === "prathamesh@example.com"}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="rounded-none">
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Remove from API Team</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to remove {member.name} from the {apiName} team? 
                                                                    This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
                                                                <AlertDialogAction 
                                                                    onClick={() => handleRemoveMember(member)}
                                                                    className="rounded-none bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Remove
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                    <p className="text-gray-500 mb-4">
                        {search || roleFilter !== "all" || statusFilter !== "all" 
                            ? "Try adjusting your search or filters"
                            : "Get started by inviting team members to work on this API"
                        }
                    </p>
                    {!search && roleFilter === "all" && statusFilter === "all" && (
                        <Button 
                            onClick={() => setInviteDialogOpen(true)}
                            className="rounded-none"
                            disabled={!isCurrentUserAdmin}
                        >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invite First Member
                        </Button>
                    )}
                </div>
            )}

            {/* Edit Member Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="max-w-md rounded-none">
                    <DialogHeader>
                        <DialogTitle>Edit API Team Member</DialogTitle>
                        <DialogDescription>
                            Update {selectedMember?.name}'s role and permissions for {apiName}.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
                            <FormField
                                control={editForm.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>API Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="rounded-none">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {apiRoles.map((role) => (
                                                    <SelectItem key={role.value} value={role.value}>
                                                        <div>
                                                            <div className="font-medium">{role.label}</div>
                                                            <div className="text-xs text-muted-foreground">{role.description}</div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button 
                                    type="submit" 
                                    className="w-full rounded-none"
                                >
                                    Update Member
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* API Team Statistics */}
            <div className="mt-8 p-6 bg-white border rounded-none">
                <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-5 h-5" />
                    <h3 className="text-lg font-semibold">API Team Statistics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h4 className="font-medium mb-2">Team Members</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div>Total Members: {members.length}</div>
                            <div>Active Members: {members.filter(m => m.status === "Active").length}</div>
                            <div>Pending Invites: {members.filter(m => m.status === "Pending").length}</div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">Role Distribution</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-red-500" />
                                Admins: {members.filter(m => m.role === "Admin").length}
                            </div>
                            <div className="flex items-center gap-2">
                                <Code className="w-4 h-4 text-blue-500" />
                                Developers: {members.filter(m => m.role === "Developer").length}
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-purple-500" />
                                Testers: {members.filter(m => m.role === "Tester").length}
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-gray-500" />
                                Viewers: {members.filter(m => m.role === "Viewer").length}
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-medium mb-2">API Permissions</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Read Access: {members.filter(m => m.permissions.includes("Read")).length}
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Write Access: {members.filter(m => m.permissions.includes("Write")).length}
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Deploy Access: {members.filter(m => m.permissions.includes("Deploy")).length}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 