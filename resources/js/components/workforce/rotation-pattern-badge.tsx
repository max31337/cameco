import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RotationPatternType } from '@/types/workforce-pages';
import { RotateCcw, Settings } from 'lucide-react';

/**
 * Props for the RotationPatternBadge component
 */
interface RotationPatternBadgeProps {
    /** The rotation pattern type to display */
    pattern: RotationPatternType | undefined | null;
    
    /** Optional: Custom styling for the badge */
    className?: string;
    
    /** Optional: Whether to show the icon */
    showIcon?: boolean;
    
    /** Optional: Whether to show as outline badge */
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
}

/**
 * RotationPatternBadge Component
 * 
 * Displays a color-coded badge for rotation patterns with appropriate icons and styling.
 * 
 * Rotation Patterns:
 * - 4x2: 4 Days On / 2 Days Off (Purple)
 * - 5x2: 5 Days On / 2 Days Off (Blue)
 * - 6x1: 6 Days On / 1 Day Off (Green)
 * - custom: Custom rotation pattern (Gray)
 * 
 * Features:
 * - Color-coded by rotation pattern
 * - Visual representation of the pattern (e.g., "4x2")
 * - Optional rotation icon for visual identification
 * - Responsive sizing
 * - Accessibility support
 * - Reusable across multiple components
 * 
 * @param props - Component props
 * @returns The rendered rotation pattern badge
 */
export default function RotationPatternBadge({
    pattern,
    className = '',
    showIcon = true,
    variant = 'default',
}: RotationPatternBadgeProps) {
    if (!pattern) {
        return (
            <Badge variant="outline" className={className}>
                No Pattern
            </Badge>
        );
    }

    const patternConfig = {
        '4x2': {
            label: '4x2',
            description: '4 Days On / 2 Days Off',
            bgClass: 'bg-purple-100',
            textClass: 'text-purple-800',
            borderClass: 'border-purple-300',
            icon: RotateCcw,
            shortDescription: '4 Days / 2 Rest',
        },
        '5x2': {
            label: '5x2',
            description: '5 Days On / 2 Days Off',
            bgClass: 'bg-blue-100',
            textClass: 'text-blue-800',
            borderClass: 'border-blue-300',
            icon: RotateCcw,
            shortDescription: '5 Days / 2 Rest',
        },
        '6x1': {
            label: '6x1',
            description: '6 Days On / 1 Day Off',
            bgClass: 'bg-green-100',
            textClass: 'text-green-800',
            borderClass: 'border-green-300',
            icon: RotateCcw,
            shortDescription: '6 Days / 1 Rest',
        },
        custom: {
            label: 'Custom',
            description: 'Custom rotation pattern',
            bgClass: 'bg-gray-100',
            textClass: 'text-gray-800',
            borderClass: 'border-gray-300',
            icon: Settings,
            shortDescription: 'Custom Pattern',
        },
    };

    const config = patternConfig[pattern] || patternConfig.custom;
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
