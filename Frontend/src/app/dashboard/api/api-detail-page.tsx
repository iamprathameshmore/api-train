'use client'

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import PageWrapper from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
    Upload, 
    Download, 
    Play, 
    Eye,
    Brain,

    Activity,
    Clock,
    
    BarChart3,
    AlertTriangle,
    Workflow,
    Target,
    Plus,
    FileSpreadsheet,
    Share2,
    BookOpen,
    Terminal,
    Zap
    
    ,

} from "lucide-react"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

// Validation schemas
const datasetUploadSchema = z.object({
    name: z.string().min(2, "Dataset name must be at least 2 characters"),
    description: z.string().optional(),
    type: z.enum(["csv", "excel", "json", "integration"]),
    source: z.string().optional(),
})

const modelTrainingSchema = z.object({
    modelType: z.enum(["auto", "xgboost", "random_forest", "neural_network", "custom"]),
    targetColumn: z.string().min(1, "Target column is required"),
    testSize: z.string(),
    epochs: z.string().optional(),
    learningRate: z.string().optional(),
})

const apiLogicSchema = z.object({
    name: z.string().min(2, "Logic name must be at least 2 characters"),
    description: z.string().optional(),
    trigger: z.enum(["prediction", "post_processing", "custom"]),
    conditions: z.array(z.object({
        field: z.string(),
        operator: z.string(),
        value: z.string(),
    })),
})

type DatasetUploadData = z.infer<typeof datasetUploadSchema>
type ModelTrainingData = z.infer<typeof modelTrainingSchema>

interface Dataset {
    id: string
    name: string
    type: string
    size: number
    rows: number
    columns: number
    uploadedAt: string
    status: 'uploading' | 'processing' | 'ready' | 'error'
    preview: any[]
}

interface Model {
    id: string
    name: string
    type: string
    accuracy: number
    status: 'training' | 'ready' | 'failed'
    createdAt: string
    version: string
    metrics: {
        precision: number
        recall: number
        f1Score: number
        loss: number
    }
}


export default function ApiDetailPage() {
    const { id } = useParams()
    const [activeTab, setActiveTab] = useState("overview")
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null)
    const [selectedModel, setSelectedModel] = useState<Model | null>(null)
    const [showApiKey, setShowApiKey] = useState(false)

    // Mock API data
    const api = {
        id: id || "api-1",
        name: "Customer Churn Predictor",
        description: "AI model to predict customer churn probability using machine learning",
        status: "active",
        type: "prediction",
        version: "v2.1.0",
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
        usage: {
            calls: 125000,
            limit: 200000,
            accuracy: 94.2,
            latency: 245,
            errorRate: 0.8
        },
        teamMembers: 5,
        integrations: 3,
        model: {
            name: "XGBoost Classifier",
            accuracy: 94.2,
            status: "ready"
        }
    }

    // Mock datasets
    const datasets: Dataset[] = [
        {
            id: "ds-1",
            name: "Customer Data v1",
            type: "csv",
            size: 2.5,
            rows: 10000,
            columns: 15,
            uploadedAt: "2024-01-15",
            status: "ready",
            preview: [
                { id: 1, name: "John Doe", email: "john@example.com", age: 30, churn: 0 },
                { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25, churn: 1 },
            ]
        },
        {
            id: "ds-2",
            name: "Customer Data v2",
            type: "excel",
            size: 3.2,
            rows: 15000,
            columns: 18,
            uploadedAt: "2024-01-18",
            status: "processing",
            preview: []
        }
    ]

    // Mock models
    const models: Model[] = [
        {
            id: "model-1",
            name: "XGBoost v2.1",
            type: "xgboost",
            accuracy: 94.2,
            status: "ready",
            createdAt: "2024-01-19",
            version: "v2.1.0",
            metrics: {
                precision: 0.92,
                recall: 0.89,
                f1Score: 0.90,
                loss: 0.058
            }
        },
        {
            id: "model-2",
            name: "Neural Network v1.0",
            type: "neural_network",
            accuracy: 91.5,
            status: "training",
            createdAt: "2024-01-20",
            version: "v1.0.0",
            metrics: {
                precision: 0.89,
                recall: 0.87,
                f1Score: 0.88,
                loss: 0.12
            }
        }
    ]

    // Form instances
    const datasetForm = useForm<DatasetUploadData>({
        resolver: zodResolver(datasetUploadSchema),
        defaultValues: {
            name: "",
            description: "",
            type: "csv",
            source: "",
        },
    })

    const modelForm = useForm<ModelTrainingData>({
        resolver: zodResolver(modelTrainingSchema),
        defaultValues: {
            modelType: "auto",
            targetColumn: "",
            testSize: "0.2",
            epochs: "100",
            learningRate: "0.01",
        },
    })

    const handleDatasetUpload = async (data: DatasetUploadData) => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            toast.success(`Dataset "${data.name}" uploaded successfully!`)
            datasetForm.reset()
        } catch (error) {
            toast.error("Failed to upload dataset")
        } finally {
            setIsLoading(false)
        }
    }

    const handleModelTraining = async () => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 3000))
            toast.success("Model training started successfully!")
            modelForm.reset()
        } catch (error) {
            toast.error("Failed to start model training")
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

    const getDatasetStatusColor = (status: string) => {
        switch (status) {
            case "ready":
                return "text-green-700 bg-green-100"
            case "processing":
                return "text-blue-700 bg-blue-100"
            case "uploading":
                return "text-yellow-700 bg-yellow-100"
            case "error":
                return "text-red-700 bg-red-100"
            default:
                return "text-gray-700 bg-gray-100"
        }
    }

    return (
        <PageWrapper
            title={api.name}
            subtitle={api.description}
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-none">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                    <Button variant="outline" className="rounded-none">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Docs
                    </Button>
                    <Button className="rounded-none">
                        <Play className="w-4 h-4 mr-2" />
                        Test API
                    </Button>
                </div>
            }
        >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-8 rounded-none">
                    <TabsTrigger value="overview" className="rounded-none">Overview</TabsTrigger>
                    <TabsTrigger value="datasets" className="rounded-none">Datasets</TabsTrigger>
                    <TabsTrigger value="models" className="rounded-none">Models</TabsTrigger>
                    <TabsTrigger value="logic" className="rounded-none">Logic</TabsTrigger>
                    <TabsTrigger value="testing" className="rounded-none">Testing</TabsTrigger>
                    <TabsTrigger value="workflows" className="rounded-none">Workflows</TabsTrigger>
                    <TabsTrigger value="analytics" className="rounded-none">Analytics</TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-none">Settings</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                    {/* API Status and Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{api.usage.calls.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+12%</span> from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
                                <Target className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{api.usage.accuracy}%</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+2.1%</span> from last version
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Latency</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{api.usage.latency}ms</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-red-600">+15ms</span> from last week
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{api.usage.errorRate}%</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">-0.2%</span> from last week
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Current Model Status */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Current Model</CardTitle>
                            <CardDescription>Active model and performance metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border rounded-none">
                                <div className="flex items-center gap-3">
                                    <Brain className="w-8 h-8 text-blue-500" />
                                    <div>
                                        <p className="font-medium">{api.model?.name}</p>
                                        <p className="text-sm text-muted-foreground">v{api.version}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">{api.model?.accuracy}%</div>
                                    <p className="text-sm text-muted-foreground">Accuracy</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Common tasks and shortcuts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Button variant="outline" className="rounded-none h-20 flex-col">
                                    <Upload className="w-6 h-6 mb-2" />
                                    <span className="text-sm">Upload Dataset</span>
                                </Button>
                                <Button variant="outline" className="rounded-none h-20 flex-col">
                                    <Brain className="w-6 h-6 mb-2" />
                                    <span className="text-sm">Train Model</span>
                                </Button>
                                <Button variant="outline" className="rounded-none h-20 flex-col">
                                    <Terminal className="w-6 h-6 mb-2" />
                                    <span className="text-sm">Test API</span>
                                </Button>
                                <Button variant="outline" className="rounded-none h-20 flex-col">
                                    <BarChart3 className="w-6 h-6 mb-2" />
                                    <span className="text-sm">View Analytics</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Datasets Tab */}
                <TabsContent value="datasets" className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Datasets</CardTitle>
                                    <CardDescription>Upload and manage your training data</CardDescription>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="rounded-none">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Upload Dataset
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md rounded-none">
                                        <DialogHeader>
                                            <DialogTitle>Upload Dataset</DialogTitle>
                                            <DialogDescription>
                                                Upload CSV, Excel, or JSON files for training
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form {...datasetForm}>
                                            <form onSubmit={datasetForm.handleSubmit(handleDatasetUpload)} className="space-y-4">
                                                <FormField
                                                    control={datasetForm.control}
                                                    name="name"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Dataset Name</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="My Dataset" {...field} className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={datasetForm.control}
                                                    name="type"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>File Type</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-none">
                                                                        <SelectValue placeholder="Select file type" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="csv">CSV</SelectItem>
                                                                    <SelectItem value="excel">Excel</SelectItem>
                                                                    <SelectItem value="json">JSON</SelectItem>
                                                                    <SelectItem value="integration">Integration</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <div className="border-2 border-dashed border-gray-300 rounded-none p-6 text-center">
                                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                                    <p className="text-sm text-gray-600">Drag and drop files here or click to browse</p>
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" className="rounded-none w-full" disabled={isLoading}>
                                                        {isLoading ? "Uploading..." : "Upload Dataset"}
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
                                {datasets.map((dataset) => (
                                    <div key={dataset.id} className="flex items-center justify-between p-4 border rounded-none">
                                        <div className="flex items-center gap-3">
                                            <FileSpreadsheet className="w-8 h-8 text-blue-500" />
                                            <div>
                                                <p className="font-medium">{dataset.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {dataset.rows.toLocaleString()} rows • {dataset.columns} columns • {dataset.size}MB
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge 
                                                variant="secondary" 
                                                className={`rounded-none ${getDatasetStatusColor(dataset.status)}`}
                                            >
                                                {dataset.status}
                                            </Badge>
                                            <Button variant="ghost" size="sm" className="rounded-none">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="rounded-none">
                                                <Download className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Models Tab */}
                <TabsContent value="models" className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Trained Models</CardTitle>
                                    <CardDescription>Manage your machine learning models</CardDescription>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button className="rounded-none">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Train Model
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md rounded-none">
                                        <DialogHeader>
                                            <DialogTitle>Train New Model</DialogTitle>
                                            <DialogDescription>
                                                Configure and train a new machine learning model
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form {...modelForm}>
                                            <form onSubmit={modelForm.handleSubmit(handleModelTraining)} className="space-y-4">
                                                <FormField
                                                    control={modelForm.control}
                                                    name="modelType"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Model Type</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-none">
                                                                        <SelectValue placeholder="Select model type" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="auto">AutoML</SelectItem>
                                                                    <SelectItem value="xgboost">XGBoost</SelectItem>
                                                                    <SelectItem value="random_forest">Random Forest</SelectItem>
                                                                    <SelectItem value="neural_network">Neural Network</SelectItem>
                                                                    <SelectItem value="custom">Custom</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={modelForm.control}
                                                    name="targetColumn"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Target Column</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="churn" {...field} className="rounded-none" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <DialogFooter>
                                                    <Button type="submit" className="rounded-none w-full" disabled={isLoading}>
                                                        {isLoading ? "Training..." : "Start Training"}
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
                                {models.map((model) => (
                                    <div key={model.id} className="flex items-center justify-between p-4 border rounded-none">
                                        <div className="flex items-center gap-3">
                                            <Brain className="w-8 h-8 text-purple-500" />
                                            <div>
                                                <p className="font-medium">{model.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {model.type} • v{model.version} • {model.createdAt}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-600">{model.accuracy}%</div>
                                                <p className="text-xs text-muted-foreground">Accuracy</p>
                                            </div>
                                            <Badge 
                                                variant="secondary" 
                                                className={`rounded-none ${getStatusColor(model.status)}`}
                                            >
                                                {model.status}
                                            </Badge>
                                            <Button variant="ghost" size="sm" className="rounded-none">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Logic Tab */}
                <TabsContent value="logic" className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>API Logic Designer</CardTitle>
                            <CardDescription>Build custom logic flows using our no-code interface</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-96 border rounded-none flex items-center justify-center">
                                <div className="text-center">
                                    <Workflow className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium mb-2">Logic Designer</h3>
                                    <p className="text-gray-500 mb-4">Drag and drop components to build custom API logic</p>
                                    <Button className="rounded-none">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Logic Flow
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Testing Tab */}
                <TabsContent value="testing" className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>API Testing Console</CardTitle>
                            <CardDescription>Test your API endpoints with real-time requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Select defaultValue="POST">
                                        <SelectTrigger className="w-24 rounded-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input 
                                        placeholder="https://api.example.com/predict" 
                                        className="flex-1 rounded-none" 
                                    />
                                    <Button className="rounded-none">
                                        <Play className="w-4 h-4 mr-2" />
                                        Send
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Request Body</Label>
                                        <Textarea 
                                            placeholder='{"customer_id": 123, "features": {...}}' 
                                            className="rounded-none h-32" 
                                        />
                                    </div>
                                    <div>
                                        <Label>Response</Label>
                                        <Textarea 
                                            placeholder="Response will appear here..." 
                                            className="rounded-none h-32" 
                                            readOnly 
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Workflows Tab */}
                <TabsContent value="workflows" className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Workflow Automation</CardTitle>
                            <CardDescription>Create automated workflows and integrations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-96 border rounded-none flex items-center justify-center">
                                <div className="text-center">
                                    <Zap className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium mb-2">Workflow Designer</h3>
                                    <p className="text-gray-500 mb-4">Build automated workflows with triggers and actions</p>
                                    <Button className="rounded-none">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Workflow
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Analytics Dashboard</CardTitle>
                            <CardDescription>Monitor API performance and usage metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-96 border rounded-none flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <h3 className="text-lg font-medium mb-2">Analytics</h3>
                                    <p className="text-gray-500 mb-4">View detailed performance metrics and insights</p>
                                    <Button className="rounded-none">
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        View Analytics
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Settings Tab */}
                <TabsContent value="settings" className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>API Settings</CardTitle>
                            <CardDescription>Configure API behavior and security</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">API Status</h4>
                                        <p className="text-sm text-muted-foreground">Enable or disable the API</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Rate Limiting</h4>
                                        <p className="text-sm text-muted-foreground">Limit requests per minute</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium">Auto-scaling</h4>
                                        <p className="text-sm text-muted-foreground">Automatically scale based on demand</p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </PageWrapper>
    )
}
