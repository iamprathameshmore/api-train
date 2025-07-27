'use client'

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
    Plus, 
    Save, 
    Play, 
    Pause, 
    Edit, 
    Copy, 
    Trash2,
    Eye,
    Code,
    Workflow,
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
    Database,
    Globe,
    Shield,
    Users,
    Activity,
    TrendingUp,
    Clock,
    Calendar,
    Star,
    BarChart3,
    FileText,
    ExternalLink,
    RefreshCw,
    CheckCircle,
    AlertTriangle,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles
} from "lucide-react"
import { toast } from "sonner"

interface LogicNode {
    id: string
    type: 'input' | 'condition' | 'action' | 'output' | 'math' | 'transform'
    name: string
    description: string
    position: { x: number; y: number }
    data: any
    connections: string[]
}

interface LogicFlow {
    id: string
    name: string
    description: string
    nodes: LogicNode[]
    isActive: boolean
    version: string
    createdAt: string
}

export default function LogicDesigner() {
    const [selectedNode, setSelectedNode] = useState<LogicNode | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const canvasRef = useRef<HTMLDivElement>(null)

    // Mock logic flows
    const logicFlows: LogicFlow[] = [
        {
            id: "flow-1",
            name: "Customer Churn Logic",
            description: "Process customer data and predict churn probability",
            nodes: [
                {
                    id: "node-1",
                    type: "input",
                    name: "Customer Data",
                    description: "Input customer information",
                    position: { x: 100, y: 100 },
                    data: { fields: ["customer_id", "age", "tenure", "monthly_charges"] },
                    connections: ["node-2"]
                },
                {
                    id: "node-2",
                    type: "condition",
                    name: "High Risk Check",
                    description: "Check if customer is high risk",
                    position: { x: 300, y: 100 },
                    data: { 
                        condition: "monthly_charges > 100 AND tenure < 12",
                        operator: "AND"
                    },
                    connections: ["node-3", "node-4"]
                },
                {
                    id: "node-3",
                    type: "action",
                    name: "Send Alert",
                    description: "Send high-risk alert",
                    position: { x: 500, y: 50 },
                    data: { action: "send_email", template: "high_risk_alert" },
                    connections: ["node-5"]
                },
                {
                    id: "node-4",
                    type: "action",
                    name: "Standard Process",
                    description: "Standard processing",
                    position: { x: 500, y: 150 },
                    data: { action: "standard_processing" },
                    connections: ["node-5"]
                },
                {
                    id: "node-5",
                    type: "output",
                    name: "Prediction Result",
                    description: "Output churn prediction",
                    position: { x: 700, y: 100 },
                    data: { output: "churn_probability" },
                    connections: []
                }
            ],
            isActive: true,
            version: "v1.0.0",
            createdAt: "2024-01-15"
        }
    ]

    const nodeTypes = [
        { type: "input", name: "Input", icon: Database, color: "bg-blue-500" },
        { type: "condition", name: "Condition", icon: GitBranch, color: "bg-yellow-500" },
        { type: "action", name: "Action", icon: Zap, color: "bg-green-500" },
        { type: "math", name: "Math", icon: Cpu, color: "bg-purple-500" },
        { type: "transform", name: "Transform", icon: RefreshCw, color: "bg-orange-500" },
        { type: "output", name: "Output", icon: Target, color: "bg-red-500" }
    ]

    const handleNodeDragStart = (e: React.MouseEvent, node: LogicNode) => {
        setIsDragging(true)
        setSelectedNode(node)
        const rect = e.currentTarget.getBoundingClientRect()
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        })
    }

    const handleNodeDrag = (e: React.MouseEvent) => {
        if (!isDragging || !selectedNode || !canvasRef.current) return

        const canvasRect = canvasRef.current.getBoundingClientRect()
        const newX = e.clientX - canvasRect.left - dragOffset.x
        const newY = e.clientY - canvasRect.top - dragOffset.y

        // Update node position
        selectedNode.position = { x: newX, y: newY }
    }

    const handleNodeDragEnd = () => {
        setIsDragging(false)
        setSelectedNode(null)
    }

    const getNodeIcon = (type: string) => {
        const nodeType = nodeTypes.find(nt => nt.type === type)
        if (nodeType) {
            const IconComponent = nodeType.icon
            return <IconComponent className="w-5 h-5" />
        }
        return <Code className="w-5 h-5" />
    }

    const getNodeColor = (type: string) => {
        const nodeType = nodeTypes.find(nt => nt.type === type)
        return nodeType?.color || "bg-gray-500"
    }

    const renderNode = (node: LogicNode) => {
        return (
            <div
                key={node.id}
                className={`absolute p-4 border-2 rounded-none cursor-move min-w-[200px] ${
                    selectedNode?.id === node.id ? 'border-blue-500 shadow-lg' : 'border-gray-300'
                }`}
                style={{
                    left: node.position.x,
                    top: node.position.y,
                    backgroundColor: 'white'
                }}
                onMouseDown={(e) => handleNodeDragStart(e, node)}
                onMouseMove={handleNodeDrag}
                onMouseUp={handleNodeDragEnd}
            >
                <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 rounded-none ${getNodeColor(node.type)}`}>
                        {getNodeIcon(node.type)}
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-sm">{node.name}</h4>
                        <p className="text-xs text-muted-foreground">{node.description}</p>
                    </div>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-none">
                            <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-none">
                            <Trash2 className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
                
                {/* Node-specific content */}
                {node.type === 'condition' && (
                    <div className="text-xs bg-yellow-50 p-2 rounded-none">
                        <p className="font-medium">Condition:</p>
                        <p className="text-muted-foreground">{node.data.condition}</p>
                    </div>
                )}
                
                {node.type === 'action' && (
                    <div className="text-xs bg-green-50 p-2 rounded-none">
                        <p className="font-medium">Action:</p>
                        <p className="text-muted-foreground">{node.data.action}</p>
                    </div>
                )}
                
                {node.type === 'input' && (
                    <div className="text-xs bg-blue-50 p-2 rounded-none">
                        <p className="font-medium">Fields:</p>
                        <p className="text-muted-foreground">{node.data.fields.join(', ')}</p>
                    </div>
                )}
                
                {node.type === 'output' && (
                    <div className="text-xs bg-red-50 p-2 rounded-none">
                        <p className="font-medium">Output:</p>
                        <p className="text-muted-foreground">{node.data.output}</p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">API Logic Designer</h2>
                    <p className="text-muted-foreground">
                        Build custom logic flows using our no-code interface
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-none">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                    <Button variant="outline" className="rounded-none">
                        <Play className="w-4 h-4 mr-2" />
                        Test
                    </Button>
                    <Button className="rounded-none">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Node
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Node Palette */}
                <Card className="rounded-none lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Components</CardTitle>
                        <CardDescription>Drag components to build your logic</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {nodeTypes.map((nodeType) => (
                                <div
                                    key={nodeType.type}
                                    className="flex items-center gap-3 p-3 border rounded-none cursor-move hover:bg-gray-50"
                                    draggable
                                >
                                    <div className={`p-2 rounded-none ${nodeType.color}`}>
                                        <nodeType.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{nodeType.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {nodeType.type} component
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Canvas */}
                <Card className="rounded-none lg:col-span-3">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Logic Flow Canvas</CardTitle>
                                <CardDescription>
                                    Design your API logic by connecting components
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="rounded-none">
                                    <Maximize2 className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-none">
                                    <RotateCcw className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div
                            ref={canvasRef}
                            className="relative w-full h-[600px] border-2 border-dashed border-gray-300 rounded-none bg-gray-50 overflow-hidden"
                            onMouseMove={handleNodeDrag}
                            onMouseUp={handleNodeDragEnd}
                        >
                            {/* Grid background */}
                            <div className="absolute inset-0 opacity-20">
                                <svg width="100%" height="100%">
                                    <defs>
                                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="1"/>
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                </svg>
                            </div>

                            {/* Render nodes */}
                            {logicFlows[0]?.nodes.map(renderNode)}

                            {/* Connection lines */}
                            <svg className="absolute inset-0 pointer-events-none">
                                {logicFlows[0]?.nodes.map((node) =>
                                    node.connections.map((connectionId) => {
                                        const targetNode = logicFlows[0].nodes.find(n => n.id === connectionId)
                                        if (!targetNode) return null

                                        const startX = node.position.x + 200
                                        const startY = node.position.y + 50
                                        const endX = targetNode.position.x
                                        const endY = targetNode.position.y + 50

                                        return (
                                            <line
                                                key={`${node.id}-${connectionId}`}
                                                x1={startX}
                                                y1={startY}
                                                x2={endX}
                                                y2={endY}
                                                stroke="#3b82f6"
                                                strokeWidth="2"
                                                markerEnd="url(#arrowhead)"
                                            />
                                        )
                                    })
                                )}
                                <defs>
                                    <marker
                                        id="arrowhead"
                                        markerWidth="10"
                                        markerHeight="7"
                                        refX="9"
                                        refY="3.5"
                                        orient="auto"
                                    >
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                                    </marker>
                                </defs>
                            </svg>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Logic Flow List */}
            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle>Saved Logic Flows</CardTitle>
                    <CardDescription>Manage your saved logic flows</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {logicFlows.map((flow) => (
                            <div key={flow.id} className="flex items-center justify-between p-4 border rounded-none">
                                <div className="flex items-center gap-3">
                                    <Workflow className="w-8 h-8 text-blue-500" />
                                    <div>
                                        <p className="font-medium">{flow.name}</p>
                                        <p className="text-sm text-muted-foreground">{flow.description}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {flow.nodes.length} nodes • v{flow.version} • {flow.createdAt}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge 
                                        variant="secondary" 
                                        className={`rounded-none ${
                                            flow.isActive ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'
                                        }`}
                                    >
                                        {flow.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                    <Button variant="ghost" size="sm" className="rounded-none">
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="rounded-none">
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="rounded-none">
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 