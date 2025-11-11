import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import type { JobPostingFilters } from '@/types/ats-pages';

interface JobPostingFiltersProps {
  filters: JobPostingFilters;
  departments: Array<{ id: number; name: string }>;
  onFilterChange: (filters: JobPostingFilters) => void;
}

/**
 * Job Posting Filters Component
 * Allows filtering job postings by search term, status, and department
 */
export function JobPostingFilters({
  filters,
  departments,
  onFilterChange,
}: JobPostingFiltersProps) {
  const [localFilters, setLocalFilters] = useState<JobPostingFilters>(filters);

  const handleSearchChange = (value: string) => {
    const newFilters = { ...localFilters, search: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleStatusChange = (value: string) => {
    const newFilters = {
      ...localFilters,
      status: (value === 'all' ? undefined : value) as '' | undefined,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDepartmentChange = (value: string) => {
    const newFilters = {
      ...localFilters,
      department_id: value === 'all' ? undefined : parseInt(value),
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const newFilters: JobPostingFilters = {
      search: undefined,
      status: undefined,
      department_id: undefined,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters =
    localFilters.search ||
    localFilters.status ||
    localFilters.department_id;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap items-end">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <label className="text-sm font-medium mb-2 block">Search Jobs</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by job title..."
              className="pl-10"
              value={localFilters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-48">
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select
            value={localFilters.status || 'all'}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Department Filter */}
        <div className="w-48">
          <label className="text-sm font-medium mb-2 block">Department</label>
          <Select
            value={
              localFilters.department_id
                ? localFilters.department_id.toString()
                : 'all'
            }
            onValueChange={handleDepartmentChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
