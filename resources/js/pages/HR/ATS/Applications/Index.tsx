import React, { useState } from 'react';
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
import type { PageProps } from '@inertiajs/core';
import type { Application, ApplicationSummary, ApplicationFilters as ApplicationFiltersType } from '@/types/ats-pages';

interface ApplicationsIndexProps extends PageProps {
  applications: Application[];
  statistics: ApplicationSummary;
  filters: ApplicationFiltersType;
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'HR', href: '/hr/dashboard' },
  { title: 'Recruitment', href: '#' },
  { title: 'Applications', href: '/hr/ats/applications' },
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
  const [statusFilter, setStatusFilter] = useState(initialFilters?.status || '');
  const [jobFilter, setJobFilter] = useState(initialFilters?.job || '');
  const [scoreFromFilter, setScoreFromFilter] = useState(initialFilters?.scoreFrom?.toString() || '');
  const [scoreToFilter, setScoreToFilter] = useState(initialFilters?.scoreTo?.toString() || '');
  const [actionApplication, setActionApplication] = useState<Application | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  /**
   * Filter applications based on status, job, and score range
   */
  const getFilteredApplications = () => {
    return applications.filter((application) => {
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
    console.log('Shortlist application:', application.id);
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
    console.log('Schedule interview for application:', application.id);
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
            onViewClick={() => {
              // Navigation handled by Link in component
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
    </AppLayout>
  );
}
