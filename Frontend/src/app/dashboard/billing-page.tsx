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
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
    CreditCard, 
    Download, 
    Upload, 
    Settings, 
    Globe, 
    Zap,
    Database,
    Shield,
    CheckCircle,
    AlertTriangle,
    Clock,
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Activity,
    Code,
    Key,
    Lock,
    Unlock,
    Plus,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Calendar,
    DollarSign,
    Receipt,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    ExternalLink,
    Copy,
    Mail,
    Bell,
    Star,
    Crown,
    Sparkles
} from "lucide-react"
import { toast } from "sonner"

// Validation schemas
const paymentMethodSchema = z.object({
    cardNumber: z.string().min(16, "Card number must be 16 digits"),
    expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Invalid expiry date format"),
    cvv: z.string().min(3, "CVV must be 3 digits"),
    cardholderName: z.string().min(2, "Cardholder name is required"),
})

const integrationSchema = z.object({
    webhookUrl: z.string().url("Please enter a valid URL"),
    apiKey: z.string().min(1, "API key is required"),
    environment: z.string(),
    autoSync: z.boolean(),
    retryAttempts: z.string(),
})

type PaymentMethodData = z.infer<typeof paymentMethodSchema>
type IntegrationData = z.infer<typeof integrationSchema>

export default function BillingPage() {
    const [activeTab, setActiveTab] = useState("overview")
    const [isLoading, setIsLoading] = useState(false)
    const [showApiKey, setShowApiKey] = useState(false)

    // Mock data
    const subscription = {
        plan: "Pro",
        status: "Active",
        nextBilling: "2024-02-01",
        amount: "₹499",
        currency: "INR",
        features: [
            "Unlimited APIs",
            "Advanced Analytics",
            "Priority Support",
            "Team Collaboration",
            "Custom Integrations"
        ]
    }

    const usage = {
        apiCalls: 1250000,
        apiCallsLimit: 2000000,
        storage: 45.2,
        storageLimit: 100,
        teamMembers: 8,
        teamMembersLimit: 15,
        integrations: 12,
        integrationsLimit: 20
    }

    const paymentMethods = [
        {
            id: 1,
            type: "card",
            last4: "4242",
            brand: "Visa",
            expiry: "12/25",
            isDefault: true
        },
        {
            id: 2,
            type: "card",
            last4: "8888",
            brand: "Mastercard",
            expiry: "08/26",
            isDefault: false
        }
    ]

    const invoices = [
        {
            id: "INV-001",
            date: "2024-01-01",
            amount: "₹499",
            status: "Paid",
            method: "Visa •••• 4242",
            downloadUrl: "#"
        },
        {
            id: "INV-002",
            date: "2023-12-01",
            amount: "₹499",
            status: "Paid",
            method: "Visa •••• 4242",
            downloadUrl: "#"
        },
        {
            id: "INV-003",
            date: "2023-11-01",
            amount: "₹499",
            status: "Failed",
            method: "UPI",
            downloadUrl: "#"
        }
    ]

    const integrations = [
        {
            id: 1,
            name: "Slack",
            type: "webhook",
            status: "active",
            lastSync: "2 hours ago",
            icon: "💬"
        },
        {
            id: 2,
            name: "Discord",
            type: "webhook",
            status: "active",
            lastSync: "1 day ago",
            icon: "🎮"
        },
        {
            id: 3,
            name: "Email",
            type: "email",
            status: "inactive",
            lastSync: "Never",
            icon: "📧"
        }
    ]

    // Form instances
    const paymentForm = useForm<PaymentMethodData>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            cardholderName: "",
        },
    })

    const integrationForm = useForm<IntegrationData>({
        resolver: zodResolver(integrationSchema),
        defaultValues: {
            webhookUrl: "",
            apiKey: "",
            environment: "production",
            autoSync: true,
            retryAttempts: "3",
        },
    })

    const handlePaymentSubmit = async (data: PaymentMethodData) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Payment method added successfully!")
            paymentForm.reset()
        } catch (error) {
            toast.error("Failed to add payment method")
        } finally {
            setIsLoading(false)
        }
    }

    const handleIntegrationSubmit = async (data: IntegrationData) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success("Integration configured successfully!")
            integrationForm.reset()
        } catch (error) {
            toast.error("Failed to configure integration")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownloadInvoice = async (invoiceId: string) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success(`Invoice ${invoiceId} downloaded successfully!`)
        } catch (error) {
            toast.error("Failed to download invoice")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopyApiKey = async () => {
        try {
            await navigator.clipboard.writeText("sk_test_1234567890abcdef")
            toast.success("API key copied to clipboard!")
        } catch (error) {
            toast.error("Failed to copy API key")
        }
    }

    const getUsagePercentage = (current: number, limit: number) => {
        return Math.round((current / limit) * 100)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "text-green-700 bg-green-100"
            case "inactive":
                return "text-gray-700 bg-gray-100"
            case "error":
                return "text-red-700 bg-red-100"
            default:
                return "text-gray-700 bg-gray-100"
        }
    }

    return (
        <PageWrapper
            title="Integration & Billing"
            subtitle="Manage your subscription, payments, and integrations"
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-none">
                        <Download className="w-4 h-4 mr-2" />
                        Export Data
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="rounded-none">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Integration
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md rounded-none">
                            <DialogHeader>
                                <DialogTitle>Add New Integration</DialogTitle>
                                <DialogDescription>
                                    Configure a new integration for your APIs
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...integrationForm}>
                                <form onSubmit={integrationForm.handleSubmit(handleIntegrationSubmit)} className="space-y-4">
                                    <FormField
                                        control={integrationForm.control}
                                        name="webhookUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Webhook URL</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://your-app.com/webhook" {...field} className="rounded-none" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={integrationForm.control}
                                        name="apiKey"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>API Key</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input 
                                                            {...field} 
                                                            type={showApiKey ? "text" : "password"}
                                                            placeholder="Enter API key"
                                                            className="rounded-none pr-10" 
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                            onClick={() => setShowApiKey(!showApiKey)}
                                                        >
                                                            {showApiKey ? (
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
                                    <DialogFooter>
                                        <Button type="submit" className="rounded-none w-full" disabled={isLoading}>
                                            {isLoading ? "Adding..." : "Add Integration"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            }
        >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 rounded-none">
                    <TabsTrigger value="overview" className="rounded-none flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="rounded-none flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Billing
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="rounded-none flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Integrations
                    </TabsTrigger>
                    <TabsTrigger value="usage" className="rounded-none flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Usage
                    </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* Subscription Status */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
                                <Crown className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{subscription.plan}</div>
                                <p className="text-xs text-muted-foreground">
                                    {subscription.amount}/month
                                </p>
                                <Badge className="mt-2" variant="secondary">{subscription.status}</Badge>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{subscription.nextBilling}</div>
                                <p className="text-xs text-muted-foreground">
                                    Auto-renewal enabled
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
                                <Globe className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{integrations.filter(i => i.status === 'active').length}</div>
                                <p className="text-xs text-muted-foreground">
                                    of {integrations.length} total
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Usage Overview */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Usage Overview</CardTitle>
                            <CardDescription>Current usage across all services</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>API Calls</Label>
                                        <span className="text-sm text-muted-foreground">
                                            {usage.apiCalls.toLocaleString()} / {usage.apiCallsLimit.toLocaleString()}
                                        </span>
                                    </div>
                                    <Progress value={getUsagePercentage(usage.apiCalls, usage.apiCallsLimit)} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>Storage</Label>
                                        <span className="text-sm text-muted-foreground">
                                            {usage.storage}GB / {usage.storageLimit}GB
                                        </span>
                                    </div>
                                    <Progress value={getUsagePercentage(usage.storage, usage.storageLimit)} className="h-2" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>Team Members</Label>
                                        <span className="text-sm text-muted-foreground">
                                            {usage.teamMembers} / {usage.teamMembersLimit}
                                        </span>
                                    </div>
                                    <Progress value={getUsagePercentage(usage.teamMembers, usage.teamMembersLimit)} className="h-2" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <Label>Integrations</Label>
                                        <span className="text-sm text-muted-foreground">
                                            {usage.integrations} / {usage.integrationsLimit}
                                        </span>
                                    </div>
                                    <Progress value={getUsagePercentage(usage.integrations, usage.integrationsLimit)} className="h-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Plan Features */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Plan Features</CardTitle>
                            <CardDescription>What's included in your {subscription.plan} plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {subscription.features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing" className="space-y-6">
                    {/* Payment Methods */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Payment Methods</CardTitle>
                                    <CardDescription>Manage your payment methods and billing information</CardDescription>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="rounded-none">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Payment Method
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md rounded-none">
                                        <DialogHeader>
                                            <DialogTitle>Add Payment Method</DialogTitle>
                                            <DialogDescription>
                                                Add a new credit or debit card
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form {...paymentForm}>
                                            <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-4">
                                                <FormField
                                                    control={paymentForm.control}
                                                    name="cardNumber"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Card Number</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="1234 5678 9012 3456" {...field} className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={paymentForm.control}
                                                        name="expiryDate"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Expiry Date</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="MM/YY" {...field} className="rounded-none" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={paymentForm.control}
                                                        name="cvv"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>CVV</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="123" {...field} className="rounded-none" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
                                                <FormField
                                                    control={paymentForm.control}
                                                    name="cardholderName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Cardholder Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="John Doe" {...field} className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <DialogFooter>
                                                    <Button type="submit" className="rounded-none w-full" disabled={isLoading}>
                                                        {isLoading ? "Adding..." : "Add Payment Method"}
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {paymentMethods.map((method) => (
                                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-none">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-5 h-5" />
                                            <div>
                                                <p className="font-medium">{method.brand} •••• {method.last4}</p>
                                                <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {method.isDefault && (
                                                <Badge variant="secondary">Default</Badge>
                                            )}
                                            <Button variant="ghost" size="sm" className="rounded-none">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="rounded-none text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Billing History */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Billing History</CardTitle>
                            <CardDescription>Your recent invoices and payments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {invoices.map((invoice) => (
                                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-none">
                                        <div className="flex items-center gap-3">
                                            <Receipt className="w-5 h-5" />
                                            <div>
                                                <p className="font-medium">{invoice.id}</p>
                                                <p className="text-sm text-muted-foreground">{invoice.date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="font-medium">{invoice.amount}</p>
                                                <p className="text-sm text-muted-foreground">{invoice.method}</p>
                                            </div>
                                            <Badge 
                                                variant={invoice.status === "Paid" ? "default" : "destructive"}
                                                className="rounded-none"
                                            >
                                                {invoice.status}
                                            </Badge>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="rounded-none"
                                                onClick={() => handleDownloadInvoice(invoice.id)}
                                                disabled={isLoading}
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Integrations Tab */}
                <TabsContent value="integrations" className="space-y-6">
                    {/* API Keys */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>API Keys</CardTitle>
                            <CardDescription>Manage your API keys for integrations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-none">
                                    <div className="flex items-center gap-3">
                                        <Key className="w-5 h-5" />
                                        <div>
                                            <p className="font-medium">Production API Key</p>
                                            <p className="text-sm text-muted-foreground">Used for live applications</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-none">
                                            <span className="text-sm font-mono">
                                                {showApiKey ? "sk_test_1234567890abcdef" : "sk_test_••••••••••••••••"}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setShowApiKey(!showApiKey)}
                                                className="h-6 w-6 p-0"
                                            >
                                                {showApiKey ? (
                                                    <EyeOff className="w-3 h-3" />
                                                ) : (
                                                    <Eye className="w-3 h-3" />
                                                )}
                                            </Button>
                                        </div>
                                        <Button variant="outline" size="sm" className="rounded-none" onClick={handleCopyApiKey}>
                                            <Copy className="w-4 h-4" />
                                        </Button>
                                        <Button variant="outline" size="sm" className="rounded-none">
                                            <RefreshCw className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Integrations */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Active Integrations</CardTitle>
                            <CardDescription>Manage your connected services and webhooks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {integrations.map((integration) => (
                                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-none">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{integration.icon}</span>
                                            <div>
                                                <p className="font-medium">{integration.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {integration.type} • Last sync: {integration.lastSync}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge 
                                                variant="secondary" 
                                                className={`rounded-none ${getStatusColor(integration.status)}`}
                                            >
                                                {integration.status}
                                            </Badge>
                                            <Button variant="ghost" size="sm" className="rounded-none">
                                                <Settings className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="rounded-none text-red-600">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Usage Tab */}
                <TabsContent value="usage" className="space-y-6">
                    {/* Usage Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>API Usage Trends</CardTitle>
                                <CardDescription>Monthly API call statistics</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-none">
                                    <div className="text-center">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                                        <p>API Usage Chart</p>
                                        <p className="text-sm">Monthly trends and patterns</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Top APIs</CardTitle>
                                <CardDescription>Most used APIs this month</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Code className="w-4 h-4" />
                                            <span className="text-sm">User Management API</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">450K calls</p>
                                            <p className="text-xs text-green-600">+12% from last month</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Code className="w-4 h-4" />
                                            <span className="text-sm">Payment API</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">320K calls</p>
                                            <p className="text-xs text-green-600">+8% from last month</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Code className="w-4 h-4" />
                                            <span className="text-sm">Auth API</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">280K calls</p>
                                            <p className="text-xs text-red-600">-3% from last month</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Detailed Usage */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Detailed Usage</CardTitle>
                            <CardDescription>Breakdown of your service usage</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">1.25M</div>
                                    <p className="text-sm text-muted-foreground">API Calls</p>
                                    <p className="text-xs text-green-600 mt-1">+15% from last month</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">45.2GB</div>
                                    <p className="text-sm text-muted-foreground">Storage Used</p>
                                    <p className="text-xs text-green-600 mt-1">+8% from last month</p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">12</div>
                                    <p className="text-sm text-muted-foreground">Active Integrations</p>
                                    <p className="text-xs text-green-600 mt-1">+2 from last month</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </PageWrapper>
    )
}
