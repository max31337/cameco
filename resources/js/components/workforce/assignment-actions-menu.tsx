import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShiftAssignment } from '@/types/workforce-pages';
import {
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    Clock,
    X,
} from 'lucide-react';

/**
 * Props for the AssignmentActionsMenu component
 */
interface AssignmentActionsMenuProps {
    /** The assignment to perform actions on */
    assignment: ShiftAssignment;
    
    /** Callback when edit action is triggered */
    onEdit: (assignment: ShiftAssignment) => void;
    
    /** Callback when view details action is triggered */
    onViewDetails: (assignment: ShiftAssignment) => void;
    
    /** Callback when delete action is triggered */
    onDelete: (assignmentId: number) => void;
    
    /** Callback when mark overtime action is triggered */
    onMarkOvertime: (assignmentId: number, isOvertime: boolean) => void;
    
    /** Callback when cancel action is triggered */
    onCancel: (assignmentId: number) => void;
    
    /** Optional: Whether the current user can edit assignments */
    canEdit?: boolean;
    
    /** Optional: Whether the current user can delete assignments */
    canDelete?: boolean;
    
    /** Optional: Custom styling for the trigger button */
    triggerClassName?: string;
}

/**
 * AssignmentActionsMenu Component
 * 
 * Provides a dropdown menu with actions for shift assignments including:
 * - Edit: Opens edit modal
 * - View Details: Opens detail modal
 * - Mark Overtime: Toggle overtime status
 * - Cancel: Cancel the assignment
 * - Delete: Delete the assignment
 * 
 * Features:
 * - Confirmation dialogs for destructive actions
 * - Conditional action rendering based on assignment status
 * - Disabled states for completed assignments
 * - Accessibility support
 * 
 * @param props - Component props
 * @returns The rendered actions menu
 */
export default function AssignmentActionsMenu({
    assignment,
    onEdit,
    onViewDetails,
    onDelete,
    onMarkOvertime,
    onCancel,
    canEdit = true,
    canDelete = true,
    triggerClassName = '',
}: AssignmentActionsMenuProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [isOvertimeLoading, setIsOvertimeLoading] = useState(false);

    // Determine if actions should be disabled based on assignment status
    const isCompleted = assignment.status === 'completed';
    const isCancelled = assignment.status === 'cancelled';
    const isEditable = !isCompleted && !isCancelled;

    /**
     * Handle mark overtime action
     */
    const handleMarkOvertime = async () => {
        setIsOvertimeLoading(true);
        try {
            onMarkOvertime(assignment.id, !assignment.is_overtime);
        } finally {
            setIsOvertimeLoading(false);
        }
    };

    /**
     * Handle cancel assignment action
     */
    const handleCancelConfirm = () => {
        setIsCancelDialogOpen(false);
        onCancel(assignment.id);
    };

    /**
     * Handle delete assignment action
     */
    const handleDeleteConfirm = () => {
        setIsDeleteDialogOpen(false);
        onDelete(assignment.id);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={triggerClassName}
                        disabled={!isEditable && !canDelete}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    {/* View Details */}
                    <DropdownMenuItem
                        onClick={() => onViewDetails(assignment)}
                        className="gap-2 cursor-pointer"
                    >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                    </DropdownMenuItem>

                    {/* Edit */}
                    <DropdownMenuItem
                        onClick={() => onEdit(assignment)}
                        disabled={!canEdit || !isEditable}
                        className="gap-2 cursor-pointer"
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* Mark Overtime */}
                    <DropdownMenuItem
                        onClick={handleMarkOvertime}
                        disabled={!isEditable || isOvertimeLoading}
                        className="gap-2 cursor-pointer"
                    >
                        <Clock className="h-4 w-4" />
                        <span>
                            {assignment.is_overtime ? 'Remove Overtime' : 'Mark Overtime'}
                        </span>
                    </DropdownMenuItem>

                    {/* Cancel Assignment */}
                    {assignment.status !== 'cancelled' && (
                        <DropdownMenuItem
                            onClick={() => setIsCancelDialogOpen(true)}
                            disabled={!isEditable}
                            className="gap-2 cursor-pointer text-orange-600"
                        >
                            <X className="h-4 w-4" />
                            <span>Cancel Assignment</span>
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    {/* Delete */}
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        disabled={!canDelete}
                        className="gap-2 cursor-pointer text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Cancel Confirmation Dialog */}
            <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Assignment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this assignment for{' '}
                            <strong>{assignment.employee_name}</strong> on{' '}
                            <strong>{new Date(assignment.date).toLocaleDateString()}</strong>?
                            <br />
                            <br />
                            This action will mark the assignment as cancelled but will not delete it.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsCancelDialogOpen(false)}
                        >
                            Keep Assignment
                        </Button>
                        <Button
                            onClick={handleCancelConfirm}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            Cancel Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Assignment</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this assignment for{' '}
                            <strong>{assignment.employee_name}</strong> on{' '}
                            <strong>{new Date(assignment.date).toLocaleDateString()}</strong>?
                            <br />
                            <br />
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Assignment
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
