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
import { FileText } from 'lucide-react';

interface OfferGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { template: string; customMessage?: string }) => Promise<void>;
  candidateName?: string;
}

const offerTemplates = [
  { value: 'standard', label: 'Standard Offer', description: 'Basic job offer letter' },
  { value: 'senior', label: 'Senior Position', description: 'Offer for senior/management role' },
  { value: 'contract', label: 'Contract Position', description: 'Fixed-term contract offer' },
  { value: 'internship', label: 'Internship Offer', description: 'Internship program offer' },
];

/**
 * Offer Generation Modal
 * Allows generating job offer letters with template selection
 */
export function OfferGenerationModal({
  isOpen,
  onClose,
  onSubmit,
  candidateName,
}: OfferGenerationModalProps) {
  const [template, setTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!template) {
      setError('Please select an offer template');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit({
        template,
        customMessage: customMessage.trim() || undefined,
      });

      // Reset form
      setTemplate('');
      setCustomMessage('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate offer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Job Offer
          </DialogTitle>
          <DialogDescription>
            {candidateName && (
              <span>
                Generate an offer letter for <span className="font-semibold">{candidateName}</span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Offer Template Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Offer Template *</label>
            <Select value={template} onValueChange={(value) => {
              setTemplate(value);
              setError(null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select offer template..." />
              </SelectTrigger>
              <SelectContent>
                {offerTemplates.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div>
                      <div className="font-medium">{t.label}</div>
                      <div className="text-xs text-muted-foreground">{t.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Template Info */}
          {template && (
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                📄 {offerTemplates.find((t) => t.value === template)?.description}
              </p>
            </div>
          )}

          {/* Custom Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Custom Message (optional)</label>
            <Textarea
              placeholder="Add any additional message or notes to be included in the offer letter..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              maxLength={500}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {customMessage.length}/500 characters
            </p>
          </div>

          {/* Info Box */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-xs text-blue-800">
              ℹ️ The offer letter will be generated and can be reviewed before sending to the candidate.
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
            <Button type="submit" disabled={isLoading || !template}>
              {isLoading ? 'Generating...' : 'Generate Offer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
