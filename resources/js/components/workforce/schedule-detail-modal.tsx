import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Calendar, FileText, Copy, Edit } from 'lucide-react';
import { WorkSchedule } from '@/types/workforce-pages';

interface ScheduleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    schedule: WorkSchedule | null;
    onEdit?: (schedule: WorkSchedule) => void;
    onDuplicate?: (schedule: WorkSchedule) => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ScheduleDetailModal({
    isOpen,
    onClose,
    schedule,
    onEdit,
    onDuplicate,
}: ScheduleDetailModalProps) {
    if (!schedule) return null;

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'expired':
                return 'bg-red-100 text-red-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    };

    const getWorkDays = (): string[] => {
        const days = [];
        if (schedule.monday_start) days.push('Monday');
        if (schedule.tuesday_start) days.push('Tuesday');
        if (schedule.wednesday_start) days.push('Wednesday');
        if (schedule.thursday_start) days.push('Thursday');
        if (schedule.friday_start) days.push('Friday');
        if (schedule.saturday_start) days.push('Saturday');
        if (schedule.sunday_start) days.push('Sunday');
        return days;
    };

    const formatTime = (time?: string | null): string => {
        if (!time) return 'N/A';
        return time;
    };

    const calculateDuration = (start?: string | null, end?: string | null): string => {
        if (!start || !end) return 'N/A';
        try {
            const startDate = new Date(`2024-01-01 ${start}`);
            const endDate = new Date(`2024-01-01 ${end}`);
            let diffMs = endDate.getTime() - startDate.getTime();

            if (diffMs < 0) {
                diffMs += 24 * 60 * 60 * 1000;
            }

            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            if (minutes === 0) return `${hours}h`;
            return `${hours}h ${minutes}m`;
        } catch {
            return 'N/A';
        }
    };

    const workDays = getWorkDays();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <DialogTitle className="text-2xl">{schedule.name}</DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">
                                {schedule.department_name || 'No department assigned'}
                            </p>
                        </div>
                        <Badge className={getStatusColor(schedule.status)}>
                            {(schedule.status || 'active').charAt(0).toUpperCase() + (schedule.status || 'active').slice(1)}
                        </Badge>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="shifts">Shifts</TabsTrigger>
                        <TabsTrigger value="employees">Employees</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Effective Date */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Effective Date
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg font-semibold">
                                        {new Date(schedule.effective_date).toLocaleDateString()}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Expiry Date */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Expiry Date
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg font-semibold">
                                        {schedule.expires_at
                                            ? new Date(schedule.expires_at).toLocaleDateString()
                                            : 'No expiry'}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Assigned Employees */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Assigned Employees
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg font-semibold text-blue-600">
                                        {schedule.assigned_employees_count || 0}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Work Days */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Work Days
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-semibold">{workDays.length}/7 days</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Description */}
                        {schedule.description && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Description
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700">{schedule.description}</p>
                                </CardContent>
                            </Card>
                        )}

                        {/* Overtime Settings */}
                        {schedule.overtime_threshold !== undefined && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Overtime Settings</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Threshold:</span>
                                        <span className="font-medium">{schedule.overtime_threshold || 'N/A'} hours</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Rate Multiplier:</span>
                                        <span className="font-medium">
                                            {schedule.overtime_rate_multiplier ? `${(schedule.overtime_rate_multiplier * 100).toFixed(0)}%` : 'N/A'}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Shifts Tab */}
                    <TabsContent value="shifts" className="space-y-4">
                        <div className="space-y-3">
                            {DAYS_OF_WEEK.map((day) => {
                                const dayKey = day.toLowerCase();
                                const startKey = `${dayKey}_start` as keyof WorkSchedule;
                                const endKey = `${dayKey}_end` as keyof WorkSchedule;
                                const start = schedule[startKey];
                                const end = schedule[endKey];
                                const isWorkDay = !!start;

                                return (
                                    <Card key={day} className={!isWorkDay ? 'opacity-50' : ''}>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-sm">{day}</h4>
                                                    {isWorkDay ? (
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {formatTime(start as string)} - {formatTime(end as string)}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic mt-1">Rest day</p>
                                                    )}
                                                </div>
                                                {isWorkDay && (
                                                    <Badge variant="outline">
                                                        {calculateDuration(start as string, end as string)}
                                                    </Badge>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Break Durations */}
                        {(schedule.lunch_break_duration || schedule.morning_break_duration || schedule.afternoon_break_duration) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Break Durations</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {schedule.lunch_break_duration && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Lunch Break:</span>
                                            <span className="font-medium">{schedule.lunch_break_duration} minutes</span>
                                        </div>
                                    )}
                                    {schedule.morning_break_duration && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Morning Break:</span>
                                            <span className="font-medium">{schedule.morning_break_duration} minutes</span>
                                        </div>
                                    )}
                                    {schedule.afternoon_break_duration && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Afternoon Break:</span>
                                            <span className="font-medium">{schedule.afternoon_break_duration} minutes</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Employees Tab */}
                    <TabsContent value="employees" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Assigned Employees</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {(schedule.assigned_employees_count ?? 0) > 0 ? (
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            Total assigned: <strong>{schedule.assigned_employees_count}</strong> employee
                                            {(schedule.assigned_employees_count ?? 0) !== 1 ? 's' : ''}
                                        </p>
                                        <p className="text-xs text-gray-500 italic">
                                            Employee list would display here with their assignment details
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 italic">No employees assigned to this schedule</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-6 border-t">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                    {onDuplicate && (
                        <Button variant="outline" onClick={() => {
                            onDuplicate(schedule);
                            onClose();
                        }} className="gap-2">
                            <Copy className="h-4 w-4" />
                            Duplicate
                        </Button>
                    )}
                    {onEdit && (
                        <Button onClick={() => {
                            onEdit(schedule);
                            onClose();
                        }} className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
