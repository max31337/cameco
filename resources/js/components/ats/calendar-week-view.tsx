import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { InterviewStatusBadge } from './interview-status-badge';
import { InterviewActionsMenu } from './interview-actions-menu';
import { InterviewScheduleModal } from './interview-schedule-modal';
import { Plus } from 'lucide-react';
import { hasAvailableSlots, getAvailableTimeSlots } from '@/utils/office-hours';
import type { Interview } from '@/types/ats-pages';

interface CalendarWeekViewProps {
  interviews: Interview[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onSelectDate: () => void;
  onReschedule: (interview: Interview) => void;
  onAddFeedback: (interview: Interview) => void;
  onCancel: (interview: Interview) => void;
}

/**
 * Calendar Week View Component
 * Displays a 7-day horizontal layout with hourly time slots
 * Shows interviews positioned by their scheduled time
 * Fully reusable for any calendar-based interface
 */
export function CalendarWeekView({
  interviews,
  currentDate,
  onDateChange,
  onReschedule,
  onAddFeedback,
  onCancel,
}: CalendarWeekViewProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDateForScheduling, setSelectedDateForScheduling] = useState<Date | null>(null);

  const openScheduleModal = (date: Date) => {
    setSelectedDateForScheduling(date);
    setShowScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedDateForScheduling(null);
  };
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  // Generate array of dates for the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    return day;
  });

  // Time slots (8 AM to 6 PM)
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = 8 + i;
    return `${hour}:00`;
  });

  // Day names
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Get interviews for a specific date and time
  const getInterviewsForSlot = (date: Date, hour: number) => {
    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.scheduled_date);
      if (
        interviewDate.getFullYear() !== date.getFullYear() ||
        interviewDate.getMonth() !== date.getMonth() ||
        interviewDate.getDate() !== date.getDate()
      ) {
        return false;
      }

      // Parse time (e.g., "10:00 AM")
      const timeParts = interview.scheduled_time.split(':');
      if (timeParts.length < 2) return false;

      let interviewHour = parseInt(timeParts[0]);
      const isPM = interview.scheduled_time.toLowerCase().includes('pm');

      if (isPM && interviewHour !== 12) interviewHour += 12;
      if (!isPM && interviewHour === 12) interviewHour = 0;

      return interviewHour === hour;
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // Generate month and year options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Calculate week number
  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() + 1;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  };

  // Get weeks in current month
  const getWeeksInMonth = (): number[] => {
    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);
    
    const weeks = new Set<number>();
    const current = new Date(monthStart);
    current.setDate(current.getDate() - current.getDay()); // Start from Sunday
    
    while (current <= monthEnd) {
      weeks.add(getWeekNumber(current));
      current.setDate(current.getDate() + 7);
    }
    
    return Array.from(weeks).sort((a, b) => a - b);
  };

  const weeksInMonth = getWeeksInMonth();
  const currentWeek = getWeekNumber(startOfWeek);

  // Get available years and months from interview data
  const getAvailableYearsAndMonths = () => {
    const yearsMap = new Map<number, Set<number>>();
    interviews.forEach((interview) => {
      const date = new Date(interview.scheduled_date);
      const year = date.getFullYear();
      const month = date.getMonth();
      if (!yearsMap.has(year)) {
        yearsMap.set(year, new Set());
      }
      yearsMap.get(year)!.add(month);
    });
    return yearsMap;
  };

  const availableYearsAndMonthsMap = getAvailableYearsAndMonths();

//const availableYears = Array.from(availableYearsAndMonthsMap.keys()).sort() as number[];  for future use
  const availableMonthsInYear = Array.from(
    availableYearsAndMonthsMap.get(currentYear) || new Set()
  ).sort() as number[];

  // Generate year options
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    onDateChange(newDate);
  };

  const handleWeekChange = (week: number) => {
    // Calculate the date for the start of the week
    const newDate = new Date(currentYear, 0, 1);
    const dayNum = newDate.getUTCDay() + 1;
    newDate.setUTCDate(newDate.getUTCDate() + 4 - dayNum);
    newDate.setDate(newDate.getDate() + (week - 1) * 7);
    onDateChange(newDate);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    onDateChange(newDate);
  };

  return (
    <div className="space-y-4">
      {/* Date Picker Controls */}
      <div className="flex items-center justify-between gap-2 rounded-lg border p-4 bg-muted/50 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Month:</span>
          <select
            value={currentMonth}
            onChange={(e) => handleMonthChange(parseInt(e.target.value))}
            className="px-3 py-2 rounded-md border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {months.map((month, idx) => {
              const hasData = availableMonthsInYear.includes(idx);
              return (
                <option key={month} value={idx} disabled={!hasData}>
                  {month} {!hasData ? '(no data)' : ''}
                </option>
              );
            })}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Week:</span>
          <select
            value={currentWeek}
            onChange={(e) => handleWeekChange(parseInt(e.target.value))}
            className="px-3 py-2 rounded-md border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {weeksInMonth.map((week) => (
              <option key={week} value={week}>
                Week {week}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Year:</span>
          <select
            value={currentYear}
            onChange={(e) => handleYearChange(parseInt(e.target.value))}
            className="px-3 py-2 rounded-md border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {yearOptions.map((year) => {
              const hasData = availableYearsAndMonthsMap.has(year);
              return (
                <option key={year} value={year} disabled={!hasData}>
                  {year} {!hasData ? '(no data)' : ''}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Week Header */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Day Headers */}
          <div className="grid gap-1 border-b pb-2" style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
            <div className="text-xs font-semibold text-muted-foreground">Time</div>
            {weekDays.map((day, idx) => (
              <div
                key={idx}
                className={`text-center text-sm font-semibold px-2 py-1 rounded ${
                  isToday(day)
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-foreground'
                }`}
              >
                <div>{dayNames[day.getDay()]}</div>
                <div className="text-xs text-muted-foreground">{day.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((time, timeIdx) => {
            const hour = 8 + timeIdx;
            return (
              <div
                key={time}
                className="grid gap-1 border-b py-2"
                style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}
              >
                <div className="text-xs font-medium text-muted-foreground text-center">{time}</div>

                {weekDays.map((day, dayIdx) => {
                  const dayInterviews = getInterviewsForSlot(day, hour);

                  return (
                    <div
                      key={`${dayIdx}-${timeIdx}`}
                      className="min-h-16 border rounded-lg p-1 bg-white hover:bg-gray-50 transition-colors overflow-visible relative flex flex-col justify-between"
                    >
                      {dayInterviews.length > 0 && (
                        <div className="space-y-1">
                          {dayInterviews.map((interview) => {
                            // Get status color
                            const getStatusColor = (status: string) => {
                              switch (status) {
                                case 'scheduled':
                                  return { bg: 'bg-blue-100 hover:bg-blue-200', text: 'text-blue-900', subtext: 'text-blue-800' };
                                case 'completed':
                                  return { bg: 'bg-green-100 hover:bg-green-200', text: 'text-green-900', subtext: 'text-green-800' };
                                case 'cancelled':
                                  return { bg: 'bg-red-100 hover:bg-red-200', text: 'text-red-900', subtext: 'text-red-800' };
                                case 'no_show':
                                  return { bg: 'bg-orange-100 hover:bg-orange-200', text: 'text-orange-900', subtext: 'text-orange-800' };
                                default:
                                  return { bg: 'bg-blue-100 hover:bg-blue-200', text: 'text-blue-900', subtext: 'text-blue-800' };
                              }
                            };
                            const colors = getStatusColor(interview.status);

                            return (
                            <div key={interview.id} className="relative w-full">
                              {/* Clickable card - NO Link, NO onClick handler inside the menu area */}
                              <div
                                onClick={() => {
                                  if (interview.id) {
                                    router.visit(`/hr/ats/interviews/${interview.id}`);
                                  }
                                }}
                                className={`block rounded cursor-pointer ${colors.bg} p-1 text-xs transition-colors ${
                                  !interview.id ? 'pointer-events-none opacity-50' : ''
                                }`}
                              >
                                <div className={`truncate font-medium ${colors.text}`}>
                                  {interview.candidate_name}
                                </div>
                                <div className={`truncate ${colors.subtext}`}>
                                  {interview.job_title}
                                </div>
                              </div>
                              
                              {/* Menu button - ALWAYS VISIBLE in week view */}
                              <div className="absolute top-0 right-0 flex items-start">
                                <InterviewActionsMenu
                                  interview={interview}
                                  onReschedule={onReschedule}
                                  onAddFeedback={onAddFeedback}
                                  onCancel={onCancel}
                                  size="sm"
                                />
                              </div>
                            </div>
                            );
                          })}
                        </div>
                      )}
                      {dayInterviews.length === 0 && hasAvailableSlots(day, interviews) && (
                        <button
                          onClick={() => openScheduleModal(day)}
                          className="text-xs text-muted-foreground hover:text-foreground cursor-pointer py-1 rounded hover:bg-blue-50 transition-colors w-full"
                          title="Add interview"
                        >
                          <Plus className="h-3 w-3 mx-auto" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 border-t pt-4 text-xs">
        <div className="flex items-center gap-2">
          <InterviewStatusBadge status="scheduled" />
        </div>
        <div className="flex items-center gap-2">
          <InterviewStatusBadge status="completed" />
        </div>
        <div className="flex items-center gap-2">
          <InterviewStatusBadge status="no_show" />
        </div>
        <div className="flex items-center gap-2">
          <InterviewStatusBadge status="cancelled" />
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {selectedDateForScheduling && (
        <InterviewScheduleModal
          isOpen={showScheduleModal}
          onClose={closeScheduleModal}
          onSubmit={async (data) => {
            // Handle scheduling logic here
            console.log('Schedule interview:', data);
          }}
          selectedDate={selectedDateForScheduling}
          interviews={interviews}
          availableTimeSlots={getAvailableTimeSlots(selectedDateForScheduling, interviews)}
        />
      )}
    </div>
  );
}
