import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { ShiftAssignment, Department } from '@/types/workforce-pages';

interface CoverageAnalyticsProps {
    assignments: ShiftAssignment[];
    departments: Department[];
    requiredStaffPerDay?: number;
}

interface CoverageDayAnalysis {
    date: string;
    dayOfWeek: string;
    assignmentCount: number;
    coveragePercentage: number;
    department_breakdown: Record<string, number>;
    status: 'overstaffed' | 'adequate' | 'understaffed';
    conflictCount: number;
}

interface CoverageTrend {
    week: number;
    averageCoverage: number;
    totalAssignments: number;
    conflictDays: number;
}

/**
 * CoverageAnalytics Component
 *
 * Reusable analytics component for workforce coverage visualization and reporting.
 * Features:
 * - Coverage heatmap with color-coded days
 * - Understaffed and overstaffed days lists
 * - Coverage trends chart
 * - Department breakdown view
 * - Weekly/Monthly toggle
 * - Export to CSV functionality
 * - Real-time statistics
 *
 * @example
 * ```tsx
 * <CoverageAnalytics
 *   assignments={assignments}
 *   departments={departments}
 *   requiredStaffPerDay={5}
 * />
 * ```
 */
export default function CoverageAnalytics({
    assignments,
    departments,
    requiredStaffPerDay = 5,
}: CoverageAnalyticsProps) {
    const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [selectedMonth, setSelectedMonth] = useState<string>(
        new Date().toISOString().substring(0, 7) // YYYY-MM format
    );

    // Filter assignments by selected criteria
    const filteredAssignments = useMemo(() => {
        return assignments.filter((a) => {
            const assignmentMonth = a.date.substring(0, 7);
            const monthMatch = assignmentMonth === selectedMonth;

            if (selectedDepartment === 'all') {
                return monthMatch;
            }

            return (
                monthMatch &&
                a.department_id === parseInt(selectedDepartment)
            );
        });
    }, [assignments, selectedMonth, selectedDepartment]);

    // Analyze coverage by day
    const dailyCoverage = useMemo(() => {
        const coverageMap: Record<string, CoverageDayAnalysis> = {};

        for (const assignment of filteredAssignments) {
            if (!coverageMap[assignment.date]) {
                const dateObj = new Date(assignment.date);
                const dayOfWeek = dateObj.toLocaleDateString('en-US', {
                    weekday: 'short',
                });

                coverageMap[assignment.date] = {
                    date: assignment.date,
                    dayOfWeek,
                    assignmentCount: 0,
                    coveragePercentage: 0,
                    department_breakdown: {},
                    status: 'adequate',
                    conflictCount: 0,
                };
            }

            const day = coverageMap[assignment.date];
            day.assignmentCount++;

            const deptName = assignment.department_name || 'Unknown';
            if (!day.department_breakdown[deptName]) {
                day.department_breakdown[deptName] = 0;
            }
            day.department_breakdown[deptName]++;

            if (assignment.has_conflict) {
                day.conflictCount++;
            }
        }

        // Calculate coverage percentage and status
        for (const date in coverageMap) {
            const day = coverageMap[date];
            day.coveragePercentage = Math.round(
                (day.assignmentCount / requiredStaffPerDay) * 100
            );

            if (day.coveragePercentage >= 100) {
                day.status = 'overstaffed';
            } else if (day.coveragePercentage >= 80) {
                day.status = 'adequate';
            } else {
                day.status = 'understaffed';
            }
        }

        return Object.values(coverageMap).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [filteredAssignments, requiredStaffPerDay]);

    // Calculate trends
    const trends = useMemo(() => {
        const trendMap: Record<number, CoverageTrend> = {};

        for (const day of dailyCoverage) {
            const date = new Date(day.date);
            const weekNumber = Math.ceil(date.getDate() / 7);

            if (!trendMap[weekNumber]) {
                trendMap[weekNumber] = {
                    week: weekNumber,
                    averageCoverage: 0,
                    totalAssignments: 0,
                    conflictDays: 0,
                };
            }

            trendMap[weekNumber].totalAssignments += day.assignmentCount;
            trendMap[weekNumber].averageCoverage += day.coveragePercentage;

            if (day.status === 'understaffed') {
                trendMap[weekNumber].conflictDays++;
            }
        }

        return Object.values(trendMap)
            .map((trend) => ({
                ...trend,
                averageCoverage: Math.round(
                    trend.averageCoverage /
                        Object.values(trendMap).filter(
                            (t) => t.week === trend.week
                        ).length
                ),
            }))
                .sort((a, b) => a.week - b.week);
    }, [dailyCoverage]);    // Statistics
    const stats = useMemo(() => {
        const understaffed = dailyCoverage.filter(
            (d) => d.status === 'understaffed'
        );
        const overstaffed = dailyCoverage.filter(
            (d) => d.status === 'overstaffed'
        );
        const adequate = dailyCoverage.filter(
            (d) => d.status === 'adequate'
        );
        const totalConflicts = dailyCoverage.reduce(
            (sum, d) => sum + d.conflictCount,
            0
        );
        const avgCoverage =
            dailyCoverage.length > 0
                ? Math.round(
                      dailyCoverage.reduce((sum, d) => sum + d.coveragePercentage, 0) /
                          dailyCoverage.length
                  )
                : 0;

        return {
            understaffed,
            overstaffed,
            adequate,
            totalConflicts,
            avgCoverage,
            totalDays: dailyCoverage.length,
        };
    }, [dailyCoverage]);

    // Coverage heatmap color based on percentage
    const getCoverageColor = (status: string): string => {
        switch (status) {
            case 'overstaffed':
                return 'bg-green-100 border-green-300';
            case 'adequate':
                return 'bg-blue-100 border-blue-300';
            case 'understaffed':
                return 'bg-orange-100 border-orange-300';
            default:
                return 'bg-gray-100 border-gray-300';
        }
    };

    const getCoverageTextColor = (status: string): string => {
        switch (status) {
            case 'overstaffed':
                return 'text-green-900';
            case 'adequate':
                return 'text-blue-900';
            case 'understaffed':
                return 'text-orange-900';
            default:
                return 'text-gray-900';
        }
    };

    const handleExport = () => {
        const csvContent = [
            ['Date', 'Day', 'Assignments', 'Coverage %', 'Status', 'Conflicts'],
            ...dailyCoverage.map((day) => [
                day.date,
                day.dayOfWeek,
                day.assignmentCount,
                day.coveragePercentage,
                day.status,
                day.conflictCount,
            ]),
        ]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `coverage-analytics-${selectedMonth}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Coverage Analytics</h2>
                    <p className="text-sm text-gray-600">
                        Workforce coverage analysis and staffing insights
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleExport}
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </Button>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Month
                    </label>
                    <Input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Department
                    </label>
                    <Select
                        value={selectedDepartment}
                        onValueChange={setSelectedDepartment}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id.toString()}>
                                    {dept.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        View Mode
                    </label>
                    <Select value={viewMode} onValueChange={(value: 'monthly' | 'weekly') => setViewMode(value)}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Average Coverage
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.avgCoverage}%</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {stats.adequate.length} adequate days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Understaffed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-orange-600">
                            {stats.understaffed.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {(
                                (stats.understaffed.length /
                                    Math.max(stats.totalDays, 1)) *
                                100
                            ).toFixed(0)}
                            % of days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Adequate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">
                            {stats.adequate.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {(
                                (stats.adequate.length /
                                    Math.max(stats.totalDays, 1)) *
                                100
                            ).toFixed(0)}
                            % of days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Overstaffed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">
                            {stats.overstaffed.length}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {(
                                (stats.overstaffed.length /
                                    Math.max(stats.totalDays, 1)) *
                                100
                            ).toFixed(0)}
                            % of days
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Conflicts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">
                            {stats.totalConflicts}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Scheduling issues
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Coverage Heatmap */}
            <Card>
                <CardHeader>
                    <CardTitle>Coverage Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                    {dailyCoverage.length > 0 ? (
                        <div className="grid grid-cols-7 gap-2">
                            {dailyCoverage.map((day) => (
                                <div
                                    key={day.date}
                                    className={`p-3 rounded border-2 text-center ${getCoverageColor(
                                        day.status
                                    )}`}
                                    title={`${day.date} - ${day.assignmentCount} assignments (${day.coveragePercentage}%)`}
                                >
                                    <p className={`text-xs font-semibold ${getCoverageTextColor(day.status)}`}>
                                        {new Date(day.date).getDate()}
                                    </p>
                                    <p className={`text-lg font-bold ${getCoverageTextColor(day.status)}`}>
                                        {day.assignmentCount}
                                    </p>
                                    <p className={`text-xs ${getCoverageTextColor(day.status)}`}>
                                        {day.coveragePercentage}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-8">
                            No data available for selected period
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Understaffed Days */}
            {stats.understaffed.length > 0 && (
                <Card className="border-orange-200">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                            <CardTitle>Understaffed Days</CardTitle>
                            <Badge variant="secondary">{stats.understaffed.length}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {stats.understaffed.map((day) => (
                                <div
                                    key={day.date}
                                    className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200"
                                >
                                    <div>
                                        <p className="font-medium text-sm">
                                            {day.date} ({day.dayOfWeek})
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {day.assignmentCount} assigned ({day.coveragePercentage}% coverage)
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        {day.conflictCount > 0 && (
                                            <Badge variant="destructive">
                                                {day.conflictCount} conflict
                                                {day.conflictCount !== 1 ? 's' : ''}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Coverage Trends */}
            {trends.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Weekly Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {trends.map((trend) => {
                                const trend_change = trend.totalAssignments > 0 ? 'up' : 'down';
                                return (
                                    <div
                                        key={trend.week}
                                        className="flex items-center justify-between p-3 border rounded"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">
                                                Week {trend.week}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {trend.totalAssignments} assignments,{' '}
                                                {trend.conflictDays} understaffed days
                                            </p>
                                        </div>
                                        <div className="text-right flex items-center gap-2">
                                            <div>
                                                <p className="font-bold text-lg">
                                                    {trend.averageCoverage}%
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    avg coverage
                                                </p>
                                            </div>
                                            {trend_change === 'up' ? (
                                                <TrendingUp className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <TrendingDown className="h-5 w-5 text-red-600" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Legend */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Legend</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                            <span>Overstaffed (&gt;100%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded" />
                            <span>Adequate (80-100%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded" />
                            <span>Understaffed (&lt;80%)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper Input component for the coverage analytics
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
    );
}
