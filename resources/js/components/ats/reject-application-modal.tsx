import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';

interface RejectApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { reason: string }) => Promise<void>;
  candidateName?: string;
}

const rejectionReasons = [
  'Lack of required experience',
  'Does not meet technical requirements',
  'Poor communication skills',
  'Salary expectations too high',
  'Better candidate found',
  'Overqualified for position',
  'Red flags in background check',
  'Failed assessment test',
  'Poor interview performance',
  'Not a cultural fit',
];

/**
 * Reject Application Modal
 * Allows rejecting an application with mandatory rejection reason
 */
export function RejectApplicationModal({
  isOpen,
  onClose,
  onSubmit,
  candidateName,
}: RejectApplicationModalProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      setError('Please provide a rejection reason');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit({
        reason: reason.trim(),
      });

      // Reset form
      setReason('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject application');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Reject Application
          </DialogTitle>
          <DialogDescription>
            {candidateName && (
              <span>
                You are about to reject the application from{' '}
                <span className="font-semibold">{candidateName}</span>. This action cannot be undone.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Warning */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-800">
              ⚠️ This will change the application status to "Rejected" and notify the candidate.
            </p>
          </div>

          {/* Rejection Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rejection Reason *</label>
            <Textarea
              placeholder="Explain why this application is being rejected..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError(null);
              }}
              maxLength={500}
              rows={4}
              className="resize-none"
              required
            />
            <p className="text-xs text-muted-foreground">
              {reason.length}/500 characters
            </p>
          </div>

          {/* Quick Reason Suggestions */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Common reasons:</p>
            <div className="flex flex-wrap gap-2">
              {rejectionReasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setReason(r);
                    setError(null);
                  }}
                  className="rounded-full border border-gray-300 px-3 py-1 text-xs hover:bg-gray-100"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading || !reason.trim()}
            >
              {isLoading ? 'Rejecting...' : 'Reject Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
