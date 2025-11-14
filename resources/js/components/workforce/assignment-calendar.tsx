import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShiftAssignment } from '@/types/workforce-pages';
import { formatTime, getShiftTypeColorClasses, getStatusColorClasses } from '@/lib/workforce-utils';

interface AssignmentCalendarProps {
    assignments: ShiftAssignment[];
    onAssignmentClick?: (assignment: ShiftAssignment) => void;
    onDateClick?: (date: string) => void;
}

export function AssignmentCalendar({
    assignments = [],
    onAssignmentClick,
    onDateClick,
}: AssignmentCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Get all days in the current month
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Get the first day of the month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Format date as YYYY-MM-DD
    const formatDateString = (year: number, month: number, day: number): string => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    // Get assignments for a specific date
    const getAssignmentsForDate = (dateString: string): ShiftAssignment[] => {
        return assignments.filter((a) => a.date === dateString);
    };

    // Get total coverage for a date
    const getCoverageForDate = (dateString: string): { count: number; percentage: number } => {
        const dayAssignments = getAssignmentsForDate(dateString);
        return {
            count: dayAssignments.length,
            percentage: Math.min(100, (dayAssignments.length / 5) * 100),
        };
    };

    // Check if day has conflicts
    const hasConflictsOnDate = (dateString: string): boolean => {
        return getAssignmentsForDate(dateString).some((a) => a.has_conflict);
    };

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Create array of calendar days
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-4">
            {/* Calendar Header */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>
                            {monthNames[month]} {year}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleToday}>
                                Today
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleNextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day) => (
                            <div key={day} className="text-center font-semibold text-sm py-2 text-gray-600">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, index) => {
                            if (day === null) {
                                return <div key={`empty-${index}`} className="bg-gray-50 rounded" />;
                            }

                            const dateString = formatDateString(year, month, day);
                            const dayAssignments = getAssignmentsForDate(dateString);
                            const coverage = getCoverageForDate(dateString);
                            const hasConflicts = hasConflictsOnDate(dateString);
                            const isToday =
                                new Date().toDateString() === new Date(year, month, day).toDateString();
                            const isSelected = selectedDate === dateString;

                            return (
                                <div
                                    key={`day-${day}`}
                                    onClick={() => {
                                        setSelectedDate(dateString);
                                        onDateClick?.(dateString);
                                    }}
                                    className={`
                                        min-h-24 p-2 border rounded cursor-pointer transition-all
                                        ${
                                            isToday
                                                ? 'border-blue-500 bg-blue-50'
                                                : isSelected
                                                  ? 'border-purple-500 bg-purple-50'
                                                  : 'border-gray-200 bg-white hover:border-gray-300'
                                        }
                                        ${hasConflicts ? 'ring-2 ring-red-300' : ''}
                                    `}
                                >
                                    {/* Date number */}
                                    <div
                                        className={`
                                            text-sm font-semibold mb-1
                                            ${isToday ? 'text-blue-600' : 'text-gray-900'}
                                        `}
                                    >
                                        {day}
                                    </div>

                                    {/* Coverage indicator */}
                                    {dayAssignments.length > 0 && (
                                        <div className="mb-1">
                                            <div className="w-full h-1 bg-gray-200 rounded overflow-hidden">
                                                <div
                                                    className={`
                                                        h-full transition-all
                                                        ${
                                                            coverage.percentage >= 80
                                                                ? 'bg-green-500'
                                                                : coverage.percentage >= 50
                                                                  ? 'bg-yellow-500'
                                                                  : 'bg-orange-500'
                                                        }
                                                    `}
                                                    style={{ width: `${Math.min(coverage.percentage, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Assignments count badge */}
                                    {dayAssignments.length > 0 && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs mb-1"
                                        >
                                            {dayAssignments.length} shift{dayAssignments.length !== 1 ? 's' : ''}
                                        </Badge>
                                    )}

                                    {/* Mini assignment cards (show max 2) */}
                                    <div className="space-y-1">
                                        {dayAssignments.slice(0, 2).map((assignment) => (
                                            <div
                                                key={assignment.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onAssignmentClick?.(assignment);
                                                }}
                                                className={`
                                                    text-xs p-1 rounded cursor-pointer truncate hover:opacity-80 transition-opacity
                                                    ${getShiftTypeColorClasses(assignment.shift_type || 'custom').bg}
                                                    ${getShiftTypeColorClasses(assignment.shift_type || 'custom').text}
                                                `}
                                                title={`${assignment.employee_name} - ${formatTime(assignment.shift_start)} to ${formatTime(assignment.shift_end)}`}
                                            >
                                                <span className="font-semibold">
                                                    {assignment.employee_name?.split(' ')[0]}
                                                </span>
                                                <span className="text-xs">
                                                    {' '}
                                                    {formatTime(assignment.shift_start)}
                                                </span>
                                            </div>
                                        ))}
                                        {dayAssignments.length > 2 && (
                                            <div className="text-xs text-gray-500 px-1">
                                                +{dayAssignments.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Selected date details */}
            {selectedDate && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Assignments for {new Date(selectedDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {getAssignmentsForDate(selectedDate).length > 0 ? (
                            <div className="space-y-2">
                                {getAssignmentsForDate(selectedDate).map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        onClick={() => onAssignmentClick?.(assignment)}
                                        className="p-3 border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{assignment.employee_name}</p>
                                                <p className="text-xs text-gray-600">{assignment.employee_number}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-sm">
                                                    {formatTime(assignment.shift_start)} - {formatTime(assignment.shift_end)}
                                                </p>
                                                <p className="text-xs text-gray-600">{assignment.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <Badge className={`${getShiftTypeColorClasses(assignment.shift_type || 'custom').bg} ${getShiftTypeColorClasses(assignment.shift_type || 'custom').text}`}>
                                                {assignment.shift_type}
                                            </Badge>
                                            <Badge className={getStatusColorClasses(assignment.status)}>
                                                {assignment.status}
                                            </Badge>
                                            {assignment.is_overtime && (
                                                <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                                    OT
                                                </Badge>
                                            )}
                                            {assignment.has_conflict && (
                                                <Badge variant="destructive">Conflict</Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No assignments scheduled for this date</p>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default AssignmentCalendar;
