import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CandidateSource } from '@/types/ats-pages';

interface CandidateFiltersProps {
  searchQuery: string;
  sourceFilter: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onSourceChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const sourceOptions: { value: CandidateSource; label: string }[] = [
  { value: 'referral', label: 'Referral' },
  { value: 'job_board', label: 'Job Board' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'agency', label: 'Agency' },
  { value: 'internal', label: 'Internal' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'other', label: 'Other' },
];

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'in_process', label: 'In Process' },
  { value: 'interviewed', label: 'Interviewed' },
  { value: 'offered', label: 'Offered' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
];

/**
 * Candidate Filters Component
 * Provides search, source, and status filtering for candidates
 */
export function CandidateFilters({
  searchQuery,
  sourceFilter,
  statusFilter,
  onSearchChange,
  onSourceChange,
  onStatusChange,
  onApplyFilters,
  onResetFilters,
}: CandidateFiltersProps) {
  return (
    <div className="bg-card rounded-lg border p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="text-sm font-medium mb-2 block">Search</label>
          <Input
            placeholder="Name or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onApplyFilters()}
          />
        </div>

        {/* Source Dropdown */}
        <div>
          <label className="text-sm font-medium mb-2 block">Source</label>
          <Select value={sourceFilter || ''} onValueChange={onSourceChange}>
            <SelectTrigger>
              <SelectValue placeholder="All sources" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Dropdown */}
        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select value={statusFilter || ''} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <Button onClick={onApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={onResetFilters}
            className="px-3"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
