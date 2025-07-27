'use client'

import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import PageWrapper from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    Play, 
    Edit, 
    Copy, 
    Trash2,
    Eye,
    Upload,
    Brain,
    Code,
    Globe,
    TrendingUp,
    Target} from "lucide-react"
import { toast } from "sonner"

// Validation schemas
const createApiSchema = z.object({
    name: z.string().min(2, "API name must be at least 2 characters"),
    description: z.string().optional(),
    type: z.enum(["prediction", "classification", "regression", "custom"]),
    template: z.string().optional(),
})

type CreateApiData = z.infer<typeof createApiSchema>

interface ApiItem {
    id: string
    name: string
    description: string
    status: 'draft' | 'active' | 'deprecated' | 'training'
    type: 'prediction' | 'classification' | 'regression' | 'custom'
    usage: {
        calls: number
        limit: number
        accuracy?: number
        latency?: number
    }
    createdAt: string
    updatedAt: string
    lastUsed?: string
    teamMembers: number
    integrations: number
    version: string
    model?: {
        name: string
        accuracy: number
        status: 'training' | 'ready' | 'failed'
    }
}

export default function ApiPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("all")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [typeFilter, setTypeFilter] = useState("all")
    const [sortBy, setSortBy] = useState("recent")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedApi, setSelectedApi] = useState<ApiItem | null>(null)

    // Mock data
    const apis: ApiItem[] = [
        {
            id: "api-1",
            name: "Customer Churn Predictor",
            description: "AI model to predict customer churn probability",
            status: "active",
            type: "prediction",
            usage: {
                calls: 125000,
                limit: 200000,
                accuracy: 94.2,
                latency: 245
            },
            createdAt: "2024-01-15",
            updatedAt: "2024-01-20",
            lastUsed: "2 hours ago",
            teamMembers: 5,
            integrations: 3,
            version: "v2.1.0",
            model: {
                name: "XGBoost Classifier",
                accuracy: 94.2,
                status: "ready"
            }
        },
        {
            id: "api-2",
            name: "Sentiment Analysis",
            description: "Analyze text sentiment using NLP",
            status: "training",
            type: "classification",
            usage: {
                calls: 45000,
                limit: 100000,
                accuracy: 87.5,
                latency: 180
            },
            createdAt: "2024-01-10",
            updatedAt: "2024-01-19",
            lastUsed: "1 day ago",
            teamMembers: 3,
            integrations: 2,
            version: "v1.5.0",
            model: {
                name: "BERT Transformer",
                accuracy: 87.5,
                status: "training"
            }
        },
        {
            id: "api-3",
            name: "Price Prediction Model",
            description: "Predict product prices based on features",
            status: "draft",
            type: "regression",
            usage: {
                calls: 0,
                limit: 50000
            },
            createdAt: "2024-01-18",
            updatedAt: "2024-01-18",
            teamMembers: 2,
            integrations: 0,
            version: "v0.1.0"
        },
        {
            id: "api-4",
            name: "Custom Data Processor",
            description: "Custom API for data transformation",
            status: "active",
            type: "custom",
            usage: {
                calls: 89000,
                limit: 150000,
                latency: 120
            },
            createdAt: "2024-01-05",
            updatedAt: "2024-01-17",
            lastUsed: "5 hours ago",
            teamMembers: 4,
            integrations: 5,
            version: "v1.2.0"
        }
    ]

    // Form for creating new API
    const createForm = useForm<CreateApiData>({
        resolver: zodResolver(createApiSchema),
        defaultValues: {
            name: "",
            description: "",
            type: "prediction",
            template: "",
        },
    })

    // Filtered and sorted APIs
    const filteredApis = useMemo(() => {
        let filtered = apis.filter(api => {
            const matchesSearch = api.name.toLowerCase().includes(search.toLowerCase()) ||
                                api.description.toLowerCase().includes(search.toLowerCase())
            const matchesStatus = statusFilter === "all" || api.status === statusFilter
            const matchesType = typeFilter === "all" || api.type === typeFilter
            
            return matchesSearch && matchesStatus && matchesType
        })

        // Sort APIs
        switch (sortBy) {
            case "name":
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
            case "recent":
                filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                break
            case "usage":
                filtered.sort((a, b) => b.usage.calls - a.usage.calls)
                break
            case "accuracy":
                filtered.sort((a, b) => (b.usage.accuracy || 0) - (a.usage.accuracy || 0))
                break
        }

        return filtered
    }, [apis, search, statusFilter, typeFilter, sortBy])

    // Tab filtering
    const tabFilteredApis = useMemo(() => {
        switch (activeTab) {
            case "active":
                return filteredApis.filter(api => api.status === "active")
            case "draft":
                return filteredApis.filter(api => api.status === "draft")
            case "training":
                return filteredApis.filter(api => api.status === "training")
            case "deprecated":
                return filteredApis.filter(api => api.status === "deprecated")
            default:
                return filteredApis
        }
    }, [filteredApis, activeTab])

    const handleCreateApi = async (data: CreateApiData) => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success(`API "${data.name}" created successfully!`)
            createForm.reset()
            // Navigate to the new API detail page
            navigate(`/prathamesh/apis/api-${Date.now()}`)
        } catch (error) {
            toast.error("Failed to create API")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDuplicateApi = async (api: ApiItem) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success(`API "${api.name}" duplicated successfully!`)
        } catch (error) {
            toast.error("Failed to duplicate API")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteApi = async (api: ApiItem) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))
            toast.success(`API "${api.name}" deleted successfully!`)
        } catch (error) {
            toast.error("Failed to delete API")
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "text-green-700 bg-green-100"
            case "draft":
                return "text-gray-700 bg-gray-100"
            case "training":
                return "text-blue-700 bg-blue-100"
            case "deprecated":
                return "text-red-700 bg-red-100"
            default:
                return "text-gray-700 bg-gray-100"
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "prediction":
                return <Target className="w-4 h-4" />
            case "classification":
                return <Brain className="w-4 h-4" />
            case "regression":
                return <TrendingUp className="w-4 h-4" />
            case "custom":
                return <Code className="w-4 h-4" />
            default:
                return <Globe className="w-4 h-4" />
        }
    }

    const getUsagePercentage = (calls: number, limit: number) => {
        return Math.round((calls / limit) * 100)
    }

    return (
        <PageWrapper
            title="AI APIs"
            subtitle="Manage your no-code AI APIs and machine learning models"
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-none">
                        <Upload className="w-4 h-4 mr-2" />
                        Import API
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="rounded-none">
                                <Plus className="w-4 h-4 mr-2" />
                                Create API
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md rounded-none">
                            <DialogHeader>
                                <DialogTitle>Create New AI API</DialogTitle>
                                <DialogDescription>
                                    Build a new AI-powered API using our no-code interface
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...createForm}>
                                <form onSubmit={createForm.handleSubmit(handleCreateApi)} className="space-y-4">
                                    <FormField
                                        control={createForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>API Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="My AI API" {...field} className="rounded-none" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description (Optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="What does this API do?" {...field} className="rounded-none" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={createForm.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>API Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="rounded-none">
                                                            <SelectValue placeholder="Select API type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="prediction">
                                                            <div className="flex items-center gap-2">
                                                                <Target className="w-4 h-4" />
                                                                Prediction
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="classification">
                                                            <div className="flex items-center gap-2">
                                                                <Brain className="w-4 h-4" />
                                                                Classification
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="regression">
                                                            <div className="flex items-center gap-2">
                                                                <TrendingUp className="w-4 h-4" />
                                                                Regression
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="custom">
                                                            <div className="flex items-center gap-2">
                                                                <Code className="w-4 h-4" />
                                                                Custom Logic
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <Button type="submit" className="rounded-none w-full" disabled={isLoading}>
                                            {isLoading ? "Creating..." : "Create API"}
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
                <TabsList className="grid w-full grid-cols-5 rounded-none">
                    <TabsTrigger value="all" className="rounded-none">All APIs</TabsTrigger>
                    <TabsTrigger value="active" className="rounded-none">Active</TabsTrigger>
                    <TabsTrigger value="draft" className="rounded-none">Draft</TabsTrigger>
                    <TabsTrigger value="training" className="rounded-none">Training</TabsTrigger>
                    <TabsTrigger value="deprecated" className="rounded-none">Deprecated</TabsTrigger>
                </TabsList>

                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search APIs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded-none pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px] rounded-none">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="training">Training</SelectItem>
                                <SelectItem value="deprecated">Deprecated</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[150px] rounded-none">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="prediction">Prediction</SelectItem>
                                <SelectItem value="classification">Classification</SelectItem>
                                <SelectItem value="regression">Regression</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[150px] rounded-none">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="recent">Recently Updated</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="usage">Usage</SelectItem>
                                <SelectItem value="accuracy">Accuracy</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* API Grid */}
                <TabsContent value={activeTab} className="space-y-6">
                    {tabFilteredApis.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tabFilteredApis.map((api) => (
                                <Card key={api.id} className="rounded-none hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(api.type)}
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">{api.name}</CardTitle>
                                                    <CardDescription className="mt-1">
                                                        {api.description}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Badge 
                                                    variant="secondary" 
                                                    className={`rounded-none ${getStatusColor(api.status)}`}
                                                >
                                                    {api.status}
                                                </Badge>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-none">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="w-48 rounded-none">
                                                        <div className="space-y-2">
                                                            <Button 
                                                                variant="ghost" 
                                                                className="w-full justify-start rounded-none"
                                                                onClick={() => navigate(`/prathamesh/apis/${api.id}`)}
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Open
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                className="w-full justify-start rounded-none"
                                                                onClick={() => navigate(`/prathamesh/apis/${api.id}/edit`)}
                                                            >
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Edit
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                className="w-full justify-start rounded-none"
                                                                onClick={() => handleDuplicateApi(api)}
                                                            >
                                                                <Copy className="w-4 h-4 mr-2" />
                                                                Duplicate
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        className="w-full justify-start rounded-none text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                                        Delete
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent className="rounded-none">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Delete API</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Are you sure you want to delete "{api.name}"? 
                                                                            This action cannot be undone.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
                                                                        <AlertDialogAction 
                                                                            onClick={() => handleDeleteApi(api)}
                                                                            className="rounded-none bg-red-600 hover:bg-red-700"
                                                                        >
                                                                            Delete
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Usage Stats */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">API Calls</span>
                                                <span className="font-medium">
                                                    {api.usage.calls.toLocaleString()} / {api.usage.limit.toLocaleString()}
                                                </span>
                                            </div>
                                            <Progress 
                                                value={getUsagePercentage(api.usage.calls, api.usage.limit)} 
                                                className="h-2" 
                                            />
                                        </div>

                                        {/* Model Info */}
                                        {api.model && (
                                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-none">
                                                <div className="flex items-center gap-2">
                                                    <Brain className="w-4 h-4 text-blue-500" />
                                                    <span className="text-sm font-medium">{api.model.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {api.model.status === "ready" && (
                                                        <Badge variant="outline" className="text-green-600 border-green-200">
                                                            {api.model.accuracy}% accuracy
                                                        </Badge>
                                                    )}
                                                    {api.model.status === "training" && (
                                                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                                                            Training...
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Performance Metrics */}
                                        {(api.usage.accuracy || api.usage.latency) && (
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                {api.usage.accuracy && (
                                                    <div className="text-center p-2 bg-green-50 rounded-none">
                                                        <div className="font-medium text-green-700">{api.usage.accuracy}%</div>
                                                        <div className="text-xs text-green-600">Accuracy</div>
                                                    </div>
                                                )}
                                                {api.usage.latency && (
                                                    <div className="text-center p-2 bg-blue-50 rounded-none">
                                                        <div className="font-medium text-blue-700">{api.usage.latency}ms</div>
                                                        <div className="text-xs text-blue-600">Latency</div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Metadata */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                            <div className="flex items-center gap-4">
                                                <span>v{api.version}</span>
                                                <span>{api.teamMembers} members</span>
                                                <span>{api.integrations} integrations</span>
                                            </div>
                                            <span>{api.lastUsed || "Never used"}</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="flex-1 rounded-none"
                                                onClick={() => navigate(`/prathamesh/apis/${api.id}`)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                Open
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="rounded-none"
                                                onClick={() => navigate(`/prathamesh/apis/${api.id}/test`)}
                                            >
                                                <Play className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="rounded-none">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Brain className="w-12 h-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No APIs found</h3>
                                <p className="text-gray-500 mb-4 text-center">
                                    {search || statusFilter !== "all" || typeFilter !== "all" 
                                        ? "Try adjusting your search or filters"
                                        : "Get started by creating your first AI API"
                                    }
                                </p>
                                {!search && statusFilter === "all" && typeFilter === "all" && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="rounded-none">
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create Your First API
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-md rounded-none">
                                            <DialogHeader>
                                                <DialogTitle>Create New AI API</DialogTitle>
                                                <DialogDescription>
                                                    Build a new AI-powered API using our no-code interface
                                                </DialogDescription>
                                            </DialogHeader>
                                            <Form {...createForm}>
                                                <form onSubmit={createForm.handleSubmit(handleCreateApi)} className="space-y-4">
                                                    <FormField
                                                        control={createForm.control}
                                                        name="name"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>API Name</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="My AI API" {...field} className="rounded-none" />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={createForm.control}
                                                        name="type"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>API Type</FormLabel>
                                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                    <FormControl>
                                                                        <SelectTrigger className="rounded-none">
                                                                            <SelectValue placeholder="Select API type" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        <SelectItem value="prediction">Prediction</SelectItem>
                                                                        <SelectItem value="classification">Classification</SelectItem>
                                                                        <SelectItem value="regression">Regression</SelectItem>
                                                                        <SelectItem value="custom">Custom Logic</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <DialogFooter>
                                                        <Button type="submit" className="rounded-none w-full" disabled={isLoading}>
                                                            {isLoading ? "Creating..." : "Create API"}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </Form>
                                        </DialogContent>
                                    </Dialog>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>
        </PageWrapper>
    )
}
