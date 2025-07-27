'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
    Plus, 
    Users, 
    BarChart3, 
    Globe, 
    Settings, 
    Download,
    Upload,
    GitBranch,
    MessageSquare,
    Bell
} from "lucide-react"

interface QuickAction {
    id: string
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    action: () => void
    variant?: 'default' | 'outline' | 'secondary'
}

interface QuickActionsProps {
    onAction: (action: string) => void
    isLoading?: boolean
}

export function QuickActions({ onAction, isLoading = false }: QuickActionsProps) {
    const actions: QuickAction[] = [
        {
            id: 'create-api',
            title: 'Create API',
            description: 'Start building a new API',
            icon: Plus,
            action: () => onAction('Create new API'),
            variant: 'default'
        },
        {
            id: 'invite-member',
            title: 'Invite Member',
            description: 'Add team members to your project',
            icon: Users,
            action: () => onAction('Invite team member'),
            variant: 'outline'
        },
        {
            id: 'view-analytics',
            title: 'View Analytics',
            description: 'Check performance metrics',
            icon: BarChart3,
            action: () => onAction('View analytics'),
            variant: 'outline'
        },
        {
            id: 'check-billing',
            title: 'Check Billing',
            description: 'Review usage and payments',
            icon: Globe,
            action: () => onAction('Check billing'),
            variant: 'outline'
        },
        {
            id: 'export-data',
            title: 'Export Data',
            description: 'Download reports and data',
            icon: Download,
            action: () => onAction('Export data'),
            variant: 'outline'
        },
        {
            id: 'settings',
            title: 'Settings',
            description: 'Configure your workspace',
            icon: Settings,
            action: () => onAction('Open settings'),
            variant: 'outline'
        }
    ]

    return (
        <Card className="rounded-none">
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {actions.map((action) => (
                    <Button 
                        key={action.id}
                        variant={action.variant}
                        className="w-full justify-start rounded-none"
                        onClick={action.action}
                        disabled={isLoading}
                    >
                        <action.icon className="w-4 h-4 mr-2" />
                        <div className="text-left">
                            <div className="font-medium">{action.title}</div>
                            <div className="text-xs opacity-70">{action.description}</div>
                        </div>
                    </Button>
                ))}
            </CardContent>
        </Card>
    )
} 