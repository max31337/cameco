import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/date-utils';
import type { Interview } from '@/types/ats-pages';

interface ApplicationInterviewsTabProps {
  interviews: Interview[];
}

/**
 * Application Interviews Tab
 * Displays all interviews scheduled for an application
 */
export function ApplicationInterviewsTab({ interviews }: ApplicationInterviewsTabProps) {
  if (interviews.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">No interviews scheduled yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {interviews.map((interview) => (
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
      ))}
    </div>
  );
}
