import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScheduleStatus } from '@/types/workforce-pages';
import { CheckCircle, XCircle, FileText, Package } from 'lucide-react';

/**
 * Props for the ScheduleStatusBadge component
 */
interface ScheduleStatusBadgeProps {
    /** The schedule status to display */
    status: ScheduleStatus | undefined | null;
    
    /** Optional: Custom styling for the badge */
    className?: string;
    
    /** Optional: Whether to show the icon */
    showIcon?: boolean;
    
    /** Optional: Whether to show as outline badge */
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

/**
 * ScheduleStatusBadge Component
 * 
 * Displays a color-coded badge for schedule status with appropriate icons and styling.
 * 
 * Schedule Statuses:
 * - active: Green (✅) - Currently in use
 * - expired: Red (❌) - No longer valid
 * - draft: Gray (📝) - Work in progress
 * - archived: Slate (📦) - Stored for reference
 * 
 * Features:
 * - Color-coded by status type
 * - Optional icons for visual identification
 * - Responsive sizing
 * - Accessibility support with title attributes
 * - Reusable across schedule components
 * 
 * @param props - Component props
 * @returns The rendered schedule status badge
 */
export default function ScheduleStatusBadge({
    status,
    className = '',
    showIcon = true,
    variant = 'default',
}: ScheduleStatusBadgeProps) {
    if (!status) {
        return (
            <Badge variant="outline" className={className}>
                Unknown
            </Badge>
        );
    }

    const statusConfig = {
        active: {
            label: 'Active',
            bgClass: 'bg-green-100',
            textClass: 'text-green-800',
            borderClass: 'border-green-300',
            icon: CheckCircle,
            description: 'Currently in use',
        },
        expired: {
            label: 'Expired',
            bgClass: 'bg-red-100',
            textClass: 'text-red-800',
            borderClass: 'border-red-300',
            icon: XCircle,
            description: 'No longer valid',
        },
        draft: {
            label: 'Draft',
            bgClass: 'bg-gray-100',
            textClass: 'text-gray-800',
            borderClass: 'border-gray-300',
            icon: FileText,
            description: 'Work in progress',
        },
        archived: {
            label: 'Archived',
            bgClass: 'bg-slate-100',
            textClass: 'text-slate-800',
            borderClass: 'border-slate-300',
            icon: Package,
            description: 'Stored for reference',
        },
    };

    const config = statusConfig[status] || statusConfig.draft;
    const IconComponent = config.icon;

    return (
        <div title={config.description}>
            {variant === 'outline' ? (
                <Badge
                    variant="outline"
                    className={`${config.textClass} ${config.borderClass} ${className}`}
                >
                    {showIcon && IconComponent && (
                        <IconComponent className="h-3 w-3 mr-1" />
                    )}
                    {config.label}
                </Badge>
            ) : (
                <Badge
                    className={`${config.bgClass} ${config.textClass} ${className}`}
                >
                    {showIcon && IconComponent && (
                        <IconComponent className="h-3 w-3 mr-1" />
                    )}
                    {config.label}
                </Badge>
            )}
        </div>
    );
}
