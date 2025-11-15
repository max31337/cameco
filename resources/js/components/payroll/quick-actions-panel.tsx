import { type QuickAction } from '@/types/payroll-pages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    PlusCircle,
    Upload,
    FileCheck,
    Download,
    Settings,
    AlertCircle,
    TrendingUp,
    CheckCircle,
    Clock,
    GitCompare,
    type LucideIcon,
} from 'lucide-react';

interface QuickActionsPanelProps {
    actions: QuickAction[];
}

/**
 * Map icon names to Lucide React icon components
 * Supports icon names in kebab-case and camelCase
 */
const iconMap: Record<string, LucideIcon> = {
    'plus-circle': PlusCircle,
    'plusCircle': PlusCircle,
    'upload': Upload,
    'file-check': FileCheck,
    'fileCheck': FileCheck,
    'download': Download,
    'settings': Settings,
    'alert-circle': AlertCircle,
    'alertCircle': AlertCircle,
    'trending-up': TrendingUp,
    'trendingUp': TrendingUp,
    'check-circle': CheckCircle,
    'checkCircle': CheckCircle,
    'clock': Clock,
    'git-compare': GitCompare,
    'gitCompare': GitCompare,
};

export function QuickActionsPanel({ actions }: QuickActionsPanelProps) {
    /**
     * Get category-based color styling for action buttons
     * Helps users visually identify action types at a glance
     */
    const getActionColor = (category: QuickAction['category']) => {
        switch (category) {
            case 'processing':
                return 'text-blue-600 hover:bg-blue-50 border-blue-200';
            case 'compliance':
                return 'text-red-600 hover:bg-red-50 border-red-200';
            case 'reporting':
                return 'text-green-600 hover:bg-green-50 border-green-200';
            case 'admin':
                return 'text-purple-600 hover:bg-purple-50 border-purple-200';
            default:
                return 'text-gray-600 hover:bg-gray-50 border-gray-200';
        }
    };

    /**
     * Get category label for accessibility and tooltips
     */
    const getCategoryLabel = (category: QuickAction['category']): string => {
        const labels: Record<QuickAction['category'], string> = {
            processing: 'Payroll Processing',
            compliance: 'Compliance',
            reporting: 'Reporting',
            admin: 'Administration',
        };
        return labels[category] || 'Action';
    };

    /**
     * Empty state when no actions are available
     */
    if (actions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common payroll operations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                        <p className="text-muted-foreground">No quick actions available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common payroll operations and workflows</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {actions.map((action) => {
                        // Get the icon component, defaulting to AlertCircle if not found
                        const IconComponent = iconMap[action.icon] || iconMap['alert-circle'] || AlertCircle;
                        const colorClass = getActionColor(action.category);
                        const categoryLabel = getCategoryLabel(action.category);

                        return (
                            <div key={action.id} className="relative">
                                <Button
                                    variant="outline"
                                    disabled={action.disabled}
                                    className={`flex flex-col h-auto py-4 px-3 w-full ${colorClass} transition-all duration-200 ${
                                        action.disabled ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    title={`${action.description} (${categoryLabel})`}
                                    onClick={() => {
                                        // Action handler - can be extended for navigation
                                        if (!action.disabled && action.url) {
                                            window.location.href = action.url;
                                        }
                                    }}
                                >
                                    <IconComponent className="h-6 w-6 mb-2 flex-shrink-0" />
                                    <span className="text-xs text-center font-medium break-words line-clamp-2">
                                        {action.label}
                                    </span>
                                </Button>

                                {/* Badge for special action status */}
                                {action.badge && (
                                    <Badge
                                        variant="secondary"
                                        className="absolute -top-2 -right-2 text-xs px-2 py-1"
                                    >
                                        {action.badge}
                                    </Badge>
                                )}

                                {/* Keyboard shortcut hint for power users */}
                                {action.keyboard_shortcut && (
                                    <div className="text-xs text-muted-foreground text-center mt-1">
                                        {action.keyboard_shortcut}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Informational tip section */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex gap-3">
                        <Clock className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-900">
                            <strong>Tip:</strong> Use quick actions to streamline your daily payroll tasks. Many
                            actions support keyboard shortcuts for faster access.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
