import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import type { ApplicationStatus } from '@/types/ats-pages';

interface AddApplicationModalProps {
  isOpen: boolean;
  initialStatus?: ApplicationStatus;
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
}

export interface ApplicationFormData {
  candidate_name: string;
  candidate_email: string;
  candidate_phone: string;
  job_title: string;
  status: ApplicationStatus;
  notes?: string;
}

const applicationStatuses: { value: ApplicationStatus; label: string; icon: string }[] = [
  { value: 'submitted', label: 'Submitted', icon: '📝' },
  { value: 'shortlisted', label: 'Shortlisted', icon: '⭐' },
  { value: 'interviewed', label: 'Interviewed', icon: '👤' },
  { value: 'offered', label: 'Offered', icon: '💼' },
  { value: 'hired', label: 'Hired', icon: '✅' },
  { value: 'rejected', label: 'Rejected', icon: '❌' },
  { value: 'withdrawn', label: 'Withdrawn', icon: '🚫' },
];

/**
 * Add Application Modal - Kanban View
 * Modal form for adding a new application directly from the kanban board
 */
export function AddApplicationModal({
  isOpen,
  initialStatus = 'submitted',
  onClose,
  onSubmit,
}: AddApplicationModalProps) {
  const [formData, setFormData] = useState<ApplicationFormData>({
    candidate_name: '',
    candidate_email: '',
    candidate_phone: '',
    job_title: '',
    status: initialStatus,
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.candidate_name.trim()) {
      newErrors.candidate_name = 'Candidate name is required';
    }
    if (!formData.candidate_email.trim()) {
      newErrors.candidate_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.candidate_email)) {
      newErrors.candidate_email = 'Invalid email format';
    }
    if (!formData.candidate_phone.trim()) {
      newErrors.candidate_phone = 'Phone number is required';
    }
    if (!formData.job_title.trim()) {
      newErrors.job_title = 'Job title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleStatusChange = (value: ApplicationStatus) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        job_title: '',
        status: initialStatus,
        notes: '',
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to add application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset form when closing
      setFormData({
        candidate_name: '',
        candidate_email: '',
        candidate_phone: '',
        job_title: '',
        status: initialStatus,
        notes: '',
      });
      setErrors({});
    }
  };

  const statusLabel = applicationStatuses.find((s) => s.value === formData.status)?.label || 'Unknown';
  const statusIcon = applicationStatuses.find((s) => s.value === formData.status)?.icon || '';

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
          <DialogDescription>
            Create a new application and add it to the {statusIcon} {statusLabel} status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Candidate Name */}
          <div className="space-y-2">
            <Label htmlFor="candidate_name">Candidate Name *</Label>
            <Input
              id="candidate_name"
              name="candidate_name"
              placeholder="John Doe"
              value={formData.candidate_name}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={errors.candidate_name ? 'border-red-500' : ''}
            />
            {errors.candidate_name && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                {errors.candidate_name}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="candidate_email">Email *</Label>
            <Input
              id="candidate_email"
              name="candidate_email"
              type="email"
              placeholder="john@example.com"
              value={formData.candidate_email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={errors.candidate_email ? 'border-red-500' : ''}
            />
            {errors.candidate_email && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                {errors.candidate_email}
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="candidate_phone">Phone *</Label>
            <Input
              id="candidate_phone"
              name="candidate_phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.candidate_phone}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={errors.candidate_phone ? 'border-red-500' : ''}
            />
            {errors.candidate_phone && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                {errors.candidate_phone}
              </div>
            )}
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="job_title">Job Title *</Label>
            <Input
              id="job_title"
              name="job_title"
              placeholder="Senior Developer"
              value={formData.job_title}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className={errors.job_title ? 'border-red-500' : ''}
            />
            {errors.job_title && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                {errors.job_title}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Application Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange} disabled={isSubmitting}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {applicationStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <span className="flex items-center gap-2">
                      <span>{status.icon}</span>
                      {status.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any additional notes about this application..."
              value={formData.notes}
              onChange={handleInputChange}
              disabled={isSubmitting}
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" disabled={isSubmitting} onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Adding...' : 'Add Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
