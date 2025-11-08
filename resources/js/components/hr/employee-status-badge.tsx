import { Badge } from '@/components/ui/badge';
import { 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    Clock, 
    Ban 
} from 'lucide-react';

// ============================================================================
// Type Definitions
// ============================================================================

type EmployeeStatus = 'active' | 'on_leave' | 'terminated' | 'archived' | 'suspended';

interface EmployeeStatusBadgeProps {
    status: EmployeeStatus;
    className?: string;
}

// ============================================================================
// Status Configuration
// ============================================================================

const statusConfig: Record<EmployeeStatus, {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
    icon: React.ComponentType<{ className?: string }>;
    className: string;
}> = {
    active: {
        label: 'Active',
        variant: 'default',
        icon: CheckCircle2,
        className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800',
    },
    on_leave: {
        label: 'On Leave',
        variant: 'secondary',
        icon: Clock,
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    },
    terminated: {
        label: 'Terminated',
        variant: 'destructive',
        icon: XCircle,
        className: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800',
    },
    archived: {
        label: 'Archived',
        variant: 'outline',
        icon: Ban,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800',
    },
    suspended: {
        label: 'Suspended',
        variant: 'outline',
        icon: AlertCircle,
        className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    },
};

// ============================================================================
// Component
// ============================================================================

export function EmployeeStatusBadge({ status, className = '' }: EmployeeStatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.active;
    const Icon = config.icon;

    return (
        <Badge 
            variant={config.variant}
            className={`${config.className} ${className} flex items-center gap-1 w-fit`}
        >
            <Icon className="h-3 w-3" />
            <span>{config.label}</span>
        </Badge>
    );
}
