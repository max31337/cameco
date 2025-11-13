import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotationPattern } from '@/types/workforce-pages';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface RotationPatternPreviewProps {
    pattern: RotationPattern;
    patternName?: string;
    startDate?: Date | string;
    cyclesShown?: number;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

interface CalendarDay {
    date: number;
    patternIndex: number;
    isWorkDay: boolean;
    isToday?: boolean;
    isCurrentMonth: boolean;
}

export function RotationPatternPreview({
    pattern,
    patternName = 'Rotation Pattern',
    startDate,
    cyclesShown = 2,
}: RotationPatternPreviewProps) {
    const [currentDate, setCurrentDate] = useState(new Date(startDate || new Date()));
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(null);
    };

    const getDaysInMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date): number => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const calendarDays: CalendarDay[] = useMemo(() => {
        const getPatternDayStatus = (dayIndex: number): boolean => {
            if (!pattern.pattern || pattern.pattern.length === 0) return false;
            const cycleLength = pattern.cycle_length || pattern.pattern.length;
            const patternIndex = dayIndex % cycleLength;
            return pattern.pattern[patternIndex] === 1;
        };

        const days: CalendarDay[] = [];
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const previousMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

        // Previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push({
                date: previousMonthDays - i,
                patternIndex: 0,
                isWorkDay: false,
                isCurrentMonth: false,
            });
        }

        // Current month's days
        const today = new Date();
        const patternStartDate = new Date(startDate || currentDate);
        const daysSincePatternStart = Math.floor((new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime() - patternStartDate.getTime()) / (1000 * 60 * 60 * 24));

        for (let i = 1; i <= daysInMonth; i++) {
            const dayIndex = daysSincePatternStart + i - 1;
            const isToday = today.getDate() === i &&
                today.getMonth() === currentDate.getMonth() &&
                today.getFullYear() === currentDate.getFullYear();

            days.push({
                date: i,
                patternIndex: dayIndex,
                isWorkDay: getPatternDayStatus(dayIndex),
                isToday,
                isCurrentMonth: true,
            });
        }

        // Next month's leading days
        const totalCells = Math.ceil((days.length) / 7) * 7;
        for (let i = days.length; i < totalCells; i++) {
            days.push({
                date: i - days.length + 1,
                patternIndex: 0,
                isWorkDay: false,
                isCurrentMonth: false,
            });
        }

        return days;
    }, [currentDate, pattern, startDate]);

    const getCycleBadges = () => {
        const badges = [];
        for (let i = 0; i < cyclesShown; i++) {
            const startIndex = i * (pattern.cycle_length || pattern.pattern.length);
            const endIndex = startIndex + (pattern.cycle_length || pattern.pattern.length);
            badges.push(
                <Badge key={i} variant="outline">
                    Cycle {i + 1}: Days {startIndex + 1}-{endIndex}
                </Badge>
            );
        }
        return badges;
    };

    const workDaysInView = calendarDays
        .filter((day) => day.isCurrentMonth && day.isWorkDay).length;

    const restDaysInView = calendarDays
        .filter((day) => day.isCurrentMonth && !day.isWorkDay).length;

    const coveragePercentage = calendarDays.filter((day) => day.isCurrentMonth).length > 0
        ? Math.round((workDaysInView / calendarDays.filter((day) => day.isCurrentMonth).length) * 100)
        : 0;

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{patternName}</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={goToToday}
                            className="gap-2"
                        >
                            <Calendar className="h-4 w-4" />
                            Today
                        </Button>
                    </div>

                    {/* Month Navigation */}
                    <div className="flex items-center justify-between gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={goToPreviousMonth}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h3 className="text-sm font-semibold min-w-32 text-center">
                            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={goToNextMonth}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Pattern Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="p-2 bg-blue-50 rounded text-center">
                        <p className="text-xs text-gray-600">Work Days</p>
                        <p className="text-lg font-bold text-blue-600">{workDaysInView}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-center">
                        <p className="text-xs text-gray-600">Rest Days</p>
                        <p className="text-lg font-bold text-gray-600">{restDaysInView}</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded text-center">
                        <p className="text-xs text-gray-600">Coverage</p>
                        <p className="text-lg font-bold text-purple-600">{coveragePercentage}%</p>
                    </div>
                    <div className="p-2 bg-orange-50 rounded text-center">
                        <p className="text-xs text-gray-600">Cycle Length</p>
                        <p className="text-lg font-bold text-orange-600">{pattern.cycle_length || pattern.pattern.length}d</p>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="space-y-2">
                    {/* Day Headers */}
                    <div className="grid grid-cols-7 gap-1">
                        {DAYS_OF_WEEK.map((day) => (
                            <div
                                key={day}
                                className="text-center text-xs font-semibold text-gray-600 py-2"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((day, idx) => {
                            const isSelected = selectedDate &&
                                selectedDate.getDate() === day.date &&
                                (day.isCurrentMonth || currentDate.getMonth() === selectedDate.getMonth());

                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        if (day.isCurrentMonth) {
                                            setSelectedDate(new Date(
                                                currentDate.getFullYear(),
                                                currentDate.getMonth(),
                                                day.date
                                            ));
                                        }
                                    }}
                                    disabled={!day.isCurrentMonth}
                                    className={`aspect-square rounded text-xs font-medium transition-colors flex items-center justify-center relative ${
                                        !day.isCurrentMonth
                                            ? 'text-gray-300 bg-gray-50 cursor-default'
                                            : day.isWorkDay
                                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    } ${isSelected ? 'ring-2 ring-offset-2 ring-blue-400' : ''} ${
                                        day.isToday ? 'font-bold' : ''
                                    }`}
                                    title={
                                        day.isCurrentMonth
                                            ? `${MONTHS[currentDate.getMonth()]} ${day.date}, ${currentDate.getFullYear()} - ${day.isWorkDay ? 'Work Day' : 'Rest Day'}`
                                            : ''
                                    }
                                >
                                    <span>{day.date}</span>
                                    {day.isToday && (
                                        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-yellow-300 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Cycle Indicator */}
                <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">Pattern Cycles:</p>
                    <div className="flex flex-wrap gap-2">
                        {getCycleBadges()}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex gap-4 text-xs border-t pt-3">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-blue-500" />
                        <span>Work Day</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-200" />
                        <span>Rest Day</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-50 border border-gray-300" />
                        <span>Other Month</span>
                    </div>
                </div>

                {/* Pattern Info */}
                <div className="p-3 bg-gray-50 rounded text-xs text-gray-700 space-y-1 border border-gray-200">
                    <p><strong>Pattern:</strong> {pattern.work_days}W/{pattern.rest_days}R</p>
                    <p><strong>Cycle:</strong> {pattern.cycle_length || pattern.pattern.length} days</p>
                    {pattern.description && <p><strong>Description:</strong> {pattern.description}</p>}
                </div>

                {/* Selected Day Details */}
                {selectedDate && (
                    <div className="p-3 bg-blue-50 rounded text-xs border border-blue-200">
                        <p className="font-semibold text-blue-900 mb-1">
                            Selected: {MONTHS[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}
                        </p>
                        <p className="text-blue-700">
                            This is a {
                                calendarDays.find(
                                    (d) =>
                                        d.isCurrentMonth &&
                                        d.date === selectedDate.getDate()
                                )?.isWorkDay
                                    ? 'work day'
                                    : 'rest day'
                            }
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
