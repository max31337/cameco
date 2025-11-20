import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ApprovalWorkflow as ApprovalWorkflowType } from '@/types/payroll-review-types';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

interface ApprovalWorkflowProps {
    workflow: ApprovalWorkflowType;
    onReject: (reason: string) => void;
}

export function ApprovalWorkflow({ workflow, onReject }: ApprovalWorkflowProps) {
    const [showRejectForm, setShowRejectForm] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [isSubmittingReject, setIsSubmittingReject] = useState(false);

    const handleRejectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rejectReason.trim()) return;

        setIsSubmittingReject(true);
        onReject(rejectReason);
        setIsSubmittingReject(false);
        setShowRejectForm(false);
        setRejectReason('');
    };

    const getStepIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 className="h-6 w-6 text-green-600" />;
            case 'pending':
            case 'skipped':
                return <Clock className="h-6 w-6 text-gray-400" />;
            case 'rejected':
                return <XCircle className="h-6 w-6 text-red-600" />;
            default:
                return <Clock className="h-6 w-6 text-gray-400" />;
        }
    };

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Approval Workflow</h3>
                <p className="text-sm text-muted-foreground">
                    Step {workflow.current_step} of {workflow.total_steps}
                </p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
                {workflow.steps.map((step, index) => (
                    <div key={step.step_number}>
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center">
                                {getStepIcon(step.status)}
                                {index < workflow.steps.length - 1 && (
                                    <div className="my-2 h-8 w-1 bg-gray-200" />
                                )}
                            </div>
                            <div className="flex-1 pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-900">{step.role}</p>
                                        <p className="text-sm text-gray-600">{step.description}</p>
                                    </div>
                                    <div
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            step.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : step.status === 'rejected'
                                                  ? 'bg-red-100 text-red-800'
                                                  : step.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800'
                                        }`}
                                    >
                                        {step.status_label}
                                    </div>
                                </div>

                                {step.approved_by && step.approved_at && (
                                    <div className="mt-2 text-xs text-gray-600">
                                        <p>
                                            <strong>Approved by:</strong> {step.approved_by}
                                        </p>
                                        <p>
                                            <strong>Date:</strong> {new Date(step.approved_at).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                {step.status === 'rejected' && step.comments && (
                                    <div className="mt-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">
                                        <p className="font-medium">Rejection Reason:</p>
                                        <p>{step.comments}</p>
                                    </div>
                                )}

                                {step.comments && step.status === 'approved' && (
                                    <div className="mt-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                                        <p className="font-medium">Comments:</p>
                                        <p>{step.comments}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action Buttons */}
            {workflow.status !== 'approved' && (
                <div className="mt-6 flex gap-2 border-t pt-6">
                    {workflow.can_reject && (
                        <Button
                            onClick={() => setShowRejectForm(!showRejectForm)}
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                        </Button>
                    )}
                </div>
            )}

            {/* Reject Form */}
            {showRejectForm && (
                <div className="mt-4 space-y-3 rounded-lg border border-red-200 bg-red-50 p-4">
                    <label className="block text-sm font-medium text-gray-900">
                        Rejection Reason <span className="text-red-600">*</span>
                    </label>
                    <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Please explain why you are rejecting this payroll..."
                        className="w-full rounded-lg border p-3 text-sm"
                        rows={4}
                    />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowRejectForm(false);
                                setRejectReason('');
                            }}
                            disabled={isSubmittingReject}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRejectSubmit}
                            disabled={!rejectReason.trim() || isSubmittingReject}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isSubmittingReject ? 'Submitting...' : 'Submit Rejection'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Rejection History */}
            {workflow.rejection_reason && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
                    <h4 className="font-medium text-red-900">Payroll Rejected</h4>
                    <p className="mt-2 text-sm text-red-800">
                        <strong>Reason:</strong> {workflow.rejection_reason}
                    </p>
                    {workflow.rejection_by && (
                        <p className="text-xs text-red-700">
                            Rejected by {workflow.rejection_by} on{' '}
                            {workflow.rejection_date && new Date(workflow.rejection_date).toLocaleString()}
                        </p>
                    )}
                </div>
            )}
        </Card>
    );
}
