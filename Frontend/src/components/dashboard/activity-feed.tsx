'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ReactNode } from "react"

interface ActivityItem {
    id: number
    type: string
    title: string
    description: string
    timestamp: string
    status: 'success' | 'info' | 'warning' | 'error'
    icon: ReactNode
}

interface ActivityFeedProps {
    activities: ActivityItem[]
    title?: string
    description?: string
    maxItems?: number
}

export function ActivityFeed({ 
    activities, 
    title = "Recent Activity", 
    description = "Latest updates and events",
    maxItems = 5 
}: ActivityFeedProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'text-green-600'
            case 'info':
                return 'text-blue-600'
            case 'warning':
                return 'text-yellow-600'
            case 'error':
                return 'text-red-600'
            default:
                return 'text-gray-600'
        }
    }

    const displayedActivities = activities.slice(0, maxItems)

    return (
        <Card className="rounded-none">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {displayedActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                            <div className="mt-1">
                                {activity.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{activity.title}</p>
                                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                                <div className="mt-2">
                                    <Badge 
                                        variant="secondary" 
                                        className={`text-xs ${getStatusColor(activity.status)}`}
                                    >
                                        {activity.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {activities.length > maxItems && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground text-center">
                            Showing {maxItems} of {activities.length} activities
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
} 