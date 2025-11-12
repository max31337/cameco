import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
import type { Interview } from '@/types/ats-pages';

interface CalendarWeekViewProps {
  interviews: Interview[];
  currentDate: Date;
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
  onSelectDate,
  onReschedule,
  onAddFeedback,
  onCancel,
}: CalendarWeekViewProps) {
  // Get the start of the week (Sunday)
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

  return (
    <div className="space-y-4">
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
                      className="min-h-16 border rounded-lg p-1 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={onSelectDate}
                    >
                      {dayInterviews.length > 0 && (
                        <div className="space-y-1">
                          {dayInterviews.map((interview) => (
                            <div
                              key={interview.id}
                              className="group relative rounded bg-blue-100 p-1 text-xs hover:bg-blue-200 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="truncate font-medium text-blue-900">
                                {interview.candidate_name}
                              </div>
                              <div className="truncate text-blue-800">
                                {interview.job_title}
                              </div>

                              {/* Action Menu on Hover */}
                              <div className="absolute right-0 top-0 hidden group-hover:flex">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-5 w-5 p-0"
                                    >
                                      <MoreVertical className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-32">
                                    <DropdownMenuItem
                                      onClick={() => onReschedule(interview)}
                                    >
                                      Reschedule
                                    </DropdownMenuItem>
                                    {interview.status === 'scheduled' && (
                                      <DropdownMenuItem
                                        onClick={() => onAddFeedback(interview)}
                                      >
                                        Add Feedback
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() => onCancel(interview)}
                                      className="text-red-600"
                                    >
                                      Cancel
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          ))}
                        </div>
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
          <div className="h-3 w-3 rounded bg-blue-100" />
          <span>Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-green-100" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-orange-100" />
          <span>No Show</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-red-100" />
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
}
