import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PackageCheck, CheckCircle2, XCircle, Clock, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Patch {
    id: number;
    patch_name: string;
    version_from: string;
    version_to: string;
    approval_status: string;
    is_security_patch: boolean;
    requested_by: number;
    approved_by: number | null;
    requested_at: string;
    approved_at: string | null;
    deployed_at: string | null;
    request_notes: string | null;
    approval_notes: string | null;
    requester?: User;
    approver?: User;
}

interface PaginatedPatches {
    data: Patch[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Stats {
    pending: number;
    approved: number;
    deployed: number;
    security_pending: number;
}

interface Filters {
    status: string | null;
    security_only: boolean | null;
}

interface Props {
    patches: PaginatedPatches;
    stats: Stats;
    filters: Filters;
}

export default function Patches({ patches, stats, filters }: Props) {
    const [selectedPatch, setSelectedPatch] = useState<Patch | null>(null);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);

    const approveForm = useForm({
        notes: '',
    });

    const rejectForm = useForm({
        notes: '',
    });

    const handleFilterChange = (key: string, value: string | boolean) => {
        const newFilters = { ...filters, [key]: value };
        router.get('/system/patches', newFilters, { preserveState: true });
    };

    const handleApprove = (patch: Patch) => {
        setSelectedPatch(patch);
        setShowApproveDialog(true);
    };

    const handleReject = (patch: Patch) => {
        setSelectedPatch(patch);
        setShowRejectDialog(true);
    };

    const submitApprove = () => {
        if (!selectedPatch) return;
        approveForm.post(`/system/patches/${selectedPatch.id}/approve`, {
            onSuccess: () => {
                setShowApproveDialog(false);
                approveForm.reset();
            },
        });
    };

    const submitReject = () => {
        if (!selectedPatch) return;
        rejectForm.post(`/system/patches/${selectedPatch.id}/reject`, {
            onSuccess: () => {
                setShowRejectDialog(false);
                rejectForm.reset();
            },
        });
    };

    const handleMarkDeployed = (patchId: number) => {
        router.post(`/system/patches/${patchId}/deploy`);
    };

    const getStatusBadge = (patch: Patch) => {
        if (patch.deployed_at) {
            return (
                <Badge className="bg-blue-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Deployed
                </Badge>
            );
        }

        switch (patch.approval_status) {
            case 'pending':
                return (
                    <Badge className="bg-yellow-500">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                    </Badge>
                );
            case 'approved':
                return (
                    <Badge className="bg-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Approved
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge className="bg-red-500">
                        <XCircle className="h-3 w-3 mr-1" />
                        Rejected
                    </Badge>
                );
            default:
                return <Badge>{patch.approval_status}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="Patch Management" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight dark:text-foreground">Patch Management</h1>
                    <p className="text-muted-foreground">Review and approve system patches and updates</p>
                </div>

                {/* Statistics */}
                <div className="grid gap-6 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                            <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Security Patches</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.security_pending}</div>
                            <p className="text-xs text-muted-foreground mt-1">Critical updates</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                            <p className="text-xs text-muted-foreground mt-1">Ready to deploy</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Deployed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.deployed}</div>
                            <p className="text-xs text-muted-foreground mt-1">Live in production</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4 flex-wrap">
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) => handleFilterChange('status', value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant={filters.security_only ? 'default' : 'outline'}
                                onClick={() => handleFilterChange('security_only', !filters.security_only)}
                            >
                                <Shield className="h-4 w-4 mr-2" />
                                Security Patches Only
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Patch List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Patch Approvals</CardTitle>
                        <CardDescription>
                            Showing {patches.data.length} of {patches.total} patches
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {patches.data.map((patch) => (
                                <div key={patch.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <PackageCheck className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium flex items-center gap-2">
                                                        {patch.patch_name}
                                                        {patch.is_security_patch && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                <Shield className="h-3 w-3 mr-1" />
                                                                Security
                                                            </Badge>
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Version: {patch.version_from} → {patch.version_to}
                                                    </p>
                                                </div>
                                            </div>
                                            {patch.request_notes && (
                                                <p className="text-sm ml-8 mt-2">{patch.request_notes}</p>
                                            )}
                                            {patch.approval_notes && (
                                                <p className="text-sm ml-8 mt-2 text-muted-foreground">
                                                    <strong>Note:</strong> {patch.approval_notes}
                                                </p>
                                            )}
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground ml-8 mt-2">
                                                <span>Requested by: {patch.requester?.name || 'Unknown'}</span>
                                                <span>•</span>
                                                <span>{new Date(patch.requested_at).toLocaleString()}</span>
                                                {patch.approved_at && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Approved: {new Date(patch.approved_at).toLocaleString()}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(patch)}
                                        </div>
                                    </div>

                                    {patch.approval_status === 'pending' && (
                                        <div className="flex gap-2 ml-8">
                                            <Button size="sm" variant="default" onClick={() => handleApprove(patch)}>
                                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => handleReject(patch)}>
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    )}

                                    {patch.approval_status === 'approved' && !patch.deployed_at && (
                                        <div className="ml-8">
                                            <Button size="sm" variant="outline" onClick={() => handleMarkDeployed(patch.id)}>
                                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                                Mark as Deployed
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {patches.data.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <PackageCheck className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>No patches found for the selected filters</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Approve Dialog */}
            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Patch</DialogTitle>
                        <DialogDescription>
                            You are approving patch: <strong>{selectedPatch?.patch_name}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="approve-notes">Approval Notes (Optional)</Label>
                            <Input
                                id="approve-notes"
                                value={approveForm.data.notes}
                                onChange={(e) => approveForm.setData('notes', e.target.value)}
                                placeholder="Add any notes about this approval..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={submitApprove} disabled={approveForm.processing}>
                            Approve Patch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Patch</DialogTitle>
                        <DialogDescription>
                            You are rejecting patch: <strong>{selectedPatch?.patch_name}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="reject-notes">Rejection Reason (Required)</Label>
                            <Input
                                id="reject-notes"
                                value={rejectForm.data.notes}
                                onChange={(e) => rejectForm.setData('notes', e.target.value)}
                                placeholder="Explain why this patch is being rejected..."
                                required
                            />
                            {rejectForm.errors.notes && (
                                <p className="text-sm text-red-600">{rejectForm.errors.notes}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={submitReject}
                            disabled={rejectForm.processing || !rejectForm.data.notes}
                        >
                            Reject Patch
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
