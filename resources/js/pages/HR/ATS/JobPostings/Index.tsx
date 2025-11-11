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
import { Plus, Edit, Trash2, Globe, Lock, Clock } from 'lucide-react';
import { JobStatusBadge } from '@/components/ats/job-status-badge';
import { JobPostingFilters } from '@/components/ats/job-posting-filters';
import { JobPostingCreateEditModal } from './CreateEditModal';
import type { PageProps } from '@inertiajs/core';
import type { JobPosting, JobPostingFormData, JobPostingFilters as JobPostingFiltersType, JobPostingSummary } from '@/types/ats-pages';

interface Department {
  id: number;
  name: string;
}

interface JobPostingsIndexProps extends PageProps {
  job_postings: JobPosting[];
  statistics: JobPostingSummary;
  filters: JobPostingFiltersType;
  departments: Department[];
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'HR', href: '/hr/dashboard' },
  { title: 'Recruitment', href: '#' },
  { title: 'Job Postings', href: '/hr/ats/job-postings' },
];

/**
 * Job Postings Index Page
 * Displays all job postings with filters, search, and CRUD operations
 */
export default function JobPostingsIndex({
  job_postings,
  statistics,
  departments,
  filters: initialFilters,
}: JobPostingsIndexProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | undefined>(undefined);
  const [appliedFilters, setAppliedFilters] = useState<JobPostingFiltersType>(
    initialFilters || {}
  );
  const [actionJob, setActionJob] = useState<JobPosting | undefined>(undefined);
  const [actionType, setActionType] = useState<'publish' | 'close' | 'delete' | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleCreateClick = () => {
    setEditingJob(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (job: JobPosting) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setEditingJob(undefined);
    setIsModalOpen(false);
  };

  const handleFormSubmit = (data: JobPostingFormData) => {
    // In a real implementation, this would send the data to the server
    console.log('Form submitted:', data, 'Editing:', editingJob?.id);
    handleModalClose();
  };

  const handleFilterChange = (newFilters: JobPostingFiltersType) => {
    setAppliedFilters(newFilters);
    // In a real implementation, this would trigger a server request
  };

  const handlePublishClick = (job: JobPosting) => {
    setActionJob(job);
    setActionType('publish');
  };

  const handleCloseClick = (job: JobPosting) => {
    setActionJob(job);
    setActionType('close');
  };

  const handleDeleteClick = (job: JobPosting) => {
    setActionJob(job);
    setActionType('delete');
  };

  const handleConfirmAction = async () => {
    if (!actionJob || !actionType) return;

    setIsActionLoading(true);
    try {
      // In a real implementation, this would send a request to the server
      console.log(`${actionType} job:`, actionJob.id);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Show success feedback
      console.log(`Job ${actionJob.title} ${actionType}d successfully`);
    } finally {
      setIsActionLoading(false);
      setActionJob(undefined);
      setActionType(null);
    }
  };

  const handleCancelAction = () => {
    setActionJob(undefined);
    setActionType(null);
  };

  const getActionDialogContent = () => {
    if (!actionJob || !actionType) return null;

    const titles = {
      publish: 'Publish Job Posting',
      close: 'Close Job Posting',
      delete: 'Delete Job Posting',
    };

    const descriptions = {
      publish:
        'Publishing this job posting will make it visible to all candidates. They will be able to apply for this position.',
      close:
        'Closing this job posting will prevent new applications. Existing applications will remain in the system.',
      delete:
        'Deleting this job posting is permanent and cannot be undone. All related applications will be archived.',
    };

    const confirmButtonLabels = {
      publish: 'Publish',
      close: 'Close',
      delete: 'Delete',
    };

    const confirmButtonVariants = {
      publish: 'default' as const,
      close: 'secondary' as const,
      delete: 'destructive' as const,
    };

    return {
      title: titles[actionType],
      description: descriptions[actionType],
      confirmLabel: confirmButtonLabels[actionType],
      confirmVariant: confirmButtonVariants[actionType],
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <Globe className="h-4 w-4" />;
      case 'closed':
        return <Lock className="h-4 w-4" />;
      case 'draft':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Job Postings" />

      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Job Postings</h1>
            <p className="text-muted-foreground mt-2">
              Manage your job postings and track applications
            </p>
          </div>
          <Button onClick={handleCreateClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Job Posting
          </Button>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.total_jobs}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Open</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {statistics.open_jobs}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Closed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">
                  {statistics.closed_jobs}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Draft</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {statistics.draft_jobs}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="bg-card rounded-lg border p-4">
          <JobPostingFilters
            filters={appliedFilters}
            departments={departments}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Job Postings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {job_postings.length > 0 ? (
            job_postings.map((job: JobPosting) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {job.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {job.department_name || `Dept #${job.department_id}`}
                      </p>
                    </div>
                    <JobStatusBadge status={job.status} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description Preview */}
                  <p className="text-sm line-clamp-3 text-muted-foreground">
                    {job.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                    {job.applications_count !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {job.applications_count}
                        </span>
                        <span>Applications</span>
                      </div>
                    )}
                    {job.posted_at && (
                      <div className="flex items-center gap-1">
                        {getStatusIcon(job.status)}
                        <span>{new Date(job.posted_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2"
                      onClick={() => handleEditClick(job)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleDeleteClick(job)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Status Actions */}
                  {job.status !== 'open' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => handlePublishClick(job)}
                    >
                      Publish
                    </Button>
                  )}
                  {job.status === 'open' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => handleCloseClick(job)}
                    >
                      Close Job
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="pt-8 pb-8">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground">No job postings found</p>
                  <Button variant="outline" onClick={handleCreateClick}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first job posting
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Dialog for Actions */}
      {actionJob && actionType && (
        <Dialog open={!!actionType} onOpenChange={handleCancelAction}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{getActionDialogContent()?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="font-medium text-foreground">{actionJob.title}</p>
              <p className="text-muted-foreground">{getActionDialogContent()?.description}</p>
              {actionType === 'delete' && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-md p-3 mt-4">
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ This action cannot be undone
                  </p>
                </div>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelAction}
                disabled={isActionLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={getActionDialogContent()?.confirmVariant}
                onClick={handleConfirmAction}
                disabled={isActionLoading}
              >
                {isActionLoading ? 'Processing...' : getActionDialogContent()?.confirmLabel}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create/Edit Modal */}
      <JobPostingCreateEditModal
        isOpen={isModalOpen}
        isEditing={!!editingJob}
        jobPosting={editingJob}
        departments={departments}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
      />
    </AppLayout>
  );
}
