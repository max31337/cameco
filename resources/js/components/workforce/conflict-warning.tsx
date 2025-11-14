import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Conflict type definitions
 */
type ConflictType = 'overlap' | 'unavailable' | 'exceeded_hours' | 'rotation_conflict' | 'none';

/**
 * Props for a single conflict item
 */
interface Conflict {
    /** The type of conflict */
    type: ConflictType;
    
    /** Detailed message about the conflict */
    message: string;
    
    /** Optional: Related entity (e.g., employee name, shift time) */
    relatedEntity?: string;
    
    /** Optional: Suggested resolution */
    resolution?: string;
}

/**
 * Props for the ConflictWarning component
 */
interface ConflictWarningProps {
    /** Array of conflicts to display */
    conflicts: Conflict[] | undefined | null;
    
    /** Optional: Whether to show as dismissible */
    dismissible?: boolean;
    
    /** Optional: Callback when conflict is dismissed */
    onDismiss?: () => void;
    
    /** Optional: Custom styling for the component */
    className?: string;
    
    /** Optional: HR Manager override capability */
    canOverride?: boolean;
    
    /** Optional: Callback for override action */
    onOverride?: () => void;
}

/**
 * ConflictWarning Component
 * 
 * Displays detailed conflict information with messages and resolution suggestions.
 * Used to alert HR staff about scheduling conflicts that need resolution.
 * 
 * Conflict Types:
 * - overlap: Employee already assigned to another shift at the same time
 * - unavailable: Employee marked as unavailable (on leave, sick, etc.)
 * - exceeded_hours: Assignment would exceed daily or weekly hour limits
 * - rotation_conflict: Assignment conflicts with employee's rotation pattern
 * - none: No conflicts detected
 * 
 * Features:
 * - Color-coded by conflict severity
 * - Icon-based visual identification
 * - Detailed messages for each conflict
 * - Suggested resolutions when available
 * - Optional override for HR Managers
 * - Dismissible alerts
 * - Responsive layout
 * - Accessibility support
 * 
 * @param props - Component props
 * @returns The rendered conflict warning, or null if no conflicts
 */
export default function ConflictWarning({
    conflicts,
    dismissible = true,
    onDismiss,
    className = '',
    canOverride = false,
    onOverride,
}: ConflictWarningProps) {
    const [isVisible, setIsVisible] = React.useState(true);

    if (!conflicts || conflicts.length === 0 || !isVisible) {
        return null;
    }

    // Determine overall severity based on conflict types
    const hasOverlap = conflicts.some((c) => c.type === 'overlap');
    const hasUnavailable = conflicts.some((c) => c.type === 'unavailable');
    const hasExceededHours = conflicts.some((c) => c.type === 'exceeded_hours');
    const hasRotationConflict = conflicts.some((c) => c.type === 'rotation_conflict');

    // Set severity level (critical > warning > info)
    let severity: 'critical' | 'warning' | 'info';
    let SeverityIcon;

    if (hasOverlap || hasUnavailable) {
        severity = 'critical';
        SeverityIcon = XCircle;
    } else if (hasExceededHours || hasRotationConflict) {
        severity = 'warning';
        SeverityIcon = AlertTriangle;
    } else {
        severity = 'info';
        SeverityIcon = AlertCircle;
    }

    const severityConfig = {
        critical: {
            bgClass: 'bg-red-50',
            borderClass: 'border-red-200',
            titleClass: 'text-red-900',
            descClass: 'text-red-800',
            iconClass: 'text-red-600',
        },
        warning: {
            bgClass: 'bg-yellow-50',
            borderClass: 'border-yellow-200',
            titleClass: 'text-yellow-900',
            descClass: 'text-yellow-800',
            iconClass: 'text-yellow-600',
        },
        info: {
            bgClass: 'bg-blue-50',
            borderClass: 'border-blue-200',
            titleClass: 'text-blue-900',
            descClass: 'text-blue-800',
            iconClass: 'text-blue-600',
        },
    };

    const config = severityConfig[severity];

    const handleDismiss = () => {
        setIsVisible(false);
        onDismiss?.();
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <Alert
                className={`${config.bgClass} ${config.borderClass} border-l-4`}
            >
                <SeverityIcon className={`h-4 w-4 ${config.iconClass}`} />
                <AlertTitle className={config.titleClass}>
                    Scheduling Conflict Detected
                </AlertTitle>
                <AlertDescription className={config.descClass}>
                    <div className="space-y-3 mt-3">
                        {/* List all conflicts */}
                        {conflicts.map((conflict, idx) => (
                            <ConflictItem
                                key={idx}
                                conflict={conflict}
                                config={config}
                            />
                        ))}

                        {/* Action buttons */}
                        <div className="flex gap-2 mt-4 pt-3 border-t border-current border-opacity-20">
                            {canOverride && onOverride && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onOverride}
                                    className={`${config.titleClass} border-current`}
                                >
                                    Override Conflict
                                </Button>
                            )}
                            {dismissible && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleDismiss}
                                    className={config.titleClass}
                                >
                                    Dismiss
                                </Button>
                            )}
                        </div>
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    );
}

/**
 * Individual conflict item component
 */
interface ConflictItemProps {
    conflict: Conflict;
    config: {
        bgClass: string;
        borderClass: string;
        titleClass: string;
        descClass: string;
        iconClass: string;
    };
}

function ConflictItem({ conflict, config }: ConflictItemProps) {
    const getConflictIcon = (type: ConflictType) => {
        switch (type) {
            case 'overlap':
                return (
                    <XCircle className={`h-4 w-4 ${config.iconClass} flex-shrink-0`} />
                );
            case 'unavailable':
                return (
                    <AlertCircle className={`h-4 w-4 ${config.iconClass} flex-shrink-0`} />
                );
            case 'exceeded_hours':
                return (
                    <Clock className={`h-4 w-4 ${config.iconClass} flex-shrink-0`} />
                );
            case 'rotation_conflict':
                return (
                    <AlertTriangle className={`h-4 w-4 ${config.iconClass} flex-shrink-0`} />
                );
            default:
                return (
                    <AlertCircle className={`h-4 w-4 ${config.iconClass} flex-shrink-0`} />
                );
        }
    };

    const getConflictLabel = (type: ConflictType) => {
        switch (type) {
            case 'overlap':
                return 'Shift Overlap';
            case 'unavailable':
                return 'Employee Unavailable';
            case 'exceeded_hours':
                return 'Hour Limit Exceeded';
            case 'rotation_conflict':
                return 'Rotation Pattern Conflict';
            default:
                return 'Conflict';
        }
    };

    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                {getConflictIcon(conflict.type)}
                <span className={`font-semibold text-sm ${config.titleClass}`}>
                    {getConflictLabel(conflict.type)}
                </span>
                {conflict.relatedEntity && (
                    <span className={`text-xs ${config.descClass} opacity-75`}>
                        • {conflict.relatedEntity}
                    </span>
                )}
            </div>
            <p className={`text-sm ${config.descClass} ml-6`}>
                {conflict.message}
            </p>
            {conflict.resolution && (
                <div className={`text-xs ${config.descClass} ml-6 italic opacity-90`}>
                    <strong>Suggested Resolution:</strong> {conflict.resolution}
                </div>
            )}
        </div>
    );
}
