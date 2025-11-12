import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Clock, MapPin } from 'lucide-react';
import type { Interview } from '@/types/ats-pages';

interface CalendarDayViewProps {
  interviews: Interview[];
  currentDate: Date;
  onSelectDate: () => void;
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
  onSelectDate,
  onReschedule,
  onAddFeedback,
  onCancel,
}: CalendarDayViewProps) {
  // Filter interviews for the current day
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

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no_show':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-4">
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
        <div className="space-y-3">
          {sortedInterviews.map((interview) => (
            <Card key={interview.id} className={`border-2 ${getStatusColor(interview.status)}`}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {/* Interview Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{interview.candidate_name}</h3>
                      <p className="text-sm text-muted-foreground">{interview.job_title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusBadgeColor(interview.status)}`}
                      >
                        {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onReschedule(interview)}>
                            Reschedule
                          </DropdownMenuItem>
                          {interview.status === 'scheduled' && (
                            <DropdownMenuItem onClick={() => onAddFeedback(interview)}>
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
                          {interview.location_type.replace('_', ' ')}
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
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No interviews scheduled for this day</p>
              <Button onClick={onSelectDate}>Schedule Interview</Button>
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
              <div className="h-3 w-3 rounded bg-blue-100 border border-blue-200" />
              <span>Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-100 border border-green-200" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-orange-100 border border-orange-200" />
              <span>No Show</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-red-100 border border-red-200" />
              <span>Cancelled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
