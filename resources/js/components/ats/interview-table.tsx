import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Interview, InterviewStatus } from '@/types/ats-pages';
import { formatDate } from '@/lib/date-utils';

interface InterviewTableProps {
  interviews: Interview[];
  onReschedule: (interview: Interview) => void;
  onAddFeedback: (interview: Interview) => void;
  onCancel: (interview: Interview) => void;
}

/**
 * Interview Table Component
 * Reusable table view for displaying interviews with actions
 * Supports reschedule, feedback, and cancel operations
 */
export function InterviewTable({
  interviews,
  onReschedule,
  onAddFeedback,
  onCancel,
}: InterviewTableProps) {
  // Get status badge color
  const getStatusVariant = (status: InterviewStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'scheduled':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'no_show':
        return 'outline';
      default:
        return 'default';
    }
  };

  // Format status label
  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (interviews.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No interviews found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate Name</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Interviewer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => (
            <TableRow key={interview.id}>
              <TableCell className="font-medium">
                {interview.candidate_name}
              </TableCell>
              <TableCell>{interview.job_title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(interview.scheduled_date)} {interview.scheduled_time}
                  </span>
                </div>
              </TableCell>
              <TableCell>{interview.duration_minutes} min</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm capitalize">
                    {interview.location_type.replace('_', ' ')}
                  </span>
                </div>
              </TableCell>
              <TableCell>{interview.interviewer_name}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(interview.status)}>
                  {formatStatus(interview.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {interview.score ? (
                  <span className="font-semibold">{interview.score}/10</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => onReschedule(interview)}
                    >
                      Reschedule
                    </DropdownMenuItem>
                    {interview.status === 'scheduled' && (
                      <DropdownMenuItem
                        onClick={() => onAddFeedback(interview)}
                      >
                        Add Feedback
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => onCancel(interview)}
                      className="text-red-600"
                    >
                      Cancel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
