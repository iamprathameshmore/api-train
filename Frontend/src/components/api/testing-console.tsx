'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    Play, 
    Save, 
    Copy, 
    Download, 
    Eye, 
    EyeOff,
    Code,
    FileText,
    BookOpen,
    Terminal,
    TestTube,
    FlaskConical,
    Gauge,
    Timer,
    Zap,
    Database,
    Network,
    Server,
    HardDrive,
    Cloud,
    Wifi,
    WifiOff,
    Signal,
    SignalHigh,
    SignalMedium,
    SignalLow,
    Battery,
    BatteryCharging,
    Power,
    PowerOff,
    Sun,
    Moon,
    Monitor,
    Smartphone,
    Tablet,
    Laptop,
    MousePointer,
    MousePointer2,
    Hand,
    HandMetal,
    Scissors,
    Type,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    List,
    ListOrdered,
    Quote,
    Image,
    Video,
    Music,
    Mic,
    MicOff,
    Volume,
    Volume1,
    Volume2,
    VolumeX,
    Headphones,
    Speaker,
    Radio,
    Tv,
    MonitorSpeaker,
    MonitorSmartphone,
    MonitorTablet,
    MonitorLaptop,
    MonitorDesktop,
    MonitorCheck,
    MonitorX,
    MonitorPause,
    MonitorPlay,
    MonitorStop,
    MonitorSkipBack,
    MonitorSkipForward,
    MonitorRewind,
    MonitorFastForward,
    MonitorVolume,
    MonitorVolume1,
    MonitorVolume2,
    MonitorVolumeX,
    MonitorMute,
    MonitorUnmute,
    MonitorOff,
    MonitorOn,
    Settings,
    Layers,
    Bot,
    Cpu,
    Target,
    Palette,
    Key,
    Lock,
    Unlock,
    Brain,
    Globe,
    Shield,
    Users,
    Activity,
    TrendingUp,
    Clock,
    Calendar,
    Star,
    BarChart3,
    FileText as FileTextIcon,
    ExternalLink,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    Plus,
    Search,
    Filter,
    MoreVertical,
    FileSpreadsheet,
    FileJson,
    FileCode,
    GitBranch,
    GitCommit,
    GitPullRequest,
    MessageSquare,
    Mail,
    Phone,
    MapPin,
    ChevronDown,
    ChevronRight,
    Minus,
    Maximize2,
    Minimize2,
    RotateCcw,
    Share2,
    BookOpen as BookOpenIcon,
    Terminal as TerminalIcon,
    TestTube as TestTubeIcon,
    FlaskConical as FlaskConicalIcon,
    Gauge as GaugeIcon,
    Timer as TimerIcon,
    Zap as ZapIcon,
    Database as DatabaseIcon,
    Network as NetworkIcon,
    Server as ServerIcon,
    HardDrive as HardDriveIcon,
    Cloud as CloudIcon,
    Wifi as WifiIcon,
    WifiOff as WifiOffIcon,
    Signal as SignalIcon,
    SignalHigh as SignalHighIcon,
    SignalMedium as SignalMediumIcon,
    SignalLow as SignalLowIcon,
    Battery as BatteryIcon,
    BatteryCharging as BatteryChargingIcon,
    Power as PowerIcon,
    PowerOff as PowerOffIcon,
    Sun as SunIcon,
    Moon as MoonIcon,
    Monitor as MonitorIcon,
    Smartphone as SmartphoneIcon,
    Tablet as TabletIcon,
    Laptop as LaptopIcon,
    MousePointer as MousePointerIcon,
    MousePointer2 as MousePointer2Icon,
    Hand as HandIcon,
    HandMetal as HandMetalIcon,
    Scissors as ScissorsIcon,
    Type as TypeIcon,
    Bold as BoldIcon,
    Italic as ItalicIcon,
    Underline as UnderlineIcon,
    Strikethrough as StrikethroughIcon,
    AlignLeft as AlignLeftIcon,
    AlignCenter as AlignCenterIcon,
    AlignRight as AlignRightIcon,
    AlignJustify as AlignJustifyIcon,
    List as ListIcon,
    ListOrdered as ListOrderedIcon,
    Quote as QuoteIcon,
    Image as ImageIcon,
    Video as VideoIcon,
    Music as MusicIcon,
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Volume as VolumeIcon,
    Volume1 as Volume1Icon,
    Volume2 as Volume2Icon,
    VolumeX as VolumeXIcon,
    Headphones as HeadphonesIcon,
    Speaker as SpeakerIcon,
    Radio as RadioIcon,
    Tv as TvIcon,
    MonitorSpeaker as MonitorSpeakerIcon,
    MonitorSmartphone as MonitorSmartphoneIcon,
    MonitorTablet as MonitorTabletIcon,
    MonitorLaptop as MonitorLaptopIcon,
    MonitorDesktop as MonitorDesktopIcon,
    MonitorCheck as MonitorCheckIcon,
    MonitorX as MonitorXIcon,
    MonitorPause as MonitorPauseIcon,
    MonitorPlay as MonitorPlayIcon,
    MonitorStop as MonitorStopIcon,
    MonitorSkipBack as MonitorSkipBackIcon,
    MonitorSkipForward as MonitorSkipForwardIcon,
    MonitorRewind as MonitorRewindIcon,
    MonitorFastForward as MonitorFastForwardIcon,
    MonitorVolume as MonitorVolumeIcon,
    MonitorVolume1 as MonitorVolume1Icon,
    MonitorVolume2 as MonitorVolume2Icon,
    MonitorVolumeX as MonitorVolumeXIcon,
    MonitorMute as MonitorMuteIcon,
    MonitorUnmute as MonitorUnmuteIcon,
    MonitorOff as MonitorOffIcon,
    MonitorOn as MonitorOnIcon
} from "lucide-react"
import { toast } from "sonner"

interface ApiEndpoint {
    id: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    path: string
    name: string
    description: string
    parameters: ApiParameter[]
    requestBody?: ApiRequestBody
    responses: ApiResponse[]
    examples: ApiExample[]
}

interface ApiParameter {
    name: string
    type: string
    required: boolean
    description: string
    example: string
}

interface ApiRequestBody {
    type: string
    schema: any
    required: boolean
    description: string
}

interface ApiResponse {
    code: number
    description: string
    schema: any
    example: string
}

interface ApiExample {
    name: string
    description: string
    request: string
    response: string
}

interface TestResult {
    status: number
    response: string
    headers: Record<string, string>
    time: number
    size: number
}

export default function TestingConsole() {
    const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null)
    const [requestMethod, setRequestMethod] = useState('POST')
    const [requestUrl, setRequestUrl] = useState('https://api.example.com/predict')
    const [requestBody, setRequestBody] = useState('')
    const [requestHeaders, setRequestHeaders] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [testResult, setTestResult] = useState<TestResult | null>(null)
    const [activeTab, setActiveTab] = useState('console')

    // Mock API endpoints
    const apiEndpoints: ApiEndpoint[] = [
        {
            id: "predict",
            method: "POST",
            path: "/predict",
            name: "Predict Churn",
            description: "Predict customer churn probability",
            parameters: [
                {
                    name: "customer_id",
                    type: "string",
                    required: true,
                    description: "Unique customer identifier",
                    example: "CUST001"
                },
                {
                    name: "age",
                    type: "number",
                    required: true,
                    description: "Customer age",
                    example: "30"
                },
                {
                    name: "tenure",
                    type: "number",
                    required: true,
                    description: "Customer tenure in months",
                    example: "24"
                }
            ],
            requestBody: {
                type: "object",
                schema: {
                    type: "object",
                    properties: {
                        customer_id: { type: "string" },
                        age: { type: "number" },
                        tenure: { type: "number" },
                        monthly_charges: { type: "number" },
                        total_charges: { type: "number" }
                    },
                    required: ["customer_id", "age", "tenure"]
                },
                required: true,
                description: "Customer data for prediction"
            },
            responses: [
                {
                    code: 200,
                    description: "Successful prediction",
                    schema: {
                        type: "object",
                        properties: {
                            prediction: { type: "number" },
                            probability: { type: "number" },
                            confidence: { type: "number" }
                        }
                    },
                    example: `{
  "prediction": 0,
  "probability": 0.23,
  "confidence": 0.89
}`
                },
                {
                    code: 400,
                    description: "Bad request",
                    schema: {
                        type: "object",
                        properties: {
                            error: { type: "string" },
                            message: { type: "string" }
                        }
                    },
                    example: `{
  "error": "validation_error",
  "message": "Missing required field: customer_id"
}`
                }
            ],
            examples: [
                {
                    name: "Basic Prediction",
                    description: "Simple churn prediction",
                    request: `{
  "customer_id": "CUST001",
  "age": 30,
  "tenure": 24,
  "monthly_charges": 79.99,
  "total_charges": 1919.76
}`,
                    response: `{
  "prediction": 0,
  "probability": 0.23,
  "confidence": 0.89
}`
                },
                {
                    name: "High Risk Customer",
                    description: "Customer with high churn risk",
                    request: `{
  "customer_id": "CUST002",
  "age": 45,
  "tenure": 6,
  "monthly_charges": 120.50,
  "total_charges": 723.00
}`,
                    response: `{
  "prediction": 1,
  "probability": 0.87,
  "confidence": 0.92
}`
                }
            ]
        }
    ]

    const handleSendRequest = async () => {
        setIsLoading(true)
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500))
            
            const mockResult: TestResult = {
                status: 200,
                response: `{
  "prediction": 0,
  "probability": 0.23,
  "confidence": 0.89,
  "model_version": "v2.1.0",
  "processing_time": 245
}`,
                headers: {
                    'content-type': 'application/json',
                    'x-api-version': 'v2.1.0',
                    'x-processing-time': '245ms'
                },
                time: 245,
                size: 156
            }
            
            setTestResult(mockResult)
            toast.success("Request completed successfully!")
        } catch (error) {
            toast.error("Request failed")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCopyResponse = async () => {
        if (testResult) {
            try {
                await navigator.clipboard.writeText(testResult.response)
                toast.success("Response copied to clipboard!")
            } catch (error) {
                toast.error("Failed to copy response")
            }
        }
    }

    const handleLoadExample = (example: ApiExample) => {
        setRequestBody(example.request)
        toast.success(`Loaded example: ${example.name}`)
    }

    const formatJson = (json: string) => {
        try {
            return JSON.stringify(JSON.parse(json), null, 2)
        } catch {
            return json
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">API Testing Console</h2>
                    <p className="text-muted-foreground">
                        Test your API endpoints with real-time requests and documentation
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-none">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Documentation
                    </Button>
                    <Button variant="outline" className="rounded-none">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button className="rounded-none">
                        <Play className="w-4 h-4 mr-2" />
                        Test All
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 rounded-none">
                    <TabsTrigger value="console" className="rounded-none">Testing Console</TabsTrigger>
                    <TabsTrigger value="documentation" className="rounded-none">Documentation</TabsTrigger>
                    <TabsTrigger value="examples" className="rounded-none">Examples</TabsTrigger>
                </TabsList>

                {/* Testing Console Tab */}
                <TabsContent value="console" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Request Panel */}
                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Request</CardTitle>
                                <CardDescription>Configure and send API requests</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Method and URL */}
                                <div className="flex gap-2">
                                    <Select value={requestMethod} onValueChange={setRequestMethod}>
                                        <SelectTrigger className="w-24 rounded-none">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input 
                                        value={requestUrl}
                                        onChange={(e) => setRequestUrl(e.target.value)}
                                        placeholder="https://api.example.com/endpoint"
                                        className="flex-1 rounded-none"
                                    />
                                </div>

                                {/* Headers */}
                                <div>
                                    <label className="text-sm font-medium">Headers</label>
                                    <Textarea 
                                        value={requestHeaders}
                                        onChange={(e) => setRequestHeaders(e.target.value)}
                                        placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
                                        className="rounded-none h-20"
                                    />
                                </div>

                                {/* Request Body */}
                                {requestMethod !== 'GET' && (
                                    <div>
                                        <label className="text-sm font-medium">Request Body</label>
                                        <Textarea 
                                            value={requestBody}
                                            onChange={(e) => setRequestBody(e.target.value)}
                                            placeholder='{"key": "value"}'
                                            className="rounded-none h-40"
                                        />
                                    </div>
                                )}

                                {/* Send Button */}
                                <Button 
                                    onClick={handleSendRequest}
                                    disabled={isLoading}
                                    className="rounded-none w-full"
                                >
                                    {isLoading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Send Request
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Response Panel */}
                        <Card className="rounded-none">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Response</CardTitle>
                                        <CardDescription>View API response and metrics</CardDescription>
                                    </div>
                                    {testResult && (
                                        <Button variant="outline" size="sm" className="rounded-none" onClick={handleCopyResponse}>
                                            <Copy className="w-4 h-4 mr-2" />
                                            Copy
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {testResult ? (
                                    <div className="space-y-4">
                                        {/* Response Status */}
                                        <div className="flex items-center gap-4">
                                            <Badge 
                                                variant={testResult.status >= 200 && testResult.status < 300 ? "default" : "destructive"}
                                                className="rounded-none"
                                            >
                                                {testResult.status}
                                            </Badge>
                                            <span className="text-sm text-muted-foreground">
                                                {testResult.time}ms • {testResult.size} bytes
                                            </span>
                                        </div>

                                        {/* Response Headers */}
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Response Headers</h4>
                                            <div className="bg-gray-50 p-3 rounded-none text-xs">
                                                {Object.entries(testResult.headers).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between">
                                                        <span className="font-medium">{key}:</span>
                                                        <span>{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Response Body */}
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Response Body</h4>
                                            <pre className="bg-gray-50 p-3 rounded-none text-xs overflow-auto max-h-60">
                                                {formatJson(testResult.response)}
                                            </pre>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-40 text-muted-foreground">
                                        <div className="text-center">
                                            <Terminal className="w-12 h-12 mx-auto mb-2" />
                                            <p>Send a request to see the response</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Documentation Tab */}
                <TabsContent value="documentation" className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>API Documentation</CardTitle>
                            <CardDescription>Comprehensive API reference and schemas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {apiEndpoints.map((endpoint) => (
                                    <div key={endpoint.id} className="border rounded-none p-6">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Badge 
                                                variant="outline" 
                                                className="rounded-none font-mono"
                                            >
                                                {endpoint.method}
                                            </Badge>
                                            <code className="text-sm bg-gray-100 px-2 py-1 rounded-none">
                                                {endpoint.path}
                                            </code>
                                            <h3 className="text-lg font-medium">{endpoint.name}</h3>
                                        </div>
                                        
                                        <p className="text-muted-foreground mb-4">{endpoint.description}</p>

                                        {/* Parameters */}
                                        {endpoint.parameters.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="font-medium mb-2">Parameters</h4>
                                                <div className="space-y-2">
                                                    {endpoint.parameters.map((param) => (
                                                        <div key={param.name} className="flex items-center gap-4 text-sm">
                                                            <code className="bg-gray-100 px-2 py-1 rounded-none">
                                                                {param.name}
                                                            </code>
                                                            <span className="text-muted-foreground">{param.type}</span>
                                                            <Badge 
                                                                variant={param.required ? "destructive" : "outline"}
                                                                className="rounded-none"
                                                            >
                                                                {param.required ? "Required" : "Optional"}
                                                            </Badge>
                                                            <span className="text-muted-foreground">{param.description}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Request Body Schema */}
                                        {endpoint.requestBody && (
                                            <div className="mb-4">
                                                <h4 className="font-medium mb-2">Request Body</h4>
                                                <pre className="bg-gray-50 p-3 rounded-none text-xs overflow-auto">
                                                    {JSON.stringify(endpoint.requestBody.schema, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        {/* Responses */}
                                        <div>
                                            <h4 className="font-medium mb-2">Responses</h4>
                                            <div className="space-y-3">
                                                {endpoint.responses.map((response) => (
                                                    <div key={response.code} className="border-l-4 border-gray-200 pl-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Badge 
                                                                variant={response.code >= 200 && response.code < 300 ? "default" : "destructive"}
                                                                className="rounded-none"
                                                            >
                                                                {response.code}
                                                            </Badge>
                                                            <span className="text-sm font-medium">{response.description}</span>
                                                        </div>
                                                        <pre className="bg-gray-50 p-2 rounded-none text-xs overflow-auto">
                                                            {response.example}
                                                        </pre>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Examples Tab */}
                <TabsContent value="examples" className="space-y-6">
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Request Examples</CardTitle>
                            <CardDescription>Pre-built examples to test your API</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {apiEndpoints.map((endpoint) => (
                                    <div key={endpoint.id}>
                                        <h3 className="text-lg font-medium mb-4">{endpoint.name}</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {endpoint.examples.map((example) => (
                                                <Card key={example.name} className="rounded-none">
                                                    <CardHeader>
                                                        <CardTitle className="text-base">{example.name}</CardTitle>
                                                        <CardDescription>{example.description}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div>
                                                            <h4 className="text-sm font-medium mb-2">Request</h4>
                                                            <pre className="bg-gray-50 p-3 rounded-none text-xs overflow-auto">
                                                                {example.request}
                                                            </pre>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-medium mb-2">Response</h4>
                                                            <pre className="bg-gray-50 p-3 rounded-none text-xs overflow-auto">
                                                                {example.response}
                                                            </pre>
                                                        </div>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="rounded-none w-full"
                                                            onClick={() => handleLoadExample(example)}
                                                        >
                                                            <Play className="w-4 h-4 mr-2" />
                                                            Load Example
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 