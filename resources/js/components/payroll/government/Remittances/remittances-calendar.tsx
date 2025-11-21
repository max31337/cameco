import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CalendarEvent {
  id: number;
  date: string;
  agency: 'BIR' | 'SSS' | 'PhilHealth' | 'Pag-IBIG';
  status: 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'late';
  amount: number;
  report_type: string;
}

interface RemittancesCalendarProps {
  events: CalendarEvent[];
  selectedDate?: string | null;
  onDateSelect?: (date: string) => void;
}

export function RemittancesCalendar({ events, selectedDate, onDateSelect }: RemittancesCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const agencyColors = {
    BIR: { bg: 'bg-red-100', text: 'text-red-800', badge: 'bg-red-500' },
    SSS: { bg: 'bg-blue-100', text: 'text-blue-800', badge: 'bg-blue-500' },
    PhilHealth: { bg: 'bg-green-100', text: 'text-green-800', badge: 'bg-green-500' },
    'Pag-IBIG': { bg: 'bg-orange-100', text: 'text-orange-800', badge: 'bg-orange-500' },
  };

  const statusIcons = {
    pending: Clock,
    paid: CheckCircle,
    overdue: AlertCircle,
    late: AlertCircle,
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (year: number, month: number, day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const days = [];
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
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

  const monthYear = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Remittance Calendar</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="w-40 text-center font-semibold">{monthYear}</div>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Legend */}
          <div className="mb-6 flex flex-wrap gap-4">
            {Object.entries(agencyColors).map(([agency, colors]) => (
              <div key={agency} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${colors.badge}`}></div>
                <span className="text-sm font-medium">{agency}</span>
              </div>
            ))}
          </div>

          {/* Day headers */}
          <div className="mb-2 grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="min-h-24 rounded border border-gray-100 bg-gray-50"></div>;
              }

              const dayEvents = getEventsForDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;

              return (
                <div
                  key={day}
                  className={`min-h-24 rounded border p-2 cursor-pointer transition-colors ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => onDateSelect?.(dateStr)}
                >
                  <div className="mb-2 font-semibold text-gray-700">{day}</div>
                  <div className="space-y-1">
                    {dayEvents.length > 0 ? (
                      dayEvents.map((event) => {
                        const colors = agencyColors[event.agency];
                        const Icon = statusIcons[event.status as keyof typeof statusIcons] || Clock;

                        return (
                          <div key={event.id} className={`rounded px-2 py-1 text-xs ${colors.bg} ${colors.text}`}>
                            <div className="flex items-center gap-1">
                              <Icon className="h-3 w-3" />
                              <span className="font-medium">{event.agency}</span>
                            </div>
                            <div className="text-xs opacity-75">₱{event.amount.toLocaleString('en-PH', { maximumFractionDigits: 0 })}</div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-xs text-gray-400">No events</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">Pending</p>
              <p className="text-sm text-gray-600">Awaiting payment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <p className="font-medium">Paid</p>
              <p className="text-sm text-gray-600">Payment completed on time</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <div>
              <p className="font-medium">Late</p>
              <p className="text-sm text-gray-600">Payment submitted after due date</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-medium">Overdue</p>
              <p className="text-sm text-gray-600">Payment due but not yet submitted</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
