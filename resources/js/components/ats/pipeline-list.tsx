import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ApplicationListActions } from './application-list-actions';
import type { Application, ApplicationStatus } from '@/types/ats-pages';

interface PipelineColumn {
  status: ApplicationStatus;
  label: string;
  count: number;
  applications: Application[];
}

interface PipelineListProps {
  pipeline: PipelineColumn[];
  onViewApplication?: (app: Application) => void;
  onChangeApplicationStatus?: (app: Application, newStatus: ApplicationStatus, notes?: string) => void;
  onDeleteApplication?: (app: Application) => void;
}

type SortField = 'candidate_name' | 'job_title' | 'status' | 'applied_at';
type SortOrder = 'asc' | 'desc';

const statusColors: Record<ApplicationStatus, { bg: string; text: string }> = {
  submitted: { bg: 'bg-blue-100', text: 'text-blue-700' },
  shortlisted: { bg: 'bg-purple-100', text: 'text-purple-700' },
  interviewed: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  offered: { bg: 'bg-green-100', text: 'text-green-700' },
  hired: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700' },
  withdrawn: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const statusLabels: Record<ApplicationStatus, string> = {
  submitted: 'Submitted',
  shortlisted: 'Shortlisted',
  interviewed: 'Interviewed',
  offered: 'Offered',
  hired: 'Hired',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

/**
 * Pipeline List View - Task 8.2
 * Displays applications in a sortable table format
 */
export function PipelineList({ 
  pipeline,
  onViewApplication,
  onChangeApplicationStatus,
  onDeleteApplication,
}: PipelineListProps) {
  const [sortField, setSortField] = useState<SortField>('applied_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const allApplications = useMemo(
    () => pipeline.flatMap((col) => col.applications),
    [pipeline]
  );

  const sortedApplications = useMemo(() => {
    const sorted = [...allApplications].sort((a, b) => {
      let aVal: string | number | undefined = a[sortField];
      let bVal: string | number | undefined = b[sortField];

      if (aVal === undefined || bVal === undefined) return 0;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [allApplications, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    setSortField(field);
    setSortOrder(sortField === field && sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
    });
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="opacity-30">⇅</span>;
    return sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 bg-muted/50">
                <TableHead className="cursor-pointer hover:bg-muted/30" onClick={() => handleSort('candidate_name')}>
                  <div className="flex items-center gap-2">
                    Candidate
                    {renderSortIcon('candidate_name')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/30" onClick={() => handleSort('job_title')}>
                  <div className="flex items-center gap-2">
                    Position
                    {renderSortIcon('job_title')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/30" onClick={() => handleSort('status')}>
                  <div className="flex items-center gap-2">
                    Status
                    {renderSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-muted/30" onClick={() => handleSort('applied_at')}>
                  <div className="flex items-center gap-2">
                    Applied
                    {renderSortIcon('applied_at')}
                  </div>
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedApplications.length > 0 ? (
                sortedApplications.map((app) => {
                  const colors = statusColors[app.status];
                  return (
                    <TableRow key={app.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{app.candidate_name || 'Unknown'}</span>
                          {app.score && (
                            <span className="text-xs text-yellow-600 font-semibold">
                              ⭐ Score: {app.score}/10
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {app.job_title || 'Position'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${colors.bg} ${colors.text} cursor-default`}>
                          {statusLabels[app.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(app.applied_at)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground truncate max-w-xs">
                        {app.candidate_email || '-'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {app.candidate_phone || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <ApplicationListActions
                          application={app}
                          onView={onViewApplication}
                          onChangeStatus={onChangeApplicationStatus}
                          onDelete={onDeleteApplication}
                          isCompact={false}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No applications found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="px-4 py-3 border-t bg-muted/30 text-sm text-muted-foreground">
          Showing {sortedApplications.length} of {allApplications.length} applications
        </div>
      </CardContent>
    </Card>
  );
}
