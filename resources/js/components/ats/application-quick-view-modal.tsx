import { useState } from 'react';
import { router } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, Phone, Mail, Calendar, Star, MessageSquare } from 'lucide-react';
import { ApplicationNoteModal } from './application-note-modal';
import type { Application } from '@/types/ats-pages';

interface ApplicationQuickViewModalProps {
  open: boolean;
  application: Application | null;
  onClose: () => void;
  onMoveStatus?: (app: Application) => void;
  onAddNote?: (app: Application) => void;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  submitted: { bg: 'bg-blue-100', text: 'text-blue-700' },
  shortlisted: { bg: 'bg-purple-100', text: 'text-purple-700' },
  interviewed: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  offered: { bg: 'bg-green-100', text: 'text-green-700' },
  hired: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700' },
  withdrawn: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const sourceIcons: Record<string, string> = {
  referral: '👤',
  job_board: '💼',
  walk_in: '🚶',
  agency: '🏢',
  internal: '🔗',
  facebook: '👍',
  other: '❓',
};

const getNextLogicalStatus = (currentStatus: string): string => {
  const flow: Record<string, string> = {
    submitted: 'shortlisted',
    shortlisted: 'interviewed',
    interviewed: 'offered',
    offered: 'hired',
    hired: 'hired',
    rejected: 'withdrawn',
    withdrawn: 'withdrawn',
  };
  return flow[currentStatus] || currentStatus;
};

/**
 * Application Quick View Modal - Task 8.5
 * Displays quick overview of an application with key details
 * Includes sections for info, application summary, interview data, and recent notes
 */
export const ApplicationQuickViewModal = ({
  open,
  application,
  onClose,
  onMoveStatus,
  onAddNote,
}: ApplicationQuickViewModalProps) => {
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);

  if (!application) return null;

  const statusColor = statusColors[application.status] || statusColors.submitted;
  const sourceIcon = sourceIcons[application.candidate?.source || 'other'] || '❓';
  const nextStatus = getNextLogicalStatus(application.status);

  const handleReject = () => {
    if (showRejectConfirm) {
      // Trigger reject action
      router.put(
        `/hr/ats/pipeline/applications/${application.id}/move`,
        { status: 'rejected', notes: 'Rejected from quick view' },
        { onSuccess: () => onClose() }
      );
    } else {
      setShowRejectConfirm(true);
    }
  };

  const handleViewFullDetails = () => {
    window.location.href = `/hr/ats/applications/${application.id}`;
  };

  const handleScheduleInterview = () => {
    // This would typically open an interview scheduling modal
    console.log('Schedule interview for:', application.id);
  };

  const handleMoveToNextStage = () => {
    if (onMoveStatus) {
      onMoveStatus(application);
    }
  };

  const handleAddNote = () => {
    setNoteModalOpen(true);
  };

  const handleSubmitNote = async (noteData: { content: string; is_private?: boolean }) => {
    if (!application) return;

    try {
      await router.post(
        `/hr/ats/applications/${application.id}/notes`,
        {
          note: noteData.content,
          is_private: noteData.is_private || false,
        }
      );
      setNoteModalOpen(false);
      // Trigger callback if provided for parent component refresh
      if (onAddNote) {
        onAddNote(application);
      }
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader>
          <div className="flex items-start justify-between gap-4 w-full">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">
                {application.candidate_name || 'Unknown Candidate'}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={`${statusColor.bg} ${statusColor.text}`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Applied {formatDate(application.applied_at)}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator className="my-4" />

        {/* Quick Info Section */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-3">Quick Info</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Job Title */}
              <div>
                <label className="text-xs text-muted-foreground font-medium">Job Title</label>
                <p className="text-sm font-medium mt-1">{application.job_title || 'N/A'}</p>
              </div>

              {/* Source */}
              <div>
                <label className="text-xs text-muted-foreground font-medium">Source</label>
                <p className="text-sm font-medium mt-1">
                  {sourceIcon} {application.candidate?.source?.replace('_', ' ').toUpperCase() || 'N/A'}
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email
                </label>
                <p className="text-sm font-medium mt-1 break-all">{application.candidate_email || 'N/A'}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Phone
                </label>
                <p className="text-sm font-medium mt-1">{application.candidate_phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Application Summary Section */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Application Summary</h3>
            <div className="space-y-3">
              {/* Cover Letter Preview */}
              {application.cover_letter && (
                <div>
                  <label className="text-xs text-muted-foreground font-medium">Cover Letter</label>
                  <p className="text-sm mt-1 text-foreground line-clamp-3">
                    {application.cover_letter.substring(0, 200)}
                    {application.cover_letter.length > 200 ? '...' : ''}
                  </p>
                </div>
              )}

              {/* Resume */}
              {application.resume_path && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={application.resume_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View Resume
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Score if available */}
              {application.score && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium">Score: {application.score}/10</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Interview Info Section (if interviewed) */}
          {application.status === 'interviewed' && (
            <>
              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Interview Info
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {application.interview_date && (
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Interview Date</label>
                      <p className="text-sm font-medium mt-1">{formatDate(application.interview_date)}</p>
                    </div>
                  )}

                  {application.interviewer_name && (
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Interviewer</label>
                      <p className="text-sm font-medium mt-1">{application.interviewer_name}</p>
                    </div>
                  )}

                  {application.score && (
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Interview Score</label>
                      <p className="text-sm font-medium mt-1">{application.score}/10</p>
                    </div>
                  )}

                  {application.interviews && application.interviews.length > 0 && (
                    <div>
                      <label className="text-xs text-muted-foreground font-medium">Recommendation</label>
                      <p className="text-sm font-medium mt-1 capitalize">
                        {application.interviews[0].recommendation || 'Pending'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Recent Notes Section - using status_history as notes placeholder */}
          {application.status_history && application.status_history.length > 0 && (
            <>
              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Status History
                </h3>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {application.status_history?.slice(0, 3).map((history) => (
                    <div key={history.id} className="p-2 bg-muted/50 rounded text-xs">
                      <p className="text-muted-foreground font-medium mb-1">
                        {history.changed_by_name || 'Update'} • {formatDate(history.created_at)}
                      </p>
                      <p className="text-foreground">
                        Status changed to <span className="font-semibold">{history.status}</span>
                        {history.notes && ` - ${history.notes}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewFullDetails}
              className="flex-1 gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              View Full Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleScheduleInterview}
              className="flex-1"
            >
              📅 Schedule Interview
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMoveToNextStage}
              className="flex-1"
            >
              → Move to {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddNote}
              className="flex-1 gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Add Note
            </Button>
          </div>

          {showRejectConfirm ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRejectConfirm(false)}
                className="flex-1"
              >
                Cancel Reject
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReject}
                className="flex-1"
              >
                ⚠️ Confirm Reject
              </Button>
            </div>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleReject}
              className="w-full"
            >
              ❌ Reject Application
            </Button>
          )}
        </div>
        </DialogContent>
      </Dialog>

      <ApplicationNoteModal
        isOpen={noteModalOpen}
        entityName={application?.candidate_name || 'Application'}
        entityType="application"
        onClose={() => setNoteModalOpen(false)}
        onSubmit={handleSubmitNote}
      />
    </>
  );
};
