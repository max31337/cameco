import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { ApplicationStatusBadge } from '@/components/ats/application-status-badge';
import { ApplicationStatusModal } from '@/components/ats/application-status-modal';
import { RejectApplicationModal } from '@/components/ats/reject-application-modal';
import { OfferGenerationModal } from '@/components/ats/offer-generation-modal';
import { InterviewScheduleModal } from '@/components/ats/interview-schedule-modal';
import { AddNoteModal } from '@/components/ats/add-note-modal-v2';
import { ApplicationDetailsTab } from '@/components/ats/application-details-tab';
import { ApplicationInterviewsTab } from '@/components/ats/application-interviews-tab';
import { ApplicationTimelineTab } from '@/components/ats/application-timeline-tab';
import { ApplicationNotesTab } from '@/components/ats/application-notes-tab';
import type { PageProps } from '@inertiajs/core';
import type { Application, Interview, ApplicationStatusHistory, CandidateNote } from '@/types/ats-pages';
import { formatDate } from '@/lib/date-utils';

interface ApplicationShowProps extends PageProps {
  application: Application;
  interviews: Interview[];
  status_history: ApplicationStatusHistory[];
  notes: CandidateNote[];
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Recruitment', href: '#' },
  { title: 'Applications', href: '/applications' },
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
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

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

  const handleScheduleInterview = async (data: { scheduled_date: string; scheduled_time: string; duration_minutes: number; location_type: string }) => {
    console.log('Schedule interview for application:', application.id, data);
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log('Interview scheduled successfully');
  };

  const handleAddNote = async (data: { note: string; is_private: boolean }) => {
    console.log('Add note for application:', application.id, data);
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log('Note added successfully');
  };

  const handleOfferSubmit = async (data: { template: string; customMessage?: string }) => {
    console.log('Generating offer for application:', application.id, data);
    // Simulate server-side generation
    await new Promise((resolve) => setTimeout(resolve, 700));
    console.log('Offer generated successfully for application:', application.id);
    setIsOfferModalOpen(false);
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
                  <Button onClick={() => setIsInterviewModalOpen(true)} variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Interview
                  </Button>
                )}
                {application.status === 'interviewed' && (
                  <Button onClick={() => setIsOfferModalOpen(true)} variant="outline">
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
            <ApplicationDetailsTab application={application} />
          </TabsContent>

          {/* Interviews Tab */}
          <TabsContent value="interviews" className="space-y-4">
            <ApplicationInterviewsTab interviews={interviews} />
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <ApplicationTimelineTab statusHistory={status_history} />
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <ApplicationNotesTab 
              notes={notes}
              onAddNoteClick={() => setIsAddNoteModalOpen(true)}
            />
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

      {/* Interview Schedule Modal */}
      <InterviewScheduleModal
        isOpen={isInterviewModalOpen}
        onClose={() => setIsInterviewModalOpen(false)}
        onSubmit={handleScheduleInterview}
        candidateName={application.candidate_name || 'Candidate'}
        applicationId={application.id}
      />

      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isAddNoteModalOpen}
        onClose={() => setIsAddNoteModalOpen(false)}
        onSubmit={handleAddNote}
        itemName={application.candidate_name || 'Candidate'}
        context="for application #"
      />

      {/* Offer Generation Modal */}
      <OfferGenerationModal
        isOpen={isOfferModalOpen}
        onClose={() => setIsOfferModalOpen(false)}
        onSubmit={handleOfferSubmit}
        candidateName={application.candidate_name}
      />
    </AppLayout>
  );
}
