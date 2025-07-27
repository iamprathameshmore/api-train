'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, LineChart, PieChart, TrendingUp, TrendingDown } from "lucide-react"

interface PerformanceMetric {
    name: string
    current: number
    previous: number
    change: number
    unit: string
    trend: 'up' | 'down' | 'stable'
}

interface PerformanceMetricsProps {
    metrics: {
        responseTime: PerformanceMetric
        requests: PerformanceMetric
        uptime: PerformanceMetric
        errors: PerformanceMetric
    }
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp className="w-4 h-4 text-green-500" />
            case 'down':
                return <TrendingDown className="w-4 h-4 text-red-500" />
            default:
                return <div className="w-4 h-4" />
        }
    }

    const getChangeColor = (change: number) => {
        return change >= 0 ? 'text-green-600' : 'text-red-600'
    }

    const formatValue = (value: number, unit: string) => {
        if (unit === 'requests') {
            return `${(value / 1000000).toFixed(1)}M`
        }
        if (unit === 'percentage') {
            return `${value}%`
        }
        if (unit === 'milliseconds') {
            return `${value}ms`
        }
        return value.toString()
    }

    return (
        <Card className="rounded-none">
            <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Detailed performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {getTrendIcon(metrics.responseTime.trend)}
                            <div className="text-2xl font-bold text-blue-600">
                                {formatValue(metrics.responseTime.current, metrics.responseTime.unit)}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Avg Response Time</p>
                        <p className={`text-xs ${getChangeColor(metrics.responseTime.change)}`}>
                            {metrics.responseTime.change >= 0 ? '+' : ''}{metrics.responseTime.change}% from last week
                        </p>
                    </div>
                    
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {getTrendIcon(metrics.requests.trend)}
                            <div className="text-2xl font-bold text-green-600">
                                {formatValue(metrics.requests.current, metrics.requests.unit)}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Total Requests</p>
                        <p className={`text-xs ${getChangeColor(metrics.requests.change)}`}>
                            {metrics.requests.change >= 0 ? '+' : ''}{metrics.requests.change}% from last week
                        </p>
                    </div>
                    
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {getTrendIcon(metrics.uptime.trend)}
                            <div className="text-2xl font-bold text-green-600">
                                {formatValue(metrics.uptime.current, metrics.uptime.unit)}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                        <p className={`text-xs ${getChangeColor(metrics.uptime.change)}`}>
                            {metrics.uptime.change >= 0 ? '+' : ''}{metrics.uptime.change}% from last week
                        </p>
                    </div>
                    
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            {getTrendIcon(metrics.errors.trend)}
                            <div className="text-2xl font-bold text-green-600">
                                {formatValue(metrics.errors.current, metrics.errors.unit)}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">Error Rate</p>
                        <p className={`text-xs ${getChangeColor(metrics.errors.change)}`}>
                            {metrics.errors.change}% from last week
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

interface ChartPlaceholderProps {
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    type: 'line' | 'bar' | 'pie'
}

export function ChartPlaceholder({ title, description, icon: Icon, type }: ChartPlaceholderProps) {
    const getChartIcon = () => {
        switch (type) {
            case 'line':
                return <LineChart className="w-12 h-12" />
            case 'bar':
                return <BarChart3 className="w-12 h-12" />
            case 'pie':
                return <PieChart className="w-12 h-12" />
            default:
                return <Icon className="w-12 h-12" />
        }
    }

    return (
        <Card className="rounded-none">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-none">
                    <div className="text-center">
                        {getChartIcon()}
                        <p className="mt-2">{title}</p>
                        <p className="text-sm">{description}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 