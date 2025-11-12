import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ApplicationTable } from '@/components/ats/application-table';
import { ApplicationFilters } from '@/components/ats/application-filters';
import { BulkActionsCard } from '@/components/ats/bulk-actions-card';
import type { PageProps } from '@inertiajs/core';
import type { Application, ApplicationSummary, ApplicationFilters as ApplicationFiltersType } from '@/types/ats-pages';

interface ApplicationsIndexProps extends PageProps {
  applications: Application[];
  statistics: ApplicationSummary;
  filters: ApplicationFiltersType;
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Recruitment', href: '#' },
  { title: 'Applications', href: '/applications' },
];

/**
 * Applications Index Page
 * Displays all applications with filters, search, and bulk actions
 */
export default function ApplicationsIndex({
  applications,
  statistics,
  filters: initialFilters,
}: ApplicationsIndexProps) {
  // Local copy so quick actions can optimistically update UI without a round-trip
  const [apps, setApps] = useState<Application[]>(Array.isArray(applications) ? applications : []);
  const [statusFilter, setStatusFilter] = useState(initialFilters?.status || '');
  const [jobFilter, setJobFilter] = useState(initialFilters?.job || '');
  const [scoreFromFilter, setScoreFromFilter] = useState(initialFilters?.scoreFrom?.toString() || '');
  const [scoreToFilter, setScoreToFilter] = useState(initialFilters?.scoreTo?.toString() || '');
  const [actionApplication, setActionApplication] = useState<Application | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState<string | null>(null);
  const [interviewApplication, setInterviewApplication] = useState<Application | undefined>(undefined);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [interviewFormData, setInterviewFormData] = useState({
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: 60,
    location_type: 'office' as 'office' | 'video_call' | 'phone',
  });

  // Sync prop changes to state
  useEffect(() => {
    if (Array.isArray(applications)) {
      setApps(applications);
    }
  }, [applications]);

  /**
   * Filter applications based on status, job, and score range
   */
  const getFilteredApplications = () => {
    return apps.filter((application) => {
      // Filter by status
      if (statusFilter && application.status !== statusFilter) {
        return false;
      }

      // Filter by job title (case-insensitive)
      if (jobFilter && typeof jobFilter === 'string' && jobFilter.trim()) {
        const query = jobFilter.toLowerCase();
        const jobTitle = application.job_title || '';
        if (!jobTitle.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Filter by score range
      if (application.score !== null && application.score !== undefined) {
        const scoreFrom = scoreFromFilter ? parseInt(scoreFromFilter) : null;
        const scoreTo = scoreToFilter ? parseInt(scoreToFilter) : null;
        if (scoreFrom && application.score < scoreFrom) {
          return false;
        }
        if (scoreTo && application.score > scoreTo) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredApplications = getFilteredApplications();

  const handleFilterChange = () => {
    // Filters are applied in real-time via getFilteredApplications()
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setJobFilter('');
    setScoreFromFilter('');
    setScoreToFilter('');
  };

  const handleShortlistClick = (application: Application) => {
    (async () => {
      console.log('Shortlist application:', application.id);
      // optimistic UI update
      setApps((prev) => prev.map((a) => (a.id === application.id ? { ...a, status: 'shortlisted' } : a)));

      try {
        // simulate server call
        await new Promise((resolve) => setTimeout(resolve, 600));
        console.log('Application shortlisted on server:', application.id);
      } catch (err) {
        console.error('Failed to shortlist application:', application.id, err);
        // rollback on failure (for now simply revert)
        setApps((prev) => prev.map((a) => (a.id === application.id ? application : a)));
      }
    })();
  };

  const handleRejectClick = (application: Application) => {
    setActionApplication(application);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    setIsDeleteLoading(true);
    try {
      console.log('Reject application:', actionApplication?.id);
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Application rejected successfully');
    } finally {
      setIsDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setActionApplication(undefined);
    }
  };

  const handleScheduleInterviewClick = (application: Application) => {
    setInterviewApplication(application);
    setIsInterviewModalOpen(true);
  };

  const handleScheduleInterview = async () => {
    if (!interviewApplication) return;
    try {
      console.log('Schedule interview for application:', interviewApplication.id, interviewFormData);
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log('Interview scheduled successfully');
      setIsInterviewModalOpen(false);
      // Optimistically update the status to interviewed
      setApps((prev) =>
        prev.map((a) =>
          a.id === interviewApplication.id ? { ...a, status: 'interviewed' } : a
        )
      );
    } catch (err) {
      console.error('Failed to schedule interview:', err);
    }
  };

  const toggleSelectApplication = (id: number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredApplications.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredApplications.map((a) => a.id)));
    }
  };

  const handleBulkShortlist = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkLoading(true);
    setBulkAction('shortlist');
    try {
      console.log(`Bulk shortlist ${selectedIds.size} applications:`, Array.from(selectedIds));
      // optimistic UI update
      setApps((prev) =>
        prev.map((a) => (selectedIds.has(a.id) ? { ...a, status: 'shortlisted' } : a))
      );
      // simulate server call
      await new Promise((resolve) => setTimeout(resolve, 700));
      console.log('Bulk shortlist completed on server');
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to bulk shortlist:', err);
    } finally {
      setIsBulkLoading(false);
      setBulkAction(null);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) return;
    setIsBulkLoading(true);
    setBulkAction('reject');
    try {
      console.log(`Bulk reject ${selectedIds.size} applications:`, Array.from(selectedIds));
      // optimistic UI update
      setApps((prev) =>
        prev.map((a) => (selectedIds.has(a.id) ? { ...a, status: 'rejected' } : a))
      );
      // simulate server call
      await new Promise((resolve) => setTimeout(resolve, 700));
      console.log('Bulk reject completed on server');
      setSelectedIds(new Set());
    } catch (err) {
      console.error('Failed to bulk reject:', err);
    } finally {
      setIsBulkLoading(false);
      setBulkAction(null);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Applications" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
            <p className="text-muted-foreground mt-2">
              Manage and track job applications
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.total_applications}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-600">
                  {statistics.submitted}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.shortlisted}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Interviewed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {statistics.interviewed}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Offered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-600">
                  {statistics.offered}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bulk Actions */}
        <BulkActionsCard
          selectedCount={selectedIds.size}
          actions={[
            {
              label: 'Shortlist All',
              onClick: handleBulkShortlist,
              disabled: isBulkLoading,
              loadingText: 'Shortlisting...',
              isLoading: isBulkLoading && bulkAction === 'shortlist',
            },
            {
              label: 'Reject All',
              variant: 'destructive',
              onClick: handleBulkReject,
              disabled: isBulkLoading,
              loadingText: 'Rejecting...',
              isLoading: isBulkLoading && bulkAction === 'reject',
            },
          ]}
          onClear={() => setSelectedIds(new Set())}
          isLoading={isBulkLoading}
        />

        {/* Filters */}
        <ApplicationFilters
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          jobFilter={String(jobFilter)}
          onJobChange={setJobFilter}
          scoreFromFilter={scoreFromFilter}
          onScoreFromChange={setScoreFromFilter}
          scoreToFilter={scoreToFilter}
          onScoreToChange={setScoreToFilter}
          onApplyFilters={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Applications Table */}
        {filteredApplications.length > 0 ? (
          <ApplicationTable
            applications={filteredApplications}
            selectedIds={selectedIds}
            onSelectApplication={toggleSelectApplication}
            onSelectAll={toggleSelectAll}
            onViewClick={(application) => {
              window.location.href = `/hr/ats/applications/${application.id}`;
            }}
            onShortlistClick={handleShortlistClick}
            onRejectClick={handleRejectClick}
            onScheduleInterviewClick={handleScheduleInterviewClick}
          />
        ) : (
          <div className="bg-card rounded-lg border p-8 text-center">
            <p className="text-muted-foreground">No applications found</p>
          </div>
        )}
      </div>

      {/* Reject Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to reject this application from{' '}
              <span className="font-semibold">
                {actionApplication?.candidate_name || 'this candidate'}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={isDeleteLoading}
            >
              {isDeleteLoading ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={isInterviewModalOpen} onOpenChange={setIsInterviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Candidate: <span className="font-semibold">{interviewApplication?.candidate_name}</span>
            </p>
            
            <div>
              <label className="text-sm font-medium">Interview Date</label>
              <input
                type="date"
                value={interviewFormData.scheduled_date}
                onChange={(e) =>
                  setInterviewFormData({ ...interviewFormData, scheduled_date: e.target.value })
                }
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Interview Time</label>
              <input
                type="time"
                value={interviewFormData.scheduled_time}
                onChange={(e) =>
                  setInterviewFormData({ ...interviewFormData, scheduled_time: e.target.value })
                }
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Duration (minutes)</label>
              <input
                type="number"
                value={interviewFormData.duration_minutes}
                onChange={(e) =>
                  setInterviewFormData({
                    ...interviewFormData,
                    duration_minutes: parseInt(e.target.value) || 60,
                  })
                }
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
                min="15"
                step="15"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Location Type</label>
              <select
                value={interviewFormData.location_type}
                onChange={(e) =>
                  setInterviewFormData({
                    ...interviewFormData,
                    location_type: e.target.value as 'office' | 'video_call' | 'phone',
                  })
                }
                className="mt-1 w-full rounded border border-gray-300 px-3 py-2"
              >
                <option value="office">Office</option>
                <option value="video_call">Video Call</option>
                <option value="phone">Phone</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInterviewModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleScheduleInterview}
              disabled={!interviewFormData.scheduled_date || !interviewFormData.scheduled_time}
            >
              Schedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
