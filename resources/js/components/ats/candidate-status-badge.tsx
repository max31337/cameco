import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CandidateStatusBadgeProps {
  status: string;
}

const statusOptions = [
  { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'in_process', label: 'In Process', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'interviewed', label: 'Interviewed', color: 'bg-purple-100 text-purple-800' },
  { value: 'offered', label: 'Offered', color: 'bg-green-100 text-green-800' },
  { value: 'hired', label: 'Hired', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
];

/**
 * Candidate Status Badge Component
 * Displays a color-coded badge for candidate status (new, interviewed, hired, etc.)
 */
export function CandidateStatusBadge({ status }: CandidateStatusBadgeProps) {
  const statusOption = statusOptions.find((opt) => opt.value === status);
  const color = statusOption?.color || 'bg-gray-100 text-gray-800';
  const label = statusOption?.label || status;

  return <Badge className={color}>{label}</Badge>;
}
