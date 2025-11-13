import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { MoreHorizontal, Edit, Copy, Trash2, Archive, Eye, Share2, Zap } from 'lucide-react';
import { WorkSchedule } from '@/types/workforce-pages';

interface ScheduleActionsProps {
    schedule: WorkSchedule;
    onEdit: (schedule: WorkSchedule) => void;
    onDelete: (id: number) => void;
    onDuplicate: (schedule: WorkSchedule) => void;
    onArchive?: (id: number) => void;
    onView?: (id: number) => void;
    onShare?: (id: number) => void;
    showAdvanced?: boolean;
}

export default function ScheduleActions({
    schedule,
    onEdit,
    onDelete,
    onDuplicate,
    onArchive,
    onView,
    onShare,
    showAdvanced = true,
}: ScheduleActionsProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isArchiving, setIsArchiving] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            onDelete(schedule.id);
            setIsDeleteDialogOpen(false);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleArchive = async () => {
        setIsArchiving(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));
            onArchive?.(schedule.id);
            setIsArchiveDialogOpen(false);
        } finally {
            setIsArchiving(false);
        }
    };

    const isExpired = schedule.status === 'expired';
    const isDraft = schedule.status === 'draft';

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open actions menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                    {/* View Action */}
                    {onView && (
                        <>
                            <DropdownMenuItem onClick={() => onView(schedule.id)} className="gap-2">
                                <Eye className="h-4 w-4" />
                                <span>View Details</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}

                    {/* Edit Action */}
                    <DropdownMenuItem onClick={() => onEdit(schedule)} className="gap-2">
                        <Edit className="h-4 w-4" />
                        <span>Edit Schedule</span>
                    </DropdownMenuItem>

                    {/* Duplicate Action */}
                    <DropdownMenuItem onClick={() => onDuplicate(schedule)} className="gap-2">
                        <Copy className="h-4 w-4" />
                        <span>Duplicate</span>
                    </DropdownMenuItem>

                    {showAdvanced && <DropdownMenuSeparator />}

                    {/* Advanced Actions */}
                    {showAdvanced && (
                        <>
                            {/* Share Action */}
                            {onShare && (
                                <DropdownMenuItem onClick={() => onShare(schedule.id)} className="gap-2">
                                    <Share2 className="h-4 w-4" />
                                    <span>Share Schedule</span>
                                </DropdownMenuItem>
                            )}

                            {/* Archive Action */}
                            {onArchive && !isExpired && (
                                <DropdownMenuItem
                                    onClick={() => setIsArchiveDialogOpen(true)}
                                    className="gap-2"
                                >
                                    <Archive className="h-4 w-4" />
                                    <span>Archive</span>
                                </DropdownMenuItem>
                            )}

                            {/* Publish/Activate Draft */}
                            {isDraft && (
                                <DropdownMenuItem
                                    onClick={() => onEdit(schedule)}
                                    className="gap-2 text-amber-600"
                                >
                                    <Zap className="h-4 w-4" />
                                    <span>Publish as Active</span>
                                </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
                        </>
                    )}

                    {/* Delete Action */}
                    <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="gap-2 text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Schedule</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{schedule.name}</strong>? This action cannot be undone.
                            {(schedule.assigned_employees_count ?? 0) > 0 && (
                                <div className="mt-2 text-amber-600 text-sm font-medium">
                                    ⚠️ This schedule has {schedule.assigned_employees_count} assigned employee
                                    {(schedule.assigned_employees_count ?? 0) !== 1 ? 's' : ''}.
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Archive Confirmation Dialog */}
            <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Archive Schedule</DialogTitle>
                        <DialogDescription>
                            Archive <strong>{schedule.name}</strong>? Archived schedules can be restored later and won't
                            appear in the active list.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsArchiveDialogOpen(false)} disabled={isArchiving}>
                            Keep Active
                        </Button>
                        <Button onClick={handleArchive} disabled={isArchiving}>
                            {isArchiving ? 'Archiving...' : 'Archive'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
