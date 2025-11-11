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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { ApplicationStatus } from '@/types/ats-pages';

interface ApplicationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { status: ApplicationStatus; notes?: string }) => Promise<void>;
  currentStatus: ApplicationStatus;
  candidateName?: string;
}

const statusOptions: { value: ApplicationStatus; label: string; description: string }[] = [
  { value: 'submitted', label: 'Submitted', description: 'Application just received' },
  { value: 'shortlisted', label: 'Shortlisted', description: 'Candidate passed initial review' },
  { value: 'interviewed', label: 'Interviewed', description: 'Interview round completed' },
  { value: 'offered', label: 'Offered', description: 'Job offer extended' },
  { value: 'hired', label: 'Hired', description: 'Candidate accepted offer and hired' },
  { value: 'rejected', label: 'Rejected', description: 'Application rejected' },
  { value: 'withdrawn', label: 'Withdrawn', description: 'Candidate withdrew application' },
];

/**
 * Application Status Update Modal
 * Allows changing application status with optional notes
 */
export function ApplicationStatusModal({
  isOpen,
  onClose,
  onSubmit,
  currentStatus,
  candidateName,
}: ApplicationStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStatus) {
      setError('Please select a status');
      return;
    }

    if (selectedStatus === currentStatus) {
      setError('Please select a different status');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit({
        status: selectedStatus as ApplicationStatus,
        notes: notes.trim() || undefined,
      });
      
      // Reset form
      setSelectedStatus('');
      setNotes('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableStatuses = () => {
    // Filter out current status
    return statusOptions.filter((opt) => opt.value !== currentStatus);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Application Status</DialogTitle>
          <DialogDescription>
            {candidateName && <span>Update status for <span className="font-semibold">{candidateName}</span></span>}
            Current status: <span className="font-semibold">{currentStatus}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">New Status</label>
            <Select value={selectedStatus} onValueChange={(value) => {
              setSelectedStatus(value as ApplicationStatus);
              setError(null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status..." />
              </SelectTrigger>
              <SelectContent>
                {getAvailableStatuses().map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div>
                      <div className="font-medium">{status.label}</div>
                      <div className="text-xs text-muted-foreground">{status.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Description */}
          {selectedStatus && (
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm">
                {statusOptions.find((s) => s.value === selectedStatus)?.description}
              </p>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (optional)</label>
            <Textarea
              placeholder="Add any notes about this status change..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {notes.length}/500 characters
            </p>
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
            <Button type="submit" disabled={isLoading || !selectedStatus}>
              {isLoading ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
