import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { CandidateSource } from '@/types/ats-pages';

interface CandidateSourceBadgeProps {
  source: CandidateSource;
}

const sourceOptions: { value: CandidateSource; label: string; color: string }[] = [
  { value: 'referral', label: 'Referral', color: 'bg-blue-100 text-blue-800' },
  { value: 'job_board', label: 'Job Board', color: 'bg-purple-100 text-purple-800' },
  { value: 'walk_in', label: 'Walk-in', color: 'bg-green-100 text-green-800' },
  { value: 'agency', label: 'Agency', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'internal', label: 'Internal', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'facebook', label: 'Facebook', color: 'bg-pink-100 text-pink-800' },
  { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' },
];

/**
 * Candidate Source Badge Component
 * Displays a color-coded badge for candidate source (referral, job board, etc.)
 */
export function CandidateSourceBadge({ source }: CandidateSourceBadgeProps) {
  const sourceOption = sourceOptions.find((opt) => opt.value === source);
  const color = sourceOption?.color || 'bg-gray-100 text-gray-800';
  const label = sourceOption?.label || source;

  return <Badge className={color}>{label}</Badge>;
}
