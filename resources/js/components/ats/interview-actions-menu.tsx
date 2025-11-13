import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { Interview } from '@/types/ats-pages';

interface InterviewActionsMenuProps {
  interview: Interview;
  onReschedule: (interview: Interview) => void;
  onAddFeedback: (interview: Interview) => void;
  onCancel: (interview: Interview) => void;
  variant?: 'default' | 'ghost';
  size?: 'default' | 'sm';
}

/**
 * Interview Actions Menu Component
 * Displays context-appropriate actions based on interview status
 * - Scheduled: Reschedule, Add Feedback (if feedback not given), Cancel
 * - Completed: View Details, View Feedback
 * - Cancelled: Reschedule (reopen), View Details
 * - No Show: Reschedule, View Details
 */
export function InterviewActionsMenu({
  interview,
  onReschedule,
  onAddFeedback,
  onCancel,
  variant = 'ghost',
  size = 'sm',
}: InterviewActionsMenuProps) {
  const isScheduled = interview.status === 'scheduled';
  const isCompleted = interview.status === 'completed';
  const isCancelled = interview.status === 'cancelled';
  const isNoShow = interview.status === 'no_show';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className="h-5 w-5 p-0 md:h-8 md:w-8"
        >
          <MoreVertical className="h-3 w-3 md:h-4 md:w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent 
          align="end" 
          side="bottom"
          sideOffset={4}
          className="w-40"
        >
        {isScheduled && (
          <>
            <DropdownMenuItem onClick={() => onReschedule(interview)}>
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddFeedback(interview)}>
              Add Feedback
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onCancel(interview)}
              className="text-red-600"
            >
              Cancel
            </DropdownMenuItem>
          </>
        )}

        {/* COMPLETED STATUS - View feedback or reschedule */}
        {isCompleted && (
          <>
            <DropdownMenuItem disabled className="text-green-600">
              ✓ Completed
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onReschedule(interview)}>
              Reschedule
            </DropdownMenuItem>
          </>
        )}

        {/* CANCELLED STATUS - Can reschedule */}
        {isCancelled && (
          <>
            <DropdownMenuItem disabled className="text-red-600">
              ✗ Cancelled
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onReschedule(interview)}>
              Reschedule
            </DropdownMenuItem>
          </>
        )}

        {/* NO SHOW STATUS - Can reschedule */}
        {isNoShow && (
          <>
            <DropdownMenuItem disabled className="text-amber-600">
              ⚠ No Show
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onReschedule(interview)}>
              Reschedule
            </DropdownMenuItem>
          </>
        )}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
