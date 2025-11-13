import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, MessageSquare } from 'lucide-react';

interface ApplicationNoteModalProps {
  isOpen: boolean;
  entityName?: string;
  entityType?: 'application' | 'candidate';
  onClose: () => void;
  onSubmit: (noteData: { content: string; is_private?: boolean }) => Promise<void>;
}

/**
 * Application Note Modal - Reusable Component
 * Modal form for adding notes to applications or candidates
 * Used in: ApplicationQuickViewModal, CandidateShow, etc.
 */
export function ApplicationNoteModal({
  isOpen,
  entityName,
  entityType = 'application',
  onClose,
  onSubmit,
}: ApplicationNoteModalProps) {
  const [noteText, setNoteText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const validateForm = (): boolean => {
    if (!noteText.trim()) {
      setError('Note cannot be empty');
      return false;
    }

    if (noteText.trim().length > 2000) {
      setError('Note must be less than 2000 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        content: noteText.trim(),
        is_private: isPrivate,
      });
      // Reset form on successful submission
      setNoteText('');
      setIsPrivate(false);
      setError('');
      onClose();
    } catch (err) {
      console.error('Error adding note:', err);
      setError('Failed to add note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form when modal closes
      setNoteText('');
      setIsPrivate(false);
      setError('');
      onClose();
    }
  };

  const characterCount = noteText.length;
  const maxCharacters = 2000;

  const typeLabel = entityType === 'application' ? 'Application' : 'Candidate';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {entityName ? `Add Note - ${entityName}` : `Add ${typeLabel} Note`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-md p-3">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {/* Note Text Area */}
          <div className="space-y-2">
            <Label htmlFor="note-text" className="text-sm font-medium">
              Note <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="note-text"
              placeholder="Enter your note here..."
              value={noteText}
              onChange={(e) => {
                setNoteText(e.target.value);
                setError('');
              }}
              className="min-h-[120px] resize-none"
              disabled={isSubmitting}
              maxLength={maxCharacters}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {characterCount} / {maxCharacters} characters
              </span>
              {characterCount > maxCharacters * 0.9 && (
                <span className="text-xs text-yellow-600 font-medium">
                  ⚠️ Approaching limit
                </span>
              )}
            </div>
          </div>

          {/* Private Note Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is-private"
              checked={isPrivate}
              onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
              disabled={isSubmitting}
            />
            <Label htmlFor="is-private" className="text-sm font-medium cursor-pointer">
              Mark as private
            </Label>
            <span className="text-xs text-muted-foreground">(Only visible to HR team)</span>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !noteText.trim()}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                Adding...
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                Add Note
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
