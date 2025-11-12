import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { formatDateTime } from '@/lib/date-utils';
import type { CandidateNote } from '@/types/ats-pages';

interface ApplicationNotesTabProps {
  notes: CandidateNote[];
  onAddNoteClick?: () => void;
}

/**
 * Application Notes Tab
 * Displays all notes added to an application with option to add new notes
 */
export function ApplicationNotesTab({ notes, onAddNoteClick }: ApplicationNotesTabProps) {
  if (!notes || notes.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <p className="text-muted-foreground">No notes yet</p>
        {onAddNoteClick && (
          <Button onClick={onAddNoteClick} variant="outline" className="mt-4">
            <MessageSquare className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => (
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
      ))}
      {onAddNoteClick && (
        <Button onClick={onAddNoteClick} variant="outline" className="w-full">
          <MessageSquare className="mr-2 h-4 w-4" />
          Add Note
        </Button>
      )}
    </div>
  );
}
