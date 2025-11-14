import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ShiftType } from '@/types/workforce-pages';
import { Sun, Cloud, Moon, Sunset } from 'lucide-react';

/**
 * Props for the ShiftTypeBadge component
 */
interface ShiftTypeBadgeProps {
    /** The shift type to display */
    shiftType: ShiftType | undefined | null;
    
    /** Optional: Custom styling for the badge */
    className?: string;
    
    /** Optional: Whether to show the icon */
    showIcon?: boolean;
    
    /** Optional: Whether to show as outline badge */
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

/**
 * ShiftTypeBadge Component
 * 
 * Displays a color-coded badge for shift types with appropriate icons and styling.
 * 
 * Shift Types:
 * - morning: Yellow (☀️) - 6:00 AM - 2:00 PM
 * - afternoon: Orange (🌤️) - 2:00 PM - 10:00 PM
 * - night: Blue (🌙) - 10:00 PM - 6:00 AM
 * - graveyard: Purple (🌃) - Overnight shifts
 * - custom: Gray (⚙️) - Non-standard times
 * 
 * Features:
 * - Color-coded by shift type
 * - Optional icons for visual identification
 * - Responsive sizing
 * - Accessibility support
 * - Reusable across multiple components
 * 
 * @param props - Component props
 * @returns The rendered shift type badge
 */
export default function ShiftTypeBadge({
    shiftType,
    className = '',
    showIcon = true,
    variant = 'default',
}: ShiftTypeBadgeProps) {
    if (!shiftType) {
        return (
            <Badge variant="outline" className={className}>
                Unknown
            </Badge>
        );
    }

    const shiftConfig = {
        morning: {
            label: 'Morning',
            bgClass: 'bg-yellow-100',
            textClass: 'text-yellow-800',
            borderClass: 'border-yellow-300',
            icon: Sun,
            description: '6:00 AM - 2:00 PM',
        },
        afternoon: {
            label: 'Afternoon',
            bgClass: 'bg-orange-100',
            textClass: 'text-orange-800',
            borderClass: 'border-orange-300',
            icon: Cloud,
            description: '2:00 PM - 10:00 PM',
        },
        night: {
            label: 'Night',
            bgClass: 'bg-blue-100',
            textClass: 'text-blue-800',
            borderClass: 'border-blue-300',
            icon: Moon,
            description: '10:00 PM - 6:00 AM',
        },
        graveyard: {
            label: 'Graveyard',
            bgClass: 'bg-purple-100',
            textClass: 'text-purple-800',
            borderClass: 'border-purple-300',
            icon: Sunset,
            description: 'Overnight',
        },
        custom: {
            label: 'Custom',
            bgClass: 'bg-gray-100',
            textClass: 'text-gray-800',
            borderClass: 'border-gray-300',
            icon: null,
            description: 'Non-standard hours',
        },
    };

    const config = shiftConfig[shiftType] || shiftConfig.custom;
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
