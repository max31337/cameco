import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Plus } from 'lucide-react';
import { InterviewStatusBadge } from './interview-status-badge';
import { InterviewActionsMenu } from './interview-actions-menu';
import { InterviewScheduleModal } from './interview-schedule-modal';
import { hasAvailableSlots, getAvailableTimeSlots } from '@/utils/office-hours';
import type { Interview } from '@/types/ats-pages';

interface CalendarDayViewProps {
  interviews: Interview[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onReschedule: (interview: Interview) => void;
  onAddFeedback: (interview: Interview) => void;
  onCancel: (interview: Interview) => void;
}

/**
 * Calendar Day View Component
 * Displays a single day with 30-minute time slots
 * Shows detailed interview information for each slot
 * Fully reusable for any calendar-based interface
 */
export function CalendarDayView({
  interviews,
  currentDate,
  onDateChange,
  onReschedule,
  onAddFeedback,
  onCancel,
}: CalendarDayViewProps) {
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const openScheduleModal = () => {
    setShowScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
  };

  // Parse time string to minutes since 8 AM
  const parseTime = (timeStr: string): number => {
    const timeParts = timeStr.split(':');
    if (timeParts.length < 2) return 0;

    let hour = parseInt(timeParts[0]);
    const minute = parseInt(timeParts[1]) || 0;
    const isPM = timeStr.toLowerCase().includes('pm');

    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    return (hour - 8) * 60 + minute;
  };

  const dayInterviews = interviews.filter((interview) => {
    const interviewDate = new Date(interview.scheduled_date);
    return (
      interviewDate.getFullYear() === currentDate.getFullYear() &&
      interviewDate.getMonth() === currentDate.getMonth() &&
      interviewDate.getDate() === currentDate.getDate()
    );
  });

  // Sort interviews by time
  const sortedInterviews = dayInterviews.sort((a, b) => {
    const timeA = parseTime(a.scheduled_time);
    const timeB = parseTime(b.scheduled_time);
    return timeA - timeB;
  });

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 border-blue-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'cancelled':
        return 'bg-red-50 border-red-200';
      case 'no_show':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Generate month and year options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

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

  const currentWeek = getWeekNumber(currentDate);
  const weeksInMonth = getWeeksInMonth();

  // Get available years and months from interview data
  const getAvailableYearsAndMonths = (): Map<number, Set<number>> => {
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
 // const availableYears = Array.from(availableYearsAndMonthsMap.keys()).sort() as number[]; for future use
  const availableMonthsInYear = Array.from(
    availableYearsAndMonthsMap.get(currentYear) || new Set()
  ).sort() as number[];

  // Generate year options
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const handleDayChange = (day: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(day);
    onDateChange(newDate);
  };

  const handleMonthChange = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    // Adjust day if it exceeds days in new month
    const daysInNewMonth = new Date(newDate.getFullYear(), monthIndex + 1, 0).getDate();
    if (newDate.getDate() > daysInNewMonth) {
      newDate.setDate(daysInNewMonth);
    }
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
          <span className="text-sm font-semibold">Day:</span>
          <select
            value={currentDay}
            onChange={(e) => handleDayChange(parseInt(e.target.value))}
            className="px-3 py-2 rounded-md border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
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

      {/* Day Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{formatDate(currentDate)}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {dayInterviews.length} interview{dayInterviews.length !== 1 ? 's' : ''} scheduled
          </p>
        </CardHeader>
      </Card>

      {/* Interviews */}
      {sortedInterviews.length > 0 ? (
        <>
          <div className="space-y-3">
            {sortedInterviews.map((interview) => (
              <div key={interview.id} className="group relative">
                {/* Clickable card - NO Link wrapper */}
                <div
                  onClick={() => {
                    if (interview.id) {
                      router.visit(`/hr/ats/interviews/${interview.id}`);
                    }
                  }}
                  className={`block no-underline hover:opacity-90 transition-opacity cursor-pointer ${
                    !interview.id ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  <Card className={`border-2 hover:shadow-lg transition-shadow ${getStatusColor(interview.status)}`}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {/* Interview Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{interview.candidate_name}</h3>
                            <p className="text-sm text-muted-foreground">{interview.job_title}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <InterviewStatusBadge status={interview.status} />
                          </div>
                        </div>

                        {/* Interview Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground text-xs">Time</p>
                              <p className="font-medium">{interview.scheduled_time}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Duration</p>
                            <p className="font-medium">{interview.duration_minutes} min</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-muted-foreground text-xs">Location</p>
                              <p className="font-medium capitalize">
                                {interview.location_type ? interview.location_type.replace('_', ' ') : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Interviewer</p>
                            <p className="font-medium">{interview.interviewer_name || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Additional Info */}
                        {interview.notes && (
                          <div className="border-t pt-3">
                            <p className="text-muted-foreground text-xs">Notes</p>
                            <p className="text-sm">{interview.notes}</p>
                          </div>
                        )}

                        {interview.feedback && (
                          <div className="border-t pt-3">
                            <p className="text-muted-foreground text-xs">Feedback</p>
                            <p className="text-sm">{interview.feedback}</p>
                            {interview.score && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Score:</span>
                                <span className="font-semibold">{interview.score}/10</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Score Display for Completed */}
                        {interview.status === 'completed' && interview.score && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded border border-green-200">
                            <p className="text-xs text-muted-foreground">Overall Score</p>
                            <p className="text-lg font-bold text-green-700">{interview.score}/10</p>
                            {interview.recommendation && (
                              <p className="text-xs mt-1 text-green-600">
                                Recommendation:{' '}
                                <span className="font-semibold">
                                  {interview.recommendation.charAt(0).toUpperCase() +
                                    interview.recommendation.slice(1)}
                                </span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Action Menu - Positioned outside card */}
                {/* Portal container - prevents transform/overflow issues */}
                <div className="absolute right-6 top-4 hidden group-hover:block z-50 pointer-events-auto" style={{ transform: 'none' }}>
                  <InterviewActionsMenu
                    interview={interview}
                    onReschedule={onReschedule}
                    onAddFeedback={onAddFeedback}
                    onCancel={onCancel}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Add Interview Button - Show if there are interviews but available slots */}
          {hasAvailableSlots(currentDate, interviews) && (
            <div className="flex justify-center">
              <Button onClick={openScheduleModal} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Another Interview
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No interviews scheduled for this day</p>
              {hasAvailableSlots(currentDate, interviews) ? (
                <Button onClick={openScheduleModal} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule Interview
                </Button>
              ) : (
                <p className="text-sm text-yellow-600">No available time slots within office hours</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 text-sm">
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
        </CardContent>
      </Card>

      {/* Schedule Interview Modal */}
      <InterviewScheduleModal
        isOpen={showScheduleModal}
        onClose={closeScheduleModal}
        onSubmit={async (data) => {
          // Handle scheduling logic here
          console.log('Schedule interview:', data);
        }}
        selectedDate={currentDate}
        interviews={interviews}
        availableTimeSlots={getAvailableTimeSlots(currentDate, interviews)}
      />
    </div>
  );
}
