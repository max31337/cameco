import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageSquare } from 'lucide-react';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { note: string; is_private: boolean }) => Promise<void>;
  itemName: string; // Can be "candidate name" or "application name"
  context?: string; // Optional context like "for application" or "for candidate"
}

/**
 * Add Note Modal
 * Reusable modal for adding notes to applications or candidates
 */
export function AddNoteModal({
  isOpen,
  onClose,
  onSubmit,
  itemName,
  context = 'for',
}: AddNoteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!note.trim()) {
      setError('Note cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        note: note.trim(),
        is_private: isPrivate,
      });
      setNote('');
      setIsPrivate(false);
      setError('');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNote('');
    setIsPrivate(false);
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Add Note
          </DialogTitle>
          <DialogDescription>
            Add a note {context} {itemName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Note Text */}
          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Enter your note here..."
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (error) setError('');
              }}
              className="min-h-[120px] resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {note.length} / 1000 characters
              </p>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
          </div>

          {/* Private Note Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="is-private"
              checked={isPrivate}
              onCheckedChange={(checked) => setIsPrivate(checked as boolean)}
            />
            <Label htmlFor="is-private" className="text-sm font-normal cursor-pointer">
              Mark as private (only visible to HR managers)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !note.trim()}>
            {isLoading ? 'Adding...' : 'Add Note'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
