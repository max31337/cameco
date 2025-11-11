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

interface ApplicationFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  jobFilter: string;
  onJobChange: (job: string) => void;
  scoreFromFilter: string;
  onScoreFromChange: (score: string) => void;
  scoreToFilter: string;
  onScoreToChange: (score: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const applicationStatusOptions = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interviewed', label: 'Interviewed' },
  { value: 'offered', label: 'Offered' },
  { value: 'hired', label: 'Hired' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

/**
 * Application Filters Component
 * Provides filtering by status, job, and score range
 */
export function ApplicationFilters({
  statusFilter,
  onStatusChange,
  jobFilter,
  onJobChange,
  scoreFromFilter,
  onScoreFromChange,
  scoreToFilter,
  onScoreToChange,
  onApplyFilters,
  onResetFilters,
}: ApplicationFiltersProps) {
  return (
    <div className="bg-card rounded-lg border p-4 mb-6">
      <h3 className="text-sm font-semibold mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select value={statusFilter || ''} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {applicationStatusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Job Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Job Title</label>
          <Input
            placeholder="Filter by job..."
            value={jobFilter}
            onChange={(e) => onJobChange(e.target.value)}
          />
        </div>

        {/* Score Range */}
        <div>
          <label className="text-sm font-medium mb-2 block">Score From</label>
          <Input
            type="number"
            placeholder="Min score"
            min="0"
            max="100"
            value={scoreFromFilter}
            onChange={(e) => onScoreFromChange(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Score To</label>
          <Input
            type="number"
            placeholder="Max score"
            min="0"
            max="100"
            value={scoreToFilter}
            onChange={(e) => onScoreToChange(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <Button onClick={onApplyFilters} className="flex-1">
            Apply
          </Button>
          <Button variant="outline" onClick={onResetFilters} className="px-3">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
