'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
    title: string
    value: string | number
    change?: string
    changeType?: 'positive' | 'negative' | 'neutral'
    icon: LucideIcon
    description?: string
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, description }: StatCardProps) {
    const getChangeColor = () => {
        switch (changeType) {
            case 'positive':
                return 'text-green-600'
            case 'negative':
                return 'text-red-600'
            default:
                return 'text-muted-foreground'
        }
    }

    return (
        <Card className="rounded-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {change && (
                    <p className={`text-xs ${getChangeColor()}`}>
                        {change}
                    </p>
                )}
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

interface OverviewStatsProps {
    stats: {
        totalApis: number
        activeApis: number
        totalRequests: number
        avgResponseTime: number
        uptime: number
        teamMembers: number
        pendingInvites: number
        totalRevenue: number
        monthlyGrowth: number
    }
}

export function OverviewStats({ stats }: OverviewStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total APIs"
                value={stats.totalApis}
                change="+2 from last month"
                changeType="positive"
                icon={require('lucide-react').Code}
            />
            <StatCard
                title="Total Requests"
                value={`${(stats.totalRequests / 1000000).toFixed(1)}M`}
                change={`+${stats.monthlyGrowth}% from last month`}
                changeType="positive"
                icon={require('lucide-react').Activity}
            />
            <StatCard
                title="Avg Response Time"
                value={`${stats.avgResponseTime}ms`}
                change="+11.4% from last week"
                changeType="negative"
                icon={require('lucide-react').Clock}
            />
            <StatCard
                title="Uptime"
                value={`${stats.uptime}%`}
                change="+0.1% from last week"
                changeType="positive"
                icon={require('lucide-react').CheckCircle}
            />
        </div>
    )
} 