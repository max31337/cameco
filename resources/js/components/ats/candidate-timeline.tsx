import { CandidateNote } from '@/types/ats-pages';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Clock } from 'lucide-react';

/**
 * Format date to relative time string (e.g., "2 hours ago")
 */
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';

  return Math.floor(seconds) + ' seconds ago';
}

/**
 * Format date to readable string (e.g., "Nov 12, 2025 2:30 PM")
 */
function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

interface CandidateTimelineProps {
  notes: CandidateNote[];
}

/**
 * Candidate Timeline Component
 * Displays notes in chronological order (newest first) with timestamps, author, and privacy indicator
 * 
 * @param notes - Array of candidate notes to display
 */
export function CandidateTimeline({ notes }: CandidateTimelineProps) {
  // Sort notes by created_at in descending order (newest first)
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (sortedNotes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground">
            No notes yet. Add a note to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sortedNotes.map((note, index) => (
        <Card key={note.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">
                    {note.created_by_name || 'Unknown User'}
                  </h4>
                  {note.is_private && (
                    <Badge variant="secondary" className="gap-1">
                      <Lock className="h-3 w-3" />
                      <span>Private</span>
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <time dateTime={note.created_at}>
                    {getRelativeTime(note.created_at)}
                  </time>
                  <span className="text-xs">
                    ({formatDateTime(note.created_at)})
                  </span>
                </div>
              </div>

              {/* Timeline dot */}
              <div className="flex flex-col items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                {index < sortedNotes.length - 1 && (
                  <div className="h-8 w-0.5 bg-border" />
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Note text */}
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {note.note}
            </p>

            {/* Note metadata */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
              <span>ID: {note.id}</span>
              {note.updated_at && note.updated_at !== note.created_at && (
                <span>
                  • Last updated: {formatDateTime(note.updated_at)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
