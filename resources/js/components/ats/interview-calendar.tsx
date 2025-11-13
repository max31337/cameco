import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { CalendarMonthView } from '@/components/ats/calendar-month-view';
import { CalendarWeekView } from '@/components/ats/calendar-week-view';
import { CalendarDayView } from '@/components/ats/calendar-day-view';
import type { Interview } from '@/types/ats-pages';

interface InterviewCalendarProps {
  interviews: Interview[];
  view: 'month' | 'week' | 'day';
  onSelectDate: () => void;
  onReschedule: (interview: Interview) => void;
  onAddFeedback: (interview: Interview) => void;
  onCancel: (interview: Interview) => void;
}

/**
 * Interview Calendar Component
 * Reusable calendar wrapper supporting month, week, and day views
 * Manages calendar navigation and view switching
 */
export function InterviewCalendar({
  interviews,
  view,
  onSelectDate,
  onReschedule,
  onAddFeedback,
  onCancel,
}: InterviewCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Navigate to previous period
  const handlePreviousPeriod = () => {
    setCurrentDate((prevDate) => {
      if (view === 'month') {
        return new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
      } else if (view === 'week') {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() - 7);
        return newDate;
      } else {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() - 1);
        return newDate;
      }
    });
  };

  // Navigate to next period
  const handleNextPeriod = () => {
    setCurrentDate((prevDate) => {
      if (view === 'month') {
        return new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
      } else if (view === 'week') {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() + 7);
        return newDate;
      } else {
        const newDate = new Date(prevDate);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
      }
    });
  };

  // Go to today
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get period label based on view
  const getPeriodLabel = () => {
    if (view === 'month') {
      return currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } else if (view === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${weekStart.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${weekEnd.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`;
    } else {
      return currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  return (
    <Card>
      {/* Calendar Header with Navigation */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Period Display */}
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">{getPeriodLabel()}</h2>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPeriod}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="h-8 px-3"
            >
              Today
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPeriod}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="p-4">
        {view === 'month' && (
          <CalendarMonthView
            interviews={interviews}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onSelectDate={onSelectDate}
            onReschedule={onReschedule}
            onAddFeedback={onAddFeedback}
            onCancel={onCancel}
          />
        )}

        {view === 'week' && (
          <CalendarWeekView
            interviews={interviews}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onSelectDate={onSelectDate}
            onReschedule={onReschedule}
            onAddFeedback={onAddFeedback}
            onCancel={onCancel}
          />
        )}

        {view === 'day' && (
          <CalendarDayView
            interviews={interviews}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            onReschedule={onReschedule}
            onAddFeedback={onAddFeedback}
            onCancel={onCancel}
          />
        )}
      </div>
    </Card>
  );
}
