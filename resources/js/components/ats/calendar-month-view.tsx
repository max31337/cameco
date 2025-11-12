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

interface CalendarMonthViewProps {
  interviews: Interview[];
  currentDate: Date;
  onSelectDate: () => void;
  onReschedule: (interview: Interview) => void;
  onAddFeedback: (interview: Interview) => void;
  onCancel: (interview: Interview) => void;
}

/**
 * Calendar Month View Component
 * Displays a 7-column grid (Sun-Sat) with interview dots/count on each day
 * Fully reusable for any calendar-based interface
 */
export function CalendarMonthView({
  interviews,
  currentDate,
  onSelectDate,
  onReschedule,
  onAddFeedback,
  onCancel,
}: CalendarMonthViewProps) {
  // Get first day of month and number of days
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  // Generate array of dates to display
  const getDaysArray = () => {
    const days = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  };

  const days = getDaysArray();

  // Get interviews for a specific date
  const getInterviewsForDate = (date: Date) => {
    return interviews.filter((interview) => {
      const interviewDate = new Date(interview.scheduled_date);
      return (
        interviewDate.getFullYear() === date.getFullYear() &&
        interviewDate.getMonth() === date.getMonth() &&
        interviewDate.getDate() === date.getDate()
      );
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

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map((day) => (
          <div
            key={day}
            className="flex h-10 items-center justify-center font-semibold text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          const dayInterviews = getInterviewsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date);
          const isTodayDate = isToday(date);

          return (
            <div
              key={idx}
              className={`min-h-32 rounded-lg border p-2 ${
                isTodayDate
                  ? 'border-blue-500 bg-blue-50'
                  : isCurrentMonthDay
                    ? 'bg-white'
                    : 'bg-gray-50'
              }`}
            >
              {/* Date Number */}
              <div
                className={`text-sm font-semibold ${
                  isCurrentMonthDay
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {date.getDate()}
              </div>

              {/* Interview Count */}
              {dayInterviews.length > 0 && (
                <div className="mt-1 space-y-1">
                  {dayInterviews.slice(0, 2).map((interview) => (
                    <div
                      key={interview.id}
                      className="group relative rounded bg-blue-100 p-1 text-xs"
                    >
                      <div className="truncate font-medium text-blue-900">
                        {interview.candidate_name}
                      </div>
                      <div className="truncate text-blue-800">
                        {interview.scheduled_time}
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

                  {dayInterviews.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayInterviews.length - 2} more
                    </div>
                  )}
                </div>
              )}

              {/* Add Interview Button */}
              {isCurrentMonthDay && dayInterviews.length === 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-6 text-xs text-muted-foreground hover:text-foreground"
                  onClick={onSelectDate}
                >
                  + Add
                </Button>
              )}
            </div>
          );
        })}
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
