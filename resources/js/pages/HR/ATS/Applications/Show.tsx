import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Calendar, MessageSquare, History } from 'lucide-react';
import { ApplicationStatusBadge } from '@/components/ats/application-status-badge';
import { ApplicationStatusModal } from '@/components/ats/application-status-modal';
import { RejectApplicationModal } from '@/components/ats/reject-application-modal';
import type { PageProps } from '@inertiajs/core';
import type { Application, Interview, ApplicationStatusHistory, CandidateNote } from '@/types/ats-pages';
import { formatDate, formatDateTime } from '@/lib/date-utils';

interface ApplicationShowProps extends PageProps {
  application: Application;
  interviews: Interview[];
  status_history: ApplicationStatusHistory[];
  notes: CandidateNote[];
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'HR', href: '/hr/dashboard' },
  { title: 'Recruitment', href: '#' },
  { title: 'Applications', href: '/hr/ats/applications' },
  { title: 'View Application', href: '#' },
];

/**
 * Application Detail/Show Page
 * Displays full application information with interviews, timeline, and notes
 */
export default function ApplicationShow({
  application,
  interviews,
  status_history,
  notes,
}: ApplicationShowProps) {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isScheduleInterviewModalOpen, setIsScheduleInterviewModalOpen] = useState(false);

  const handleUpdateStatus = async (data: { status: string; notes?: string }) => {
    console.log('Update application status:', application.id, data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Status updated successfully');
  };

  const handleRejectApplication = async (data: { reason: string }) => {
    console.log('Reject application:', application.id, data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Application rejected successfully');
  };

  const handleScheduleInterview = async () => {
    console.log('Schedule interview for application:', application.id);
    // TODO: Phase 6.5 - Implement interview scheduling
  };

  const handleGenerateOffer = async () => {
    console.log('Generate offer for application:', application.id);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Offer generated successfully');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Application - ${application.candidate_name}`} />

      <div className="space-y-6 p-6">
        {/* Back Button */}
        <Link href="/hr/ats/applications" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </Link>

        {/* Application Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-6">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{application.candidate_name}</h1>
                  <p className="text-muted-foreground mt-2">{application.job_title}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <ApplicationStatusBadge status={application.status} />
                  </div>
                  {application.score && (
                    <div>
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-lg font-semibold">{application.score}%</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Applied</p>
                    <p className="text-sm font-medium">{formatDate(application.applied_at)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button onClick={() => setIsStatusModalOpen(true)}>
                  Update Status
                </Button>
                {(application.status === 'shortlisted' || application.status === 'interviewed') && (
                  <Button onClick={() => setIsScheduleInterviewModalOpen(true)} variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Interview
                  </Button>
                )}
                {application.status === 'interviewed' && (
                  <Button onClick={console.log} variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Offer
                  </Button>
                )}
                {application.status !== 'rejected' && application.status !== 'withdrawn' && (
                  <Button
                    onClick={() => setIsRejectModalOpen(true)}
                    variant="outline"
                    className="text-red-600 hover:text-red-600"
                  >
                    Reject
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="interviews">
              Interviews {interviews.length > 0 && `(${interviews.length})`}
            </TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="notes">
              Notes {notes.length > 0 && `(${notes.length})`}
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Candidate Information */}
                <div>
                  <h3 className="font-semibold mb-4">Candidate Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{application.candidate_email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{application.candidate_phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Application Details */}
                <div>
                  <h3 className="font-semibold mb-4">Application Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Applied Date</p>
                      <p className="font-medium">{formatDateTime(application.applied_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Status</p>
                      <ApplicationStatusBadge status={application.status} />
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Cover Letter</p>
                      <p className="font-medium whitespace-pre-wrap">
                        {application.cover_letter || 'No cover letter provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resume */}
                {application.resume_path && (
                  <div>
                    <h3 className="font-semibold mb-4">Resume</h3>
                    <a
                      href={`/storage/${application.resume_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <FileText className="h-4 w-4" />
                      View Resume
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interviews Tab */}
          <TabsContent value="interviews" className="space-y-4">
            {interviews.length > 0 ? (
              interviews.map((interview) => (
                <Card key={interview.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">Interview</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDateTime(interview.scheduled_date)} at {interview.scheduled_time}
                        </p>
                      </div>
                      <Badge variant="outline">{interview.location_type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {interview.interviewer_name && (
                      <div>
                        <p className="text-sm text-muted-foreground">Interviewer</p>
                        <p className="font-medium">{interview.interviewer_name}</p>
                      </div>
                    )}
                    {interview.feedback && (
                      <div>
                        <p className="text-sm text-muted-foreground">Feedback</p>
                        <p className="font-medium whitespace-pre-wrap">{interview.feedback}</p>
                      </div>
                    )}
                    {interview.recommendation && (
                      <div>
                        <p className="text-sm text-muted-foreground">Recommendation</p>
                        <Badge variant="outline">{interview.recommendation}</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="bg-card rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">No interviews scheduled yet</p>
              </div>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            {status_history && status_history.length > 0 ? (
              <div className="space-y-4">
                {status_history.map((history, index) => (
                  <Card key={`${history.id || index}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <History className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-grow">
                          <p className="font-medium">
                            Status changed to <Badge variant="outline">{history.status}</Badge>
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatDateTime(history.created_at)}
                          </p>
                          {history.changed_by_name && (
                            <p className="text-xs text-muted-foreground">by {history.changed_by_name}</p>
                          )}
                          {history.notes && (
                            <p className="text-sm mt-2 text-foreground">{history.notes}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">No status changes yet</p>
              </div>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            {notes && notes.length > 0 ? (
              notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{note.created_by_name || 'Anonymous'}</p>
                        {note.is_private && (
                          <Badge variant="secondary" className="text-xs">
                            Private
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(note.created_at)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="bg-card rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">No notes yet</p>
                <Button
                  onClick={() => console.log('Open add note modal')}
                  variant="outline"
                  className="mt-4"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Status Update Modal */}
      <ApplicationStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSubmit={handleUpdateStatus}
        currentStatus={application.status}
        candidateName={application.candidate_name}
      />

      {/* Reject Application Modal */}
      <RejectApplicationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleRejectApplication}
        candidateName={application.candidate_name}
      />
    </AppLayout>
  );
}
