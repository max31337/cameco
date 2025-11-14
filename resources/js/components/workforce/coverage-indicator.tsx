import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';

/**
 * Props for the CoverageIndicator component
 */
interface CoverageIndicatorProps {
    /** Coverage percentage (0-100) */
    coverage: number | undefined | null;
    
    /** Optional: Custom styling for the component */
    className?: string;
    
    /** Optional: Whether to show the percentage text */
    showPercentage?: boolean;
    
    /** Optional: Whether to show the status label */
    showLabel?: boolean;
}

/**
 * CoverageIndicator Component
 * 
 * Displays a color-coded coverage percentage indicator with visual progress bar.
 * 
 * Coverage Levels:
 * - >= 90%: Green (Optimal) - Full staffing
 * - 70-89%: Yellow (Adequate) - Acceptable coverage
 * - 50-69%: Orange (Low) - Understaffed
 * - < 50%: Red (Critical) - Severe staffing shortage
 * 
 * Features:
 * - Color-coded by coverage percentage
 * - Visual progress bar representation
 * - Responsive sizing
 * - Accessibility support
 * - Optional percentage display
 * - Reusable across multiple components (schedules, departments, etc.)
 * 
 * @param props - Component props
 * @returns The rendered coverage indicator
 */
export default function CoverageIndicator({
    coverage,
    className = '',
    showPercentage = true,
    showLabel = true,
}: CoverageIndicatorProps) {
    if (coverage === undefined || coverage === null) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="w-16 h-2 bg-gray-200 rounded-full"></div>
                <span className="text-xs text-gray-500">No data</span>
            </div>
        );
    }

    // Ensure coverage is between 0 and 100
    const normalizedCoverage = Math.max(0, Math.min(100, coverage));

    // Determine coverage level and styling
    let statusConfig;

    if (normalizedCoverage >= 90) {
        statusConfig = {
            status: 'Optimal',
            bgClass: 'bg-green-100',
            textClass: 'text-green-800',
            borderClass: 'border-green-300',
            progressBgClass: 'bg-green-500',
            icon: CheckCircle,
            description: 'Full staffing - Optimal coverage',
        };
    } else if (normalizedCoverage >= 70) {
        statusConfig = {
            status: 'Adequate',
            bgClass: 'bg-yellow-100',
            textClass: 'text-yellow-800',
            borderClass: 'border-yellow-300',
            progressBgClass: 'bg-yellow-500',
            icon: AlertCircle,
            description: 'Acceptable coverage - Monitor closely',
        };
    } else if (normalizedCoverage >= 50) {
        statusConfig = {
            status: 'Low',
            bgClass: 'bg-orange-100',
            textClass: 'text-orange-800',
            borderClass: 'border-orange-300',
            progressBgClass: 'bg-orange-500',
            icon: AlertTriangle,
            description: 'Understaffed - Action recommended',
        };
    } else {
        statusConfig = {
            status: 'Critical',
            bgClass: 'bg-red-100',
            textClass: 'text-red-800',
            borderClass: 'border-red-300',
            progressBgClass: 'bg-red-500',
            icon: XCircle,
            description: 'Critical shortage - Immediate action required',
        };
    }

    const IconComponent = statusConfig.icon;

    return (
        <div
            className={`flex flex-col gap-2 ${className}`}
            title={statusConfig.description}
        >
            {/* Header with icon, label, and percentage */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {showLabel && (
                        <Badge
                            className={`${statusConfig.bgClass} ${statusConfig.textClass}`}
                        >
                            <IconComponent className="h-3 w-3 mr-1" />
                            {statusConfig.status}
                        </Badge>
                    )}
                </div>
                {showPercentage && (
                    <span
                        className={`text-sm font-semibold ${statusConfig.textClass}`}
                    >
                        {Math.round(normalizedCoverage)}%
                    </span>
                )}
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-300 ${statusConfig.progressBgClass}`}
                    style={{ width: `${normalizedCoverage}%` }}
                ></div>
            </div>

            {/* Optional: Coverage range indicator */}
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
            </div>
        </div>
    );
}
