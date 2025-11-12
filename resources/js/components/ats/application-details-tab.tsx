import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { ApplicationStatusBadge } from './application-status-badge';
import { formatDateTime } from '@/lib/date-utils';
import type { Application } from '@/types/ats-pages';

interface ApplicationDetailsTabProps {
  application: Application;
}

/**
 * Application Details Tab
 * Displays candidate information, application details, and resume
 */
export function ApplicationDetailsTab({ application }: ApplicationDetailsTabProps) {
  return (
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
  );
}
