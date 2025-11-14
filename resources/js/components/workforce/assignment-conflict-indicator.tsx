import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    AlertTriangle,
    Clock,
    User,
    Calendar,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';

export interface ConflictData {
    type: 'overlap' | 'unavailable' | 'exceeded_hours' | 'rotation_conflict' | 'none';
    severity: 'critical' | 'warning' | 'info' | 'none';
    message: string;
    details?: string;
    employee_name?: string;
    conflicting_shift?: {
        date: string;
        shift_start: string;
        shift_end: string;
    };
    resolution?: string;
}

interface AssignmentConflictIndicatorProps {
    conflict: ConflictData;
    onOverride?: (confirmed: boolean) => void;
    canOverride?: boolean;
    isLoading?: boolean;
}

/**
 * AssignmentConflictIndicator Component
 *
 * Displays conflict information for shift assignments with visual indicators,
 * detailed messages, and optional override capability.
 *
 * Features:
 * - Visual severity indicators (critical, warning, info)
 * - Detailed conflict messages and resolution suggestions
 * - Override confirmation checkbox (HR Manager only)
 * - Loading state during conflict checking
 * - Customizable icons and styling per conflict type
 * - Accessibility labels and keyboard support
 *
 * @example
 * ```tsx
 * <AssignmentConflictIndicator
 *   conflict={conflictData}
 *   onOverride={handleOverride}
 *   canOverride={isHRManager}
 * />
 * ```
 */
export default function AssignmentConflictIndicator({
    conflict,
    onOverride,
    canOverride = false,
    isLoading = false,
}: AssignmentConflictIndicatorProps) {
    const [overrideConfirmed, setOverrideConfirmed] = useState(false);

    const getConflictIcon = useCallback(() => {
        switch (conflict.type) {
            case 'overlap':
                return <Clock className="h-5 w-5" />;
            case 'unavailable':
                return <User className="h-5 w-5" />;
            case 'exceeded_hours':
                return <AlertCircle className="h-5 w-5" />;
            case 'rotation_conflict':
                return <Calendar className="h-5 w-5" />;
            default:
                return <CheckCircle className="h-5 w-5" />;
        }
    }, [conflict.type]);

    const getSeverityStyles = useCallback(() => {
        switch (conflict.severity) {
            case 'critical':
                return {
                    container: 'bg-red-50 border-2 border-red-300',
                    icon: 'text-red-600',
                    badge: 'bg-red-100 text-red-800',
                    title: 'text-red-900',
                };
            case 'warning':
                return {
                    container: 'bg-yellow-50 border-2 border-yellow-300',
                    icon: 'text-yellow-600',
                    badge: 'bg-yellow-100 text-yellow-800',
                    title: 'text-yellow-900',
                };
            case 'info':
                return {
                    container: 'bg-blue-50 border-2 border-blue-300',
                    icon: 'text-blue-600',
                    badge: 'bg-blue-100 text-blue-800',
                    title: 'text-blue-900',
                };
            default:
                return {
                    container: 'bg-gray-50 border-2 border-gray-300',
                    icon: 'text-gray-600',
                    badge: 'bg-gray-100 text-gray-800',
                    title: 'text-gray-900',
                };
        }
    }, [conflict.severity]);

    const getSeverityLabel = useCallback(() => {
        switch (conflict.severity) {
            case 'critical':
                return 'Critical Conflict';
            case 'warning':
                return 'Scheduling Warning';
            case 'info':
                return 'Information';
            default:
                return 'No Issues';
        }
    }, [conflict.severity]);

    const getConflictTypeLabel = useCallback(() => {
        switch (conflict.type) {
            case 'overlap':
                return 'Scheduling Overlap';
            case 'unavailable':
                return 'Employee Unavailable';
            case 'exceeded_hours':
                return 'Hour Limit Exceeded';
            case 'rotation_conflict':
                return 'Rotation Conflict';
            default:
                return 'No Conflict';
        }
    }, [conflict.type]);

    if (conflict.severity === 'none') {
        return (
            <Card className="bg-green-50 border-2 border-green-300">
                <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold text-green-900">No Conflicts</p>
                            <p className="text-sm text-green-800 mt-1">
                                This assignment can be created without any issues
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const styles = getSeverityStyles();

    return (
        <Card className={styles.container}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                        <div className={`${styles.icon} mt-1 flex-shrink-0`}>
                            {getConflictIcon()}
                        </div>
                        <div>
                            <CardTitle className={`text-base ${styles.title}`}>
                                {getSeverityLabel()}
                            </CardTitle>
                            <Badge className={`${styles.badge} mt-2`}>
                                {getConflictTypeLabel()}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Main Message */}
                <div>
                    <p className={`font-medium ${styles.title}`}>{conflict.message}</p>
                    {conflict.details && (
                        <p className={`text-sm mt-1 ${styles.title}`}>
                            {conflict.details}
                        </p>
                    )}
                </div>

                {/* Conflicting Shift Information */}
                {conflict.conflicting_shift && (
                    <div className="bg-white rounded p-3 space-y-2 border">
                        <p className="font-semibold text-sm">Conflicting Shift Details:</p>
                        <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    Date:{' '}
                                    {new Date(
                                        conflict.conflicting_shift.date
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>
                                    Time: {conflict.conflicting_shift.shift_start} -{' '}
                                    {conflict.conflicting_shift.shift_end}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Resolution Suggestion */}
                {conflict.resolution && (
                    <div className="bg-white rounded p-3 border">
                        <p className="font-semibold text-sm mb-1">Recommended Action:</p>
                        <p className="text-sm">{conflict.resolution}</p>
                    </div>
                )}

                {/* Override Section (HR Manager Only) */}
                {canOverride && conflict.severity !== 'none' && (
                    <div className="bg-white rounded p-3 border border-gray-300 space-y-2">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900">
                                    HR Manager Override
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    {conflict.severity === 'critical'
                                        ? 'This is a critical conflict. Confirm you want to override the scheduling rules.'
                                        : 'You can override this warning and proceed with the assignment.'}
                                </p>
                            </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                            <Checkbox
                                checked={overrideConfirmed}
                                onCheckedChange={(checked) => {
                                    setOverrideConfirmed(checked as boolean);
                                }}
                                disabled={isLoading}
                            />
                            <span className="text-sm font-medium">
                                I confirm the override and take responsibility for this decision
                            </span>
                        </label>

                        {overrideConfirmed && (
                            <Button
                                onClick={() => onOverride?.(true)}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                disabled={isLoading}
                                size="sm"
                            >
                                {isLoading ? 'Processing...' : 'Proceed with Override'}
                            </Button>
                        )}
                    </div>
                )}

                {/* Cannot Override Note */}
                {!canOverride && conflict.severity === 'critical' && (
                    <div className="bg-white rounded p-3 border border-gray-300 flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-red-900">
                                Cannot Override
                            </p>
                            <p className="text-xs text-red-800 mt-1">
                                Contact HR Manager to override critical conflicts
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
