import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

/**
 * Props for the OvertimeBadge component
 */
interface OvertimeBadgeProps {
    /** Whether the assignment is marked as overtime */
    isOvertime: boolean | undefined | null;
    
    /** Optional: Custom styling for the badge */
    className?: string;
    
    /** Optional: Whether to show the icon */
    showIcon?: boolean;
    
    /** Optional: Whether to show as outline badge */
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

/**
 * OvertimeBadge Component
 * 
 * Displays a simple overtime indicator badge when an assignment includes overtime hours.
 * 
 * Features:
 * - Simple "OT" label with amber coloring
 * - Clock icon for quick visual recognition
 * - Only displays when isOvertime is true
 * - Color-coded for overtime visibility
 * - Accessible title attributes
 * - Reusable across assignment tables, cards, and detail views
 * 
 * @param props - Component props
 * @returns The rendered overtime badge, or null if not overtime
 */
export default function OvertimeBadge({
    isOvertime,
    className = '',
    showIcon = true,
    variant = 'default',
}: OvertimeBadgeProps) {
    // Only show badge if overtime is true
    if (!isOvertime) {
        return null;
    }

    const overtimeConfig = {
        label: 'OT',
        description: 'Overtime - Hours exceed standard work schedule',
        bgClass: 'bg-amber-100',
        textClass: 'text-amber-800',
        borderClass: 'border-amber-300',
        icon: Clock,
    };

    const IconComponent = overtimeConfig.icon;

    return (
        <div title={overtimeConfig.description}>
            {variant === 'outline' ? (
                <Badge
                    variant="outline"
                    className={`${overtimeConfig.textClass} ${overtimeConfig.borderClass} ${className}`}
                >
                    {showIcon && IconComponent && (
                        <IconComponent className="h-3 w-3 mr-1" />
                    )}
                    {overtimeConfig.label}
                </Badge>
            ) : (
                <Badge
                    className={`${overtimeConfig.bgClass} ${overtimeConfig.textClass} ${className}`}
                >
                    {showIcon && IconComponent && (
                        <IconComponent className="h-3 w-3 mr-1" />
                    )}
                    {overtimeConfig.label}
                </Badge>
            )}
        </div>
    );
}
