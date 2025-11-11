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
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle } from 'lucide-react';
import type { CandidateNoteFormData } from '@/types/ats-pages';

interface AddNoteModalProps {
  isOpen: boolean;
  candidateName?: string;
  onClose: () => void;
  onSubmit: (noteData: CandidateNoteFormData) => Promise<void>;
}

/**
 * Add Note Modal
 * Modal form for adding notes to a candidate
 */
export function AddNoteModal({
  isOpen,
  candidateName,
  onClose,
  onSubmit,
}: AddNoteModalProps) {
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
        note: noteText.trim(),
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {candidateName ? `Add Note - ${candidateName}` : 'Add Note'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-md p-3">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Note Textarea */}
          <div>
            <Label htmlFor="note" className="text-sm font-medium">
              Note *
            </Label>
            <textarea
              id="note"
              placeholder="Add your note here..."
              value={noteText}
              onChange={(e) => {
                setNoteText(e.target.value);
                setError('');
              }}
              className="w-full min-h-[120px] max-h-[200px] p-3 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">
                {characterCount}/{maxCharacters} characters
              </p>
              {characterCount > maxCharacters * 0.9 && (
                <p className="text-xs text-yellow-600">
                  Approaching character limit
                </p>
              )}
            </div>
          </div>

          {/* Is Private Checkbox */}
          <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-md border">
            <Checkbox
              id="is_private"
              checked={isPrivate}
              onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
              disabled={isSubmitting}
            />
            <div className="flex-1">
              <Label
                htmlFor="is_private"
                className="text-sm font-medium cursor-pointer"
              >
                Private Note
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Only visible to you and HR managers
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !noteText.trim()}
          >
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
