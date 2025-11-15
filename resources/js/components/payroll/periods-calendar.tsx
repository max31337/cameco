import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PeriodDetailsModal } from './period-details-modal';
import type { PayrollPeriod } from '@/types/payroll-pages';

interface PeriodsCalendarProps {
    periods: PayrollPeriod[];
}

type MonthYear = {
    month: number;
    year: number;
};

export function PeriodsCalendar({ periods }: PeriodsCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState<MonthYear>({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    });
    const [selectedPeriod, setSelectedPeriod] = useState<PayrollPeriod | null>(null);

    // Get status colors
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-800 border border-gray-300',
            calculating: 'bg-blue-100 text-blue-800 border border-blue-300',
            paid: 'bg-green-100 text-green-800 border border-green-300',
            approved: 'bg-indigo-100 text-indigo-800 border border-indigo-300',
        };
        return colors[status] || colors.draft;
    };

    // Get periods for current month
    const periodsInMonth = useMemo(() => {
        return periods.filter((period) => {
            const startDate = new Date(period.start_date);
            return (
                startDate.getMonth() === currentMonth.month &&
                startDate.getFullYear() === currentMonth.year
            );
        });
    }, [periods, currentMonth]);

    // Generate calendar grid
    const calendarDays = useMemo(() => {
        const firstDay = new Date(currentMonth.year, currentMonth.month, 1);
        const lastDay = new Date(currentMonth.year, currentMonth.month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const current = new Date(startDate);

        while (current <= lastDay) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        // Fill remaining cells
        while (days.length % 7 !== 0) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    }, [currentMonth]);

    // Get periods that overlap with a given date
    const getPeriodsForDate = (date: Date) => {
        return periods.filter((period) => {
            const startDate = new Date(period.start_date);
            const endDate = new Date(period.end_date);
            return date >= startDate && date <= endDate;
        });
    };

    // Navigate months
    const previousMonth = () => {
        setCurrentMonth((prev) => {
            if (prev.month === 0) {
                return { month: 11, year: prev.year - 1 };
            }
            return { month: prev.month - 1, year: prev.year };
        });
    };

    const nextMonth = () => {
        setCurrentMonth((prev) => {
            if (prev.month === 11) {
                return { month: 0, year: prev.year + 1 };
            }
            return { month: prev.month + 1, year: prev.year };
        });
    };

    const monthName = new Date(currentMonth.year, currentMonth.month).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="space-y-6">
            {/* Calendar Controls */}
            <Card className="p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">{monthName}</h2>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={previousMonth}
                            className="w-10 h-10 p-0"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const today = new Date();
                                setCurrentMonth({
                                    month: today.getMonth(),
                                    year: today.getFullYear(),
                                });
                            }}
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={nextMonth}
                            className="w-10 h-10 p-0"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Calendar Grid */}
                <div className="space-y-4">
                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {dayNames.map((day) => (
                            <div
                                key={day}
                                className="text-center font-semibold text-gray-700 py-2"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, idx) => {
                            const isCurrentMonth =
                                date.getMonth() === currentMonth.month &&
                                date.getFullYear() === currentMonth.year;
                            const isToday =
                                date.toDateString() === new Date().toDateString();
                            const dayPeriods = getPeriodsForDate(date);

                            return (
                                <div
                                    key={idx}
                                    className={`min-h-24 p-2 border rounded-lg transition-colors ${
                                        isCurrentMonth
                                            ? isToday
                                                ? 'bg-blue-50 border-blue-300'
                                                : 'bg-white border-gray-200'
                                            : 'bg-gray-50 border-gray-100'
                                    }`}
                                >
                                    <div className="text-sm font-semibold text-gray-700 mb-1">
                                        {date.getDate()}
                                    </div>
                                    <div className="space-y-1">
                                        {dayPeriods.length > 0 ? (
                                            dayPeriods.map((period) => (
                                                <div
                                                    key={period.id}
                                                    className={`text-xs p-1 rounded cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(
                                                        period.status
                                                    )}`}
                                                    title={`${period.name}\nStatus: ${period.status}`}
                                                    onClick={() => setSelectedPeriod(period)}
                                                >
                                                    <div className="font-medium truncate">
                                                        {period.name.split(' - ')[1] ||
                                                            'Period'}
                                                    </div>
                                                    <div className="text-xs opacity-75">
                                                        {new Date(
                                                            period.pay_date
                                                        ).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-xs text-gray-400">
                                                {isCurrentMonth ? '-' : ''}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Legend</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { status: 'draft', label: 'Draft' },
                            { status: 'calculating', label: 'Calculating' },
                            { status: 'paid', label: 'Paid' },
                            { status: 'approved', label: 'Approved' },
                        ].map((item) => (
                            <div key={item.status} className="flex items-center gap-2">
                                <div
                                    className={`w-6 h-6 rounded border ${getStatusColor(
                                        item.status
                                    )}`}
                                ></div>
                                <span className="text-sm text-gray-700">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Periods Summary for Current Month */}
            {periodsInMonth.length > 0 && (
                <Card className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Payroll Periods - {monthName}
                    </h2>
                    <div className="space-y-3">
                        {periodsInMonth.map((period) => (
                            <div
                                key={period.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => setSelectedPeriod(period)}
                            >
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{period.name}</h3>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {new Date(period.start_date).toLocaleDateString()} -{' '}
                                        {new Date(period.end_date).toLocaleDateString()}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Pay Date:{' '}
                                        {new Date(period.pay_date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {period.total_employees} employees
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            ₱
                                            {Number(period.total_gross_pay).toLocaleString(
                                                'en-PH',
                                                { maximumFractionDigits: 0 }
                                            )}
                                        </div>
                                    </div>
                                    <Badge className={`capitalize ${getStatusColor(period.status)}`}>
                                        {period.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Period Details Modal */}
            <PeriodDetailsModal
                period={selectedPeriod}
                onClose={() => setSelectedPeriod(null)}
            />
        </div>
    );
}
