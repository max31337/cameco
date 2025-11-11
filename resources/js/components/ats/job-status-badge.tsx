import React from 'react';
import { Badge } from '@/components/ui/badge';
import { JobStatus } from '@/types/ats-pages';

interface JobStatusBadgeProps {
  status: JobStatus;
  className?: string;
}

/**
 * Job Status Badge Component
 * Displays the status of a job posting with appropriate color coding
 */
export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  const getVariant = (status: JobStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'open':
        return 'default';
      case 'closed':
        return 'secondary';
      case 'draft':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getLabel = (status: JobStatus): string => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'closed':
        return 'Closed';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  return (
    <Badge variant={getVariant(status)} className={className}>
      {getLabel(status)}
    </Badge>
  );
}
