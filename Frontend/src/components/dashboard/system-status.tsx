'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Clock, XCircle } from "lucide-react"

interface SystemStatus {
    id: string
    name: string
    status: 'operational' | 'degraded' | 'outage' | 'maintenance'
    description: string
    timestamp: string
    icon: React.ReactNode
}

interface SystemStatusProps {
    statuses: SystemStatus[]
    title?: string
    description?: string
}

export function SystemStatus({ 
    statuses, 
    title = "System Status", 
    description = "Current system health and alerts" 
}: SystemStatusProps) {
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'operational':
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case 'degraded':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />
            case 'outage':
                return <XCircle className="w-5 h-5 text-red-500" />
            case 'maintenance':
                return <Clock className="w-5 h-5 text-blue-500" />
            default:
                return <CheckCircle className="w-5 h-5 text-green-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'operational':
                return <Badge className="bg-green-100 text-green-800">Operational</Badge>
            case 'degraded':
                return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
            case 'outage':
                return <Badge className="bg-red-100 text-red-800">Outage</Badge>
            case 'maintenance':
                return <Badge variant="outline">Maintenance</Badge>
            default:
                return <Badge className="bg-green-100 text-green-800">Operational</Badge>
        }
    }

    const getOverallStatus = () => {
        const hasOutage = statuses.some(s => s.status === 'outage')
        const hasDegraded = statuses.some(s => s.status === 'degraded')
        
        if (hasOutage) return 'outage'
        if (hasDegraded) return 'degraded'
        return 'operational'
    }

    const overallStatus = getOverallStatus()

    return (
        <Card className="rounded-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusIcon(overallStatus)}
                        {getStatusBadge(overallStatus)}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {statuses.map((status) => (
                        <div key={status.id} className="flex items-center justify-between p-3 border rounded-none">
                            <div className="flex items-center space-x-3">
                                {getStatusIcon(status.status)}
                                <div>
                                    <p className="font-medium">{status.name}</p>
                                    <p className="text-sm text-muted-foreground">{status.description}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground">{status.timestamp}</p>
                                {getStatusBadge(status.status)}
                            </div>
                        </div>
                    ))}
                </div>
                
                {overallStatus === 'operational' && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-none">
                        <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">All systems are operational</span>
                        </div>
                        <p className="text-xs text-green-600 mt-1">No active incidents or maintenance windows</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 