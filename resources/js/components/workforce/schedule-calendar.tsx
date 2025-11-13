import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { WorkSchedule } from '@/types/workforce-pages';

interface ScheduleCalendarProps {
    schedules: WorkSchedule[];
    onDayClick?: (date: Date, schedules: WorkSchedule[]) => void;
}

interface CalendarDay {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    schedules: WorkSchedule[];
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function ScheduleCalendar({
    schedules,
    onDayClick,
}: ScheduleCalendarProps) {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const getDaysInMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const generateCalendarDays = (): CalendarDay[] => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const daysInPrevMonth = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

        const days: CalendarDay[] = [];

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, daysInPrevMonth - i);
            days.push({
                date,
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                schedules: getSchedulesForDate(date),
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            days.push({
                date,
                day: i,
                isCurrentMonth: true,
                schedules: getSchedulesForDate(date),
            });
        }

        // Next month days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
            days.push({
                date,
                day: i,
                isCurrentMonth: false,
                schedules: getSchedulesForDate(date),
            });
        }

        return days;
    };

    const getSchedulesForDate = (date: Date): WorkSchedule[] => {
        return schedules.filter((schedule) => {
            const effectiveDate = new Date(schedule.effective_date);
            const expiresDate = schedule.expires_at ? new Date(schedule.expires_at) : null;

            const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const effectiveDateOnly = new Date(
                effectiveDate.getFullYear(),
                effectiveDate.getMonth(),
                effectiveDate.getDate()
            );

            const isOnOrAfterEffective = dateOnly >= effectiveDateOnly;
            const isBeforeExpiry = !expiresDate || dateOnly <= expiresDate;

            return isOnOrAfterEffective && isBeforeExpiry;
        });
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    };

    const isToday = (date: Date): boolean => {
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const getDepartmentColor = (deptName?: string): string => {
        const colors: Record<string, string> = {
            manufacturing: 'bg-blue-100 text-blue-800',
            warehouse: 'bg-purple-100 text-purple-800',
            quality: 'bg-green-100 text-green-800',
            engineering: 'bg-orange-100 text-orange-800',
            administration: 'bg-gray-100 text-gray-800',
        };

        if (!deptName) return 'bg-gray-100 text-gray-800';

        const key = deptName.toLowerCase().replace(/[^a-z]/g, '');
        return colors[key] || 'bg-indigo-100 text-indigo-800';
    };

    const calendarDays = generateCalendarDays();

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={previousMonth}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={goToToday}>
                            Today
                        </Button>
                        <Button variant="outline" size="sm" onClick={nextMonth}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {/* Day headers */}
                        {DAYS_OF_WEEK.map((day) => (
                            <div key={day} className="text-center py-2 font-semibold text-sm text-gray-600">
                                {day}
                            </div>
                        ))}

                        {/* Calendar days */}
                        {calendarDays.map((calendarDay, index) => (
                            <div
                                key={index}
                                onClick={() => calendarDay.isCurrentMonth && onDayClick?.(calendarDay.date, calendarDay.schedules)}
                                className={`min-h-24 p-2 border rounded-lg transition-all ${
                                    !calendarDay.isCurrentMonth
                                        ? 'bg-gray-50 text-gray-400'
                                        : isToday(calendarDay.date)
                                        ? 'bg-blue-50 border-blue-300'
                                        : 'bg-white hover:bg-gray-50'
                                } ${calendarDay.isCurrentMonth && calendarDay.schedules.length > 0 ? 'cursor-pointer' : ''}`}
                            >
                                {/* Day Number */}
                                <div className={`text-sm font-semibold mb-1 ${isToday(calendarDay.date) ? 'text-blue-600' : ''}`}>
                                    {calendarDay.day}
                                </div>

                                {/* Schedules */}
                                <div className="space-y-1">
                                    {calendarDay.schedules.slice(0, 2).map((schedule) => (
                                        <div
                                            key={schedule.id}
                                            className={`text-xs px-2 py-1 rounded truncate ${getDepartmentColor(
                                                schedule.department_name
                                            )}`}
                                            title={schedule.name}
                                        >
                                            {schedule.name}
                                        </div>
                                    ))}

                                    {/* Show more indicator */}
                                    {calendarDay.schedules.length > 2 && (
                                        <div className="text-xs text-gray-500 px-2 py-1">
                                            +{calendarDay.schedules.length - 2} more
                                        </div>
                                    )}
                                </div>

                                {/* Summary */}
                                {calendarDay.schedules.length > 0 && (
                                    <div className="mt-2 pt-1 border-t border-gray-200 text-xs text-gray-600 flex items-center gap-1">
                                        <Users className="h-3 w-3" />
                                        <span>
                                            {calendarDay.schedules.reduce((sum, s) => sum + (s.assigned_employees_count || 0), 0)} employees
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold mb-2">Legend</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 bg-blue-100 border border-blue-300 rounded"></div>
                                <span className="text-gray-700">Today</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 bg-blue-100 rounded"></div>
                                <span className="text-gray-700">Manufacturing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 bg-purple-100 rounded"></div>
                                <span className="text-gray-700">Warehouse</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-3 w-3 bg-green-100 rounded"></div>
                                <span className="text-gray-700">Quality</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="border-t pt-4 grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600">Total Schedules</p>
                            <p className="text-lg font-semibold">{schedules.length}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Active</p>
                            <p className="text-lg font-semibold text-green-600">
                                {schedules.filter((s) => s.status === 'active').length}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600">Total Employees</p>
                            <p className="text-lg font-semibold">
                                {schedules.reduce((sum, s) => sum + (s.assigned_employees_count || 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
