import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import { formatDateTime } from '@/lib/date-utils';
import type { ApplicationStatusHistory } from '@/types/ats-pages';

interface ApplicationTimelineTabProps {
  statusHistory: ApplicationStatusHistory[];
}

/**
 * Application Timeline Tab
 * Displays status change history in chronological order
 */
export function ApplicationTimelineTab({ statusHistory }: ApplicationTimelineTabProps) {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">No status changes yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {statusHistory.map((history, index) => (
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
  );
}
