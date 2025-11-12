import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, List, Plus } from 'lucide-react';
import { InterviewCalendar } from '@/components/ats/interview-calendar';
import { InterviewTable } from '@/components/ats/interview-table';
import { InterviewScheduleModal } from '@/components/ats/interview-schedule-modal';
import type { PageProps } from '@inertiajs/core';
import type { Interview, InterviewStatus } from '@/types/ats-pages';

interface InterviewsIndexProps extends PageProps {
  interviews: Interview[];
  statistics: {
    total_interviews: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    no_show: number;
    upcoming_this_week: number;
  };
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'HR', href: '/hr/dashboard' },
  { title: 'Recruitment', href: '#' },
  { title: 'Interviews', href: '/hr/ats/interviews' },
];

/**
 * Interviews Index Page
 * Displays all interviews with calendar view (month/week/day) or list view
 * Supports scheduling new interviews, viewing details, rescheduling, and feedback
 */
export default function InterviewsIndex({
  interviews,
  statistics,
}: InterviewsIndexProps) {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<InterviewStatus | 'all'>('all');
  const [filterInterviewer, setFilterInterviewer] = useState<string>('all');

  // Get unique interviewers for filter dropdown
  const interviewers = Array.from(
    new Set(interviews.map((i) => i.interviewer_name).filter(Boolean))
  ) as string[];

  // Filter interviews based on selected filters
  const getFilteredInterviews = () => {
    return interviews.filter((interview) => {
      if (filterStatus !== 'all' && interview.status !== filterStatus) {
        return false;
      }
      if (
        filterInterviewer !== 'all' &&
        interview.interviewer_name !== filterInterviewer
      ) {
        return false;
      }
      return true;
    });
  };

  const filteredInterviews = getFilteredInterviews();

  const handleScheduleInterview = async (data: {
    scheduled_date: string;
    scheduled_time: string;
    duration_minutes: number;
    location_type: string;
  }) => {
    console.log('Schedule interview:', data);
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log('Interview scheduled successfully');
    setIsScheduleModalOpen(false);
  };

  const handleRescheduleInterview = (interview: Interview) => {
    console.log('Reschedule interview:', interview.id);
    setIsScheduleModalOpen(true);
  };

  const handleDeleteInterview = (interview: Interview) => {
    console.log('Delete interview:', interview.id);
  };

  const handleAddFeedback = (interview: Interview) => {
    console.log('Add feedback for interview:', interview.id);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Interviews" />

      <div className="space-y-6 p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Interviews</h1>
            <p className="text-muted-foreground mt-2">
              Manage and schedule interviews for candidates
            </p>
          </div>
          <Button onClick={() => setIsScheduleModalOpen(true)} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Scheduled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{statistics.scheduled}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {statistics.completed}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cancelled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {statistics.cancelled}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                No Show
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-orange-600">
                {statistics.no_show}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-600">
                {statistics.upcoming_this_week}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls & Filters Card */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              {/* Top Row: View Mode & Calendar View Tabs */}
              <div className="flex items-center justify-between gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">View:</span>
                  <Button
                    variant={viewMode === 'calendar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('calendar')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Calendar
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="mr-2 h-4 w-4" />
                    List
                  </Button>
                </div>

                {/* Calendar View Tabs (only show when in calendar view) */}
                {viewMode === 'calendar' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">Period:</span>
                    <Button
                      variant={
                        calendarView === 'month' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setCalendarView('month')}
                    >
                      Month
                    </Button>
                    <Button
                      variant={
                        calendarView === 'week' ? 'default' : 'outline'
                      }
                      size="sm"
                      onClick={() => setCalendarView('week')}
                    >
                      Week
                    </Button>
                    <Button
                      variant={calendarView === 'day' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCalendarView('day')}
                    >
                      Day
                    </Button>
                  </div>
                )}
              </div>

              {/* Bottom Row: Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-muted-foreground">Filter:</span>
                
                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Status:{' '}
                      {filterStatus === 'all'
                        ? 'All'
                        : filterStatus.charAt(0).toUpperCase() +
                          filterStatus.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus('scheduled')}
                    >
                      Scheduled
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus('completed')}
                    >
                      Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus('cancelled')}
                    >
                      Cancelled
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus('no_show')}>
                      No Show
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Interviewer Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Interviewer:{' '}
                      {filterInterviewer === 'all'
                        ? 'All'
                        : filterInterviewer}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setFilterInterviewer('all')}>
                      All
                    </DropdownMenuItem>
                    {interviewers.map((interviewer) => (
                      <DropdownMenuItem
                        key={interviewer}
                        onClick={() => setFilterInterviewer(interviewer)}
                      >
                        {interviewer}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content Section */}
        {viewMode === 'calendar' ? (
          <div className="space-y-4">
            {/* Calendar Component */}
            <InterviewCalendar
              interviews={filteredInterviews}
              view={calendarView}
              onSelectDate={() => {
                setIsScheduleModalOpen(true);
              }}
              onReschedule={handleRescheduleInterview}
              onAddFeedback={handleAddFeedback}
              onCancel={handleDeleteInterview}
            />

          </div>
        ) : (
          <div>
            {/* List View */}
            <InterviewTable
              interviews={filteredInterviews}
              onReschedule={handleRescheduleInterview}
              onAddFeedback={handleAddFeedback}
              onCancel={handleDeleteInterview}
            />
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <InterviewScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
        }}
        onSubmit={handleScheduleInterview}
        candidateName="Select Candidate"
        applicationId={0}
      />
    </AppLayout>
  );
}
