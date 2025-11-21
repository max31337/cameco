import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Edit2 } from 'lucide-react';

interface LeavePolicyDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    policy: {
        id: number;
        type: string;
        annual_entitlement: number;
        max_carry_forward?: number;
        max_consecutive_days?: number;
        requires_approval: boolean;
        description?: string;
    };
    onEdit: () => void;
}

const leaveTypeDescriptions: Record<string, string> = {
    'Vacation Leave': 'Annual leave for vacation and personal time',
    'Sick Leave': 'Leave for illness and medical appointments',
    'Emergency Leave': 'Leave for unexpected emergencies',
    'Maternity Leave': 'Leave for mothers before and after childbirth',
    'Paternity Leave': 'Leave for fathers after childbirth',
    'Privilege Leave': 'Special leave for personal matters',
    'Bereavement Leave': 'Leave for dealing with family deaths',
};

export function LeavePolicyDetailsModal({
    isOpen,
    onClose,
    policy,
    onEdit,
}: LeavePolicyDetailsModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        {policy.type}
                    </DialogTitle>
                    <DialogDescription>
                        {leaveTypeDescriptions[policy.type] || 'Leave policy details'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Annual Entitlement */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Annual Entitlement</div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-lg px-3 py-1">
                                {policy.annual_entitlement} days
                            </Badge>
                            <span className="text-sm text-muted-foreground">per year</span>
                        </div>
                    </div>

                    {/* Max Carryover */}
                    {policy.max_carry_forward !== null && policy.max_carry_forward !== undefined && (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Maximum Carryover</div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="px-3 py-1">
                                    {policy.max_carry_forward} days
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    can be carried forward to next year
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Max Consecutive Days */}
                    {policy.max_consecutive_days !== null && policy.max_consecutive_days !== undefined && (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">
                                Maximum Consecutive Days
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="px-3 py-1">
                                    {policy.max_consecutive_days} days
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    maximum at once
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Requires Approval */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-muted-foreground">Approval Required</div>
                        <Badge variant={policy.requires_approval ? 'default' : 'secondary'}>
                            {policy.requires_approval
                                ? 'Yes - Supervisor/Manager approval required'
                                : 'No - Auto-approved'}
                        </Badge>
                    </div>

                    {/* Description */}
                    {policy.description && (
                        <div className="space-y-2">
                            <div className="text-sm font-medium text-muted-foreground">Description</div>
                            <p className="text-sm">{policy.description}</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4 border-t">
                        <Button onClick={onEdit} className="flex-1">
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit Policy
                        </Button>
                        <Button variant="outline" onClick={onClose} className="flex-1">
                            Close
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
