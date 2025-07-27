'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
    Database, 
    RefreshCw, 
    Download, 
    Eye, 
    AlertTriangle, 
    CheckCircle, 
    XCircle,
    FileSpreadsheet,
    FileJson,
    FileCode,
    Sparkles,
    Zap,
    Target,
    Filter,
    Scissors,
    RotateCcw,
    Save,
    Play,
    Pause,
    Settings
} from "lucide-react"
import { toast } from "sonner"

interface DataIssue {
    id: string
    type: 'missing' | 'outlier' | 'format' | 'duplicate'
    column: string
    row: number
    value: string
    severity: 'low' | 'medium' | 'high'
    suggestedFix: string
    fixed: boolean
}

interface CleaningRule {
    id: string
    name: string
    description: string
    enabled: boolean
    type: 'missing' | 'outlier' | 'format' | 'duplicate'
    action: 'remove' | 'fill' | 'transform' | 'flag'
}

export default function DataCleaning() {
    const [isCleaning, setIsCleaning] = useState(false)
    const [cleaningProgress, setCleaningProgress] = useState(0)
    const [selectedIssues, setSelectedIssues] = useState<string[]>([])
    const [previewMode, setPreviewMode] = useState<'before' | 'after'>('before')

    // Mock data issues
    const dataIssues: DataIssue[] = [
        {
            id: "1",
            type: "missing",
            column: "email",
            row: 15,
            value: "",
            severity: "high",
            suggestedFix: "Remove row",
            fixed: false
        },
        {
            id: "2",
            type: "outlier",
            column: "age",
            row: 23,
            value: "150",
            severity: "medium",
            suggestedFix: "Replace with median (32)",
            fixed: false
        },
        {
            id: "3",
            type: "format",
            column: "phone",
            row: 7,
            value: "123-456-7890",
            severity: "low",
            suggestedFix: "Standardize format",
            fixed: false
        },
        {
            id: "4",
            type: "duplicate",
            column: "customer_id",
            row: 12,
            value: "CUST001",
            severity: "high",
            suggestedFix: "Remove duplicate",
            fixed: false
        }
    ]

    // Mock cleaning rules
    const cleaningRules: CleaningRule[] = [
        {
            id: "1",
            name: "Remove rows with missing emails",
            description: "Delete rows where email field is empty",
            enabled: true,
            type: "missing",
            action: "remove"
        },
        {
            id: "2",
            name: "Fill missing ages with median",
            description: "Replace missing age values with median age",
            enabled: true,
            type: "missing",
            action: "fill"
        },
        {
            id: "3",
            name: "Remove outliers (3σ rule)",
            description: "Remove values beyond 3 standard deviations",
            enabled: false,
            type: "outlier",
            action: "remove"
        },
        {
            id: "4",
            name: "Standardize phone format",
            description: "Convert all phone numbers to (XXX) XXX-XXXX",
            enabled: true,
            type: "format",
            action: "transform"
        }
    ]

    const handleStartCleaning = async () => {
        setIsCleaning(true)
        setCleaningProgress(0)
        
        // Simulate cleaning process
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(resolve => setTimeout(resolve, 200))
            setCleaningProgress(i)
        }
        
        setIsCleaning(false)
        toast.success("Data cleaning completed successfully!")
    }

    const handleDownloadCleanedData = async (format: string) => {
        toast.success(`Downloading cleaned data as ${format.toUpperCase()}`)
    }

    const getIssueIcon = (type: string) => {
        switch (type) {
            case "missing":
                return <XCircle className="w-4 h-4 text-red-500" />
            case "outlier":
                return <AlertTriangle className="w-4 h-4 text-yellow-500" />
            case "format":
                return <FileCode className="w-4 h-4 text-blue-500" />
            case "duplicate":
                return <Copy className="w-4 h-4 text-purple-500" />
            default:
                return <AlertTriangle className="w-4 h-4" />
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high":
                return "text-red-700 bg-red-100"
            case "medium":
                return "text-yellow-700 bg-yellow-100"
            case "low":
                return "text-blue-700 bg-blue-100"
            default:
                return "text-gray-700 bg-gray-100"
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Data Cleaning & Export</h2>
                    <p className="text-muted-foreground">
                        Automatically detect and fix data quality issues
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-none">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                    <Button 
                        onClick={handleStartCleaning}
                        disabled={isCleaning}
                        className="rounded-none"
                    >
                        {isCleaning ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Cleaning...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Start Cleaning
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Cleaning Progress */}
            {isCleaning && (
                <Card className="rounded-none">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Cleaning Progress</span>
                                <span className="text-sm text-muted-foreground">{cleaningProgress}%</span>
                            </div>
                            <Progress value={cleaningProgress} className="h-2" />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Processing data quality issues...
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Data Issues */}
                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Detected Issues
                        </CardTitle>
                        <CardDescription>
                            {dataIssues.length} issues found in your dataset
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {dataIssues.map((issue) => (
                                <div 
                                    key={issue.id} 
                                    className={`flex items-center justify-between p-3 border rounded-none ${
                                        issue.fixed ? 'bg-green-50 border-green-200' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {getIssueIcon(issue.type)}
                                        <div>
                                            <p className="font-medium text-sm">
                                                {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)} in {issue.column}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Row {issue.row} • {issue.suggestedFix}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge 
                                            variant="secondary" 
                                            className={`rounded-none ${getSeverityColor(issue.severity)}`}
                                        >
                                            {issue.severity}
                                        </Badge>
                                        {issue.fixed && (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Cleaning Rules */}
                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5" />
                            Cleaning Rules
                        </CardTitle>
                        <CardDescription>
                            Configure automatic data cleaning rules
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {cleaningRules.map((rule) => (
                                <div key={rule.id} className="flex items-center justify-between p-3 border rounded-none">
                                    <div className="flex items-center gap-3">
                                        <Switch 
                                            checked={rule.enabled}
                                            onCheckedChange={() => {}}
                                        />
                                        <div>
                                            <p className="font-medium text-sm">{rule.name}</p>
                                            <p className="text-xs text-muted-foreground">{rule.description}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="rounded-none">
                                        {rule.action}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Data Preview */}
            <Card className="rounded-none">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Data Preview</CardTitle>
                            <CardDescription>
                                Preview your data before and after cleaning
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={previewMode === 'before' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPreviewMode('before')}
                                className="rounded-none"
                            >
                                Before Cleaning
                            </Button>
                            <Button
                                variant={previewMode === 'after' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setPreviewMode('after')}
                                className="rounded-none"
                            >
                                After Cleaning
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-2">ID</th>
                                    <th className="text-left p-2">Name</th>
                                    <th className="text-left p-2">Email</th>
                                    <th className="text-left p-2">Age</th>
                                    <th className="text-left p-2">Phone</th>
                                    <th className="text-left p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="p-2">1</td>
                                    <td className="p-2">John Doe</td>
                                    <td className="p-2">john@example.com</td>
                                    <td className="p-2">30</td>
                                    <td className="p-2">(555) 123-4567</td>
                                    <td className="p-2">
                                        <Badge variant="outline" className="rounded-none">Active</Badge>
                                    </td>
                                </tr>
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="p-2">2</td>
                                    <td className="p-2">Jane Smith</td>
                                    <td className="p-2">jane@example.com</td>
                                    <td className="p-2">25</td>
                                    <td className="p-2">(555) 987-6543</td>
                                    <td className="p-2">
                                        <Badge variant="outline" className="rounded-none">Active</Badge>
                                    </td>
                                </tr>
                                <tr className="border-b hover:bg-gray-50">
                                    <td className="p-2">3</td>
                                    <td className="p-2">Bob Johnson</td>
                                    <td className="p-2">bob@example.com</td>
                                    <td className="p-2">35</td>
                                    <td className="p-2">(555) 456-7890</td>
                                    <td className="p-2">
                                        <Badge variant="outline" className="rounded-none">Inactive</Badge>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Export Options */}
            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        Export Cleaned Data
                    </CardTitle>
                    <CardDescription>
                        Download your cleaned dataset in various formats
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button 
                            variant="outline" 
                            className="rounded-none h-20 flex-col"
                            onClick={() => handleDownloadCleanedData('csv')}
                        >
                            <FileSpreadsheet className="w-6 h-6 mb-2" />
                            <span className="text-sm">CSV</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            className="rounded-none h-20 flex-col"
                            onClick={() => handleDownloadCleanedData('excel')}
                        >
                            <FileSpreadsheet className="w-6 h-6 mb-2" />
                            <span className="text-sm">Excel</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            className="rounded-none h-20 flex-col"
                            onClick={() => handleDownloadCleanedData('json')}
                        >
                            <FileJson className="w-6 h-6 mb-2" />
                            <span className="text-sm">JSON</span>
                        </Button>
                        <Button 
                            variant="outline" 
                            className="rounded-none h-20 flex-col"
                            onClick={() => handleDownloadCleanedData('parquet')}
                        >
                            <Database className="w-6 h-6 mb-2" />
                            <span className="text-sm">Parquet</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 