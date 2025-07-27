'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import PageWrapper from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
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
    User, 
    Shield, 
    Bell, 
    Settings, 
    Globe, 
    Eye,
    EyeOff,
    Mail,
    Phone,
    MapPin, 
    Camera, 
    Save,
    Trash2,
    Download,
    Upload,
    Lock,
    Unlock,
    CheckCircle,
    AlertTriangle,
    Clock,
    Database,
    Zap,
    Palette,
    Languages,
    Monitor,
    Smartphone,
    Tablet,
    Laptop,
    Moon,
    Sun,
    Monitor as MonitorIcon
} from "lucide-react"
import { toast } from "sonner"

// Validation schemas
const profileSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    company: z.string().optional(),
    position: z.string().optional(),
    timezone: z.string(),
    language: z.string(),
})

const securitySchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    twoFactorEnabled: z.boolean(),
    sessionTimeout: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

const notificationSchema = z.object({
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    apiAlerts: z.boolean(),
    teamUpdates: z.boolean(),
    billingAlerts: z.boolean(),
    securityAlerts: z.boolean(),
    marketingEmails: z.boolean(),
    digestFrequency: z.string(),
})

const apiSettingsSchema = z.object({
    defaultEnvironment: z.string(),
    requestTimeout: z.string(),
    rateLimitEnabled: z.boolean(),
    rateLimitRequests: z.string(),
    rateLimitWindow: z.string(),
    loggingEnabled: z.boolean(),
    logRetentionDays: z.string(),
    corsEnabled: z.boolean(),
    corsOrigins: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>
type SecurityFormData = z.infer<typeof securitySchema>
type NotificationFormData = z.infer<typeof notificationSchema>
type ApiSettingsFormData = z.infer<typeof apiSettingsSchema>

export default function SettingPage() {
    const [activeTab, setActiveTab] = useState("profile")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)

    // Mock user data
    const user = {
        name: "Prathamesh More",
        email: "prathamesh@example.com",
        avatar: "https://i.pravatar.cc/150?img=12",
        plan: "Pro",
        status: "Active",
        lastLogin: "2 hours ago",
        memberSince: "January 2024"
    }

    // Form instances
    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: "Prathamesh",
            lastName: "More",
            email: "prathamesh@example.com",
            phone: "+91 9876543210",
            company: "TechCorp",
            position: "Senior Developer",
            timezone: "Asia/Kolkata",
            language: "en",
        },
    })

    const securityForm = useForm<SecurityFormData>({
        resolver: zodResolver(securitySchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            twoFactorEnabled: true,
            sessionTimeout: "24",
        },
    })

    const notificationForm = useForm<NotificationFormData>({
        resolver: zodResolver(notificationSchema),
        defaultValues: {
            emailNotifications: true,
            pushNotifications: true,
            apiAlerts: true,
            teamUpdates: true,
            billingAlerts: true,
            securityAlerts: true,
            marketingEmails: false,
            digestFrequency: "daily",
        },
    })

    const apiSettingsForm = useForm<ApiSettingsFormData>({
        resolver: zodResolver(apiSettingsSchema),
        defaultValues: {
            defaultEnvironment: "production",
            requestTimeout: "30",
            rateLimitEnabled: true,
            rateLimitRequests: "1000",
            rateLimitWindow: "3600",
            loggingEnabled: true,
            logRetentionDays: "30",
            corsEnabled: true,
            corsOrigins: "*",
        },
    })

    const handleProfileSubmit = async (data: ProfileFormData) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Profile updated successfully!")
        } catch (error) {
            toast.error("Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSecuritySubmit = async (data: SecurityFormData) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Security settings updated successfully!")
            securityForm.reset()
        } catch (error) {
            toast.error("Failed to update security settings")
        } finally {
            setIsLoading(false)
        }
    }

    const handleNotificationSubmit = async (data: NotificationFormData) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Notification preferences updated!")
        } catch (error) {
            toast.error("Failed to update notification preferences")
        } finally {
            setIsLoading(false)
        }
    }

    const handleApiSettingsSubmit = async (data: ApiSettingsFormData) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("API settings updated successfully!")
        } catch (error) {
            toast.error("Failed to update API settings")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setAvatarFile(file)
            toast.success("Avatar updated! Click save to apply changes.")
        }
    }

    const handleExportData = async () => {
        setIsLoading(true)
        try {
            // Simulate export
            await new Promise(resolve => setTimeout(resolve, 2000))
            toast.success("Data exported successfully!")
        } catch (error) {
            toast.error("Failed to export data")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAccount = async () => {
        setIsLoading(true)
        try {
            // Simulate deletion
            await new Promise(resolve => setTimeout(resolve, 2000))
            toast.success("Account deleted successfully!")
        } catch (error) {
            toast.error("Failed to delete account")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PageWrapper
            title="Settings"
            subtitle="Manage your account, security, and preferences"
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-none" onClick={handleExportData} disabled={isLoading}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                    </Button>
                    <Button className="rounded-none" disabled={isLoading}>
                        <Save className="w-4 h-4 mr-2" />
                        Save All Changes
                    </Button>
                </div>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* User Profile Card */}
                <div className="lg:col-span-1">
                    <Card className="rounded-none">
                        <CardHeader className="text-center">
                            <div className="relative mx-auto w-24 h-24">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="text-2xl">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <label className="absolute bottom-0 right-0 bg-black text-white p-1 rounded-full cursor-pointer">
                                    <Camera className="w-4 h-4" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <Badge className="mt-2" variant="secondary">{user.plan}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant="outline" className="text-green-600 bg-green-50">
                                    {user.status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Last Login</span>
                                <span>{user.lastLogin}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Member Since</span>
                                <span>{user.memberSince}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Settings Tabs */}
                <div className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid w-full grid-cols-5 rounded-none">
                            <TabsTrigger value="profile" className="rounded-none flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="security" className="rounded-none flex items-center gap-2">
                                <Shield className="w-4 h-4" />
                                Security
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="rounded-none flex items-center gap-2">
                                <Bell className="w-4 h-4" />
                                Notifications
                            </TabsTrigger>
                            <TabsTrigger value="api" className="rounded-none flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                API Settings
                            </TabsTrigger>
                            <TabsTrigger value="advanced" className="rounded-none flex items-center gap-2">
                                <Settings className="w-4 h-4" />
                                Advanced
                            </TabsTrigger>
                        </TabsList>

                        {/* Profile Settings */}
                        <TabsContent value="profile" className="space-y-6">
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Profile Information</CardTitle>
                                    <CardDescription>Update your personal information and preferences</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...profileForm}>
                                        <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={profileForm.control}
                                                    name="firstName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>First Name</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={profileForm.control}
                                                    name="lastName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Last Name</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={profileForm.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email Address</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} type="email" className="rounded-none" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={profileForm.control}
                                                    name="phone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone Number</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={profileForm.control}
                                                    name="company"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Company</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={profileForm.control}
                                                    name="timezone"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Timezone</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-none">
                                                                        <SelectValue placeholder="Select timezone" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                                                                    <SelectItem value="UTC">UTC</SelectItem>
                                                                    <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                                                                    <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={profileForm.control}
                                                    name="language"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Language</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-none">
                                                                        <SelectValue placeholder="Select language" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="en">English</SelectItem>
                                                                    <SelectItem value="es">Spanish</SelectItem>
                                                                    <SelectItem value="fr">French</SelectItem>
                                                                    <SelectItem value="de">German</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <Button type="submit" className="rounded-none" disabled={isLoading}>
                                                {isLoading ? "Updating..." : "Update Profile"}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security Settings */}
                        <TabsContent value="security" className="space-y-6">
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Security Settings</CardTitle>
                                    <CardDescription>Manage your password and security preferences</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...securityForm}>
                                        <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-6">
                                            <FormField
                                                control={securityForm.control}
                                                name="currentPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Current Password</FormLabel>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input 
                                                                    {...field} 
                                                                    type={showPassword ? "text" : "password"} 
                                                                    className="rounded-none pr-10" 
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                                    onClick={() => setShowPassword(!showPassword)}
                                                                >
                                                                    {showPassword ? (
                                                                        <EyeOff className="h-4 w-4" />
                                                                    ) : (
                                                                        <Eye className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={securityForm.control}
                                                    name="newPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>New Password</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} type="password" className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={securityForm.control}
                                                    name="confirmPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Confirm New Password</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} type="password" className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={securityForm.control}
                                                name="twoFactorEnabled"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                                                            <FormDescription>
                                                                Add an extra layer of security to your account
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={securityForm.control}
                                                name="sessionTimeout"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Session Timeout</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-none">
                                                                    <SelectValue placeholder="Select timeout" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="1">1 hour</SelectItem>
                                                                <SelectItem value="8">8 hours</SelectItem>
                                                                <SelectItem value="24">24 hours</SelectItem>
                                                                <SelectItem value="168">1 week</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type="submit" className="rounded-none" disabled={isLoading}>
                                                {isLoading ? "Updating..." : "Update Security Settings"}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>

                            {/* Security Activity */}
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Recent Security Activity</CardTitle>
                                    <CardDescription>Monitor your account security events</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-3 border rounded-none">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                                <div>
                                                    <p className="font-medium">Successful login</p>
                                                    <p className="text-sm text-muted-foreground">Mumbai, India • 2 hours ago</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">Login</Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 border rounded-none">
                                            <div className="flex items-center gap-3">
                                                <Shield className="w-5 h-5 text-blue-500" />
                                                <div>
                                                    <p className="font-medium">Password changed</p>
                                                    <p className="text-sm text-muted-foreground">1 week ago</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">Password</Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Notification Settings */}
                        <TabsContent value="notifications" className="space-y-6">
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Notification Preferences</CardTitle>
                                    <CardDescription>Choose how and when you want to be notified</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...notificationForm}>
                                        <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)} className="space-y-6">
                                            <div className="space-y-4">
                                                <FormField
                                                    control={notificationForm.control}
                                                    name="emailNotifications"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-base">Email Notifications</FormLabel>
                                                                <FormDescription>
                                                                    Receive notifications via email
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={notificationForm.control}
                                                    name="pushNotifications"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-base">Push Notifications</FormLabel>
                                                                <FormDescription>
                                                                    Receive push notifications in your browser
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={notificationForm.control}
                                                    name="apiAlerts"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-base">API Alerts</FormLabel>
                                                                <FormDescription>
                                                                    Get notified about API performance issues
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={notificationForm.control}
                                                    name="teamUpdates"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-base">Team Updates</FormLabel>
                                                                <FormDescription>
                                                                    Notifications about team member changes
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={notificationForm.control}
                                                    name="billingAlerts"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-base">Billing Alerts</FormLabel>
                                                                <FormDescription>
                                                                    Important billing and payment notifications
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={notificationForm.control}
                                                    name="securityAlerts"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-base">Security Alerts</FormLabel>
                                                                <FormDescription>
                                                                    Critical security notifications
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={notificationForm.control}
                                                    name="marketingEmails"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                            <div className="space-y-0.5">
                                                                <FormLabel className="text-base">Marketing Emails</FormLabel>
                                                                <FormDescription>
                                                                    Product updates and promotional content
                                                                </FormDescription>
                                                            </div>
                                                            <FormControl>
                                                                <Switch
                                                                    checked={field.value}
                                                                    onCheckedChange={field.onChange}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={notificationForm.control}
                                                name="digestFrequency"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Digest Frequency</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-none">
                                                                    <SelectValue placeholder="Select frequency" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="realtime">Real-time</SelectItem>
                                                                <SelectItem value="hourly">Hourly</SelectItem>
                                                                <SelectItem value="daily">Daily</SelectItem>
                                                                <SelectItem value="weekly">Weekly</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type="submit" className="rounded-none" disabled={isLoading}>
                                                {isLoading ? "Updating..." : "Update Notification Preferences"}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* API Settings */}
                        <TabsContent value="api" className="space-y-6">
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>API Configuration</CardTitle>
                                    <CardDescription>Configure default settings for your APIs</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Form {...apiSettingsForm}>
                                        <form onSubmit={apiSettingsForm.handleSubmit(handleApiSettingsSubmit)} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <FormField
                                                    control={apiSettingsForm.control}
                                                    name="defaultEnvironment"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Default Environment</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-none">
                                                                        <SelectValue placeholder="Select environment" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="development">Development</SelectItem>
                                                                    <SelectItem value="staging">Staging</SelectItem>
                                                                    <SelectItem value="production">Production</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={apiSettingsForm.control}
                                                    name="requestTimeout"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Request Timeout (seconds)</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} type="number" className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={apiSettingsForm.control}
                                                name="rateLimitEnabled"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">Rate Limiting</FormLabel>
                                                            <FormDescription>
                                                                Enable rate limiting for API requests
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {apiSettingsForm.watch("rateLimitEnabled") && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <FormField
                                                        control={apiSettingsForm.control}
                                                        name="rateLimitRequests"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Rate Limit Requests</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} type="number" className="rounded-none" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={apiSettingsForm.control}
                                                        name="rateLimitWindow"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Rate Limit Window (seconds)</FormLabel>
                                                                <FormControl>
                                                                    <Input {...field} type="number" className="rounded-none" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                            )}

                                            <FormField
                                                control={apiSettingsForm.control}
                                                name="loggingEnabled"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">Request Logging</FormLabel>
                                                            <FormDescription>
                                                                Log all API requests for debugging
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {apiSettingsForm.watch("loggingEnabled") && (
                                                <FormField
                                                    control={apiSettingsForm.control}
                                                    name="logRetentionDays"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Log Retention (days)</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} type="number" className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}

                                            <FormField
                                                control={apiSettingsForm.control}
                                                name="corsEnabled"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                        <div className="space-y-0.5">
                                                            <FormLabel className="text-base">CORS Support</FormLabel>
                                                            <FormDescription>
                                                                Enable Cross-Origin Resource Sharing
                                                            </FormDescription>
                                                        </div>
                                                        <FormControl>
                                                            <Switch
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />

                                            {apiSettingsForm.watch("corsEnabled") && (
                                                <FormField
                                                    control={apiSettingsForm.control}
                                                    name="corsOrigins"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>CORS Origins</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="*" className="rounded-none" />
                                                            </FormControl>
                                                            <FormDescription>
                                                                Comma-separated list of allowed origins
                                                            </FormDescription>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            )}

                                            <Button type="submit" className="rounded-none" disabled={isLoading}>
                                                {isLoading ? "Updating..." : "Update API Settings"}
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Advanced Settings */}
                        <TabsContent value="advanced" className="space-y-6">
                            {/* Data Management */}
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Data Management</CardTitle>
                                    <CardDescription>Manage your data and account</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-none">
                                        <div>
                                            <h4 className="font-medium">Export Data</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Download all your data in JSON format
                                            </p>
                                        </div>
                                        <Button variant="outline" className="rounded-none" onClick={handleExportData} disabled={isLoading}>
                                            <Download className="w-4 h-4 mr-2" />
                                            Export
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-none">
                                        <div>
                                            <h4 className="font-medium">Delete Account</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Permanently delete your account and all data
                                            </p>
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" className="rounded-none">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Account
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="rounded-none">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your
                                                        account and remove all your data from our servers.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
                                                    <AlertDialogAction 
                                                        onClick={handleDeleteAccount}
                                                        className="rounded-none bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete Account
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Theme Settings */}
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Appearance</CardTitle>
                                    <CardDescription>Customize the look and feel of the application</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-none">
                                        <div className="flex items-center gap-3">
                                            <Sun className="w-5 h-5" />
                                            <div>
                                                <h4 className="font-medium">Light Mode</h4>
                                                <p className="text-sm text-muted-foreground">Use light theme</p>
                                            </div>
                                        </div>
                                        <Switch />
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-none">
                                        <div className="flex items-center gap-3">
                                            <Moon className="w-5 h-5" />
                                            <div>
                                                <h4 className="font-medium">Dark Mode</h4>
                                                <p className="text-sm text-muted-foreground">Use dark theme</p>
                                            </div>
                                        </div>
                                        <Switch />
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-none">
                                        <div className="flex items-center gap-3">
                                            <MonitorIcon className="w-5 h-5" />
                                            <div>
                                                <h4 className="font-medium">System Default</h4>
                                                <p className="text-sm text-muted-foreground">Follow system preference</p>
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Developer Settings */}
                            <Card className="rounded-none">
                                <CardHeader>
                                    <CardTitle>Developer Settings</CardTitle>
                                    <CardDescription>Advanced settings for developers</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-none">
                                        <div>
                                            <h4 className="font-medium">Debug Mode</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Enable additional logging and debugging information
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>

                                    <div className="flex items-center justify-between p-4 border rounded-none">
                                        <div>
                                            <h4 className="font-medium">API Version</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Current API version: v1.0.0
                                            </p>
                                        </div>
                                        <Badge variant="outline">v1.0.0</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </PageWrapper>
    )
}
