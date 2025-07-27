'use client'

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PageWrapper from "@/components/page-wrapper"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
    Activity, 
    Users, 
    Code, 
    Globe, 
    TrendingUp, 
    TrendingDown,
    Clock,
    AlertTriangle,
    CheckCircle,
    Zap,
    Database,
    Shield,
    Settings,
    Plus,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Play,
    Pause,
    RefreshCw,
    BarChart3,
    LineChart,
    PieChart,
    Calendar,
    Bell,
    Star,
    Download,
    Upload,
    GitBranch,
    GitCommit,
    GitPullRequest,
    MessageSquare,
    Mail,
    Phone,
    MapPin,
    ExternalLink
} from "lucide-react"
import { toast } from "sonner"

export default function HomePage() {
    const [activeTab, setActiveTab] = useState("overview")
    const [isLoading, setIsLoading] = useState(false)

    // Mock data - replace with real API calls
    const dashboardData = {
        user: {
            name: "Prathamesh More",
            email: "prathamesh@example.com",
            avatar: "https://i.pravatar.cc/150?img=12",
            plan: "Pro",
            status: "Active"
        },
        stats: {
            totalApis: 8,
            activeApis: 6,
            totalRequests: 1250000,
            avgResponseTime: 245,
            uptime: 99.9,
            teamMembers: 12,
            pendingInvites: 3,
            totalRevenue: 2495,
            monthlyGrowth: 12.5
        },
        recentActivity: [
            {
                id: 1,
                type: "api_deployed",
                title: "User Management API deployed",
                description: "Version 2.1.0 successfully deployed to production",
                timestamp: "2 hours ago",
                status: "success",
                icon: <Zap className="w-4 h-4 text-green-500" />
            },
            {
                id: 2,
                type: "team_invite",
                title: "New team member invited",
                description: "John Doe invited to User Management API team",
                timestamp: "4 hours ago",
                status: "info",
                icon: <Users className="w-4 h-4 text-blue-500" />
            },
            {
                id: 3,
                type: "api_updated",
                title: "Payment API updated",
                description: "New endpoint added: POST /payments/bulk",
                timestamp: "1 day ago",
                status: "success",
                icon: <Code className="w-4 h-4 text-purple-500" />
            },
            {
                id: 4,
                type: "alert",
                title: "Performance alert",
                description: "Response time increased by 15% on Auth API",
                timestamp: "2 days ago",
                status: "warning",
                icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />
            }
        ],
        topApis: [
            {
                id: 1,
                name: "User Management API",
                requests: 450000,
                responseTime: 180,
                uptime: 99.9,
                status: "Active",
                growth: 8.2
            },
            {
                id: 2,
                name: "Payment Processing API",
                requests: 320000,
                responseTime: 220,
                uptime: 99.8,
                status: "Active",
                growth: 12.5
            },
            {
                id: 3,
                name: "Authentication API",
                requests: 280000,
                responseTime: 150,
                uptime: 99.9,
                status: "Active",
                growth: 5.8
            }
        ],
        teamActivity: [
            {
                id: 1,
                name: "John Doe",
                avatar: "https://i.pravatar.cc/150?img=1",
                action: "Deployed User Management API",
                timestamp: "2 hours ago",
                status: "success"
            },
            {
                id: 2,
                name: "Jane Smith",
                avatar: "https://i.pravatar.cc/150?img=2",
                action: "Updated Payment API documentation",
                timestamp: "4 hours ago",
                status: "info"
            },
            {
                id: 3,
                name: "Mike Johnson",
                avatar: "https://i.pravatar.cc/150?img=3",
                action: "Fixed authentication bug",
                timestamp: "1 day ago",
                status: "success"
            }
        ],
        performanceMetrics: {
            responseTime: {
                current: 245,
                previous: 220,
                change: 11.4
            },
            requests: {
                current: 1250000,
                previous: 1100000,
                change: 13.6
            },
            uptime: {
                current: 99.9,
                previous: 99.8,
                change: 0.1
            },
            errors: {
                current: 0.02,
                previous: 0.05,
                change: -60
            }
        }
    }

    const handleQuickAction = (action: string) => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => {
            toast.success(`${action} action completed successfully!`)
            setIsLoading(false)
        }, 1000)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "text-green-700 bg-green-100"
            case "Inactive":
                return "text-red-700 bg-red-100"
            case "Maintenance":
                return "text-yellow-700 bg-yellow-100"
            default:
                return "text-gray-700 bg-gray-100"
        }
    }

    const getGrowthIcon = (growth: number) => {
        return growth >= 0 ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
        ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
        )
    }

    return (
        <PageWrapper 
            title="Overview" 
            subtitle="Welcome back! Here's what's happening with your APIs and team."
            actions={
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-none">
                        <Download className="w-4 h-4 mr-2" />
                        Export Report
                    </Button>
                    <Button className="rounded-none">
                        <Plus className="w-4 h-4 mr-2" />
                        Create API
                    </Button>
                </div>
            }
        >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 rounded-none">
                    <TabsTrigger value="overview" className="rounded-none">Overview</TabsTrigger>
                    <TabsTrigger value="analytics" className="rounded-none">Analytics</TabsTrigger>
                    <TabsTrigger value="team" className="rounded-none">Team</TabsTrigger>
                    <TabsTrigger value="activity" className="rounded-none">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total APIs</CardTitle>
                                <Code className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardData.stats.totalApis}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+2</span> from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{(dashboardData.stats.totalRequests / 1000000).toFixed(1)}M</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+{dashboardData.stats.monthlyGrowth}%</span> from last month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardData.stats.avgResponseTime}ms</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-red-600">+{dashboardData.performanceMetrics.responseTime.change}%</span> from last week
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardData.stats.uptime}%</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+{dashboardData.performanceMetrics.uptime.change}%</span> from last week
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="rounded-none lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Performance Overview</CardTitle>
                                <CardDescription>API performance metrics over the last 30 days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-none">
                                    <div className="text-center">
                                        <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                                        <p>Performance Chart</p>
                                        <p className="text-sm">Response time, requests, and error rate trends</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common tasks and shortcuts</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start rounded-none"
                                    onClick={() => handleQuickAction("Create new API")}
                                    disabled={isLoading}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create API
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start rounded-none"
                                    onClick={() => handleQuickAction("Invite team member")}
                                    disabled={isLoading}
                                >
                                    <Users className="w-4 h-4 mr-2" />
                                    Invite Member
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start rounded-none"
                                    onClick={() => handleQuickAction("View analytics")}
                                    disabled={isLoading}
                                >
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    View Analytics
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start rounded-none"
                                    onClick={() => handleQuickAction("Check billing")}
                                    disabled={isLoading}
                                >
                                    <Globe className="w-4 h-4 mr-2" />
                                    Check Billing
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Top APIs and Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Top Performing APIs</CardTitle>
                                <CardDescription>Most active APIs by request volume</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {dashboardData.topApis.map((api) => (
                                        <div key={api.id} className="flex items-center justify-between p-3 border rounded-none">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <div>
                                                    <p className="font-medium">{api.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {(api.requests / 1000).toFixed(0)}K requests
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-1">
                                                    {getGrowthIcon(api.growth)}
                                                    <span className="text-sm font-medium">{api.growth}%</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{api.responseTime}ms</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Latest updates and events</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {dashboardData.recentActivity.map((activity) => (
                                        <div key={activity.id} className="flex items-start space-x-3">
                                            <div className="mt-1">
                                                {activity.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{activity.title}</p>
                                                <p className="text-xs text-muted-foreground">{activity.description}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    {/* Analytics Dashboard */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Request Volume</CardTitle>
                                <CardDescription>API requests over time</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-none">
                                    <div className="text-center">
                                        <LineChart className="w-12 h-12 mx-auto mb-2" />
                                        <p>Request Volume Chart</p>
                                        <p className="text-sm">Daily, weekly, and monthly trends</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Response Time Distribution</CardTitle>
                                <CardDescription>Performance across all APIs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-none">
                                    <div className="text-center">
                                        <PieChart className="w-12 h-12 mx-auto mb-2" />
                                        <p>Response Time Chart</p>
                                        <p className="text-sm">Distribution by API and endpoint</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Metrics */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Performance Metrics</CardTitle>
                            <CardDescription>Detailed performance analysis</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {dashboardData.performanceMetrics.responseTime.current}ms
                                    </div>
                                    <p className="text-sm text-muted-foreground">Avg Response Time</p>
                                    <p className="text-xs text-red-600">
                                        +{dashboardData.performanceMetrics.responseTime.change}% from last week
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {(dashboardData.performanceMetrics.requests.current / 1000000).toFixed(1)}M
                                    </div>
                                    <p className="text-sm text-muted-foreground">Total Requests</p>
                                    <p className="text-xs text-green-600">
                                        +{dashboardData.performanceMetrics.requests.change}% from last week
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {dashboardData.performanceMetrics.uptime.current}%
                                    </div>
                                    <p className="text-sm text-muted-foreground">Uptime</p>
                                    <p className="text-xs text-green-600">
                                        +{dashboardData.performanceMetrics.uptime.change}% from last week
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {dashboardData.performanceMetrics.errors.current}%
                                    </div>
                                    <p className="text-sm text-muted-foreground">Error Rate</p>
                                    <p className="text-xs text-green-600">
                                        {dashboardData.performanceMetrics.errors.change}% from last week
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="team" className="space-y-6">
                    {/* Team Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Team Members</CardTitle>
                                <CardDescription>Active team members</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardData.stats.teamMembers}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">+3</span> new members this month
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Pending Invites</CardTitle>
                                <CardDescription>Awaiting response</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardData.stats.pendingInvites}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-yellow-600">2</span> expiring soon
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-none">
                            <CardHeader>
                                <CardTitle>Active APIs</CardTitle>
                                <CardDescription>Currently running</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardData.stats.activeApis}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-600">100%</span> operational
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Team Activity */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Recent Team Activity</CardTitle>
                            <CardDescription>What your team has been working on</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {dashboardData.teamActivity.map((member) => (
                                    <div key={member.id} className="flex items-center space-x-3">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={member.avatar} />
                                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{member.name}</p>
                                            <p className="text-xs text-muted-foreground">{member.action}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">{member.timestamp}</p>
                                            <Badge variant="secondary" className="text-xs">
                                                {member.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                    {/* Activity Feed */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>Activity Feed</CardTitle>
                            <CardDescription>Complete timeline of all activities</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {dashboardData.recentActivity.map((activity, index) => (
                                    <div key={activity.id} className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                {activity.icon}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">{activity.title}</p>
                                                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Status */}
                    <Card className="rounded-none">
                        <CardHeader>
                            <CardTitle>System Status</CardTitle>
                            <CardDescription>Current system health and alerts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 border rounded-none">
                                    <div className="flex items-center space-x-3">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <div>
                                            <p className="font-medium">All Systems Operational</p>
                                            <p className="text-sm text-muted-foreground">No active incidents</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-none">
                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="font-medium">Scheduled Maintenance</p>
                                            <p className="text-sm text-muted-foreground">Planned for tomorrow 2-4 AM</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline">Scheduled</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </PageWrapper>
    )
}
