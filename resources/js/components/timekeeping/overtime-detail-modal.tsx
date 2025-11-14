import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, User, Calendar, Edit } from 'lucide-react';
import type { OvertimeRecord } from '@/types/timekeeping-pages';

interface OvertimeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (record: OvertimeRecord) => void;
    onApprove?: (record: OvertimeRecord) => void;
    record: OvertimeRecord | null;
}

const statusColors = {
    planned: { bg: 'bg-blue-50', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800' },
    in_progress: { bg: 'bg-yellow-50', text: 'text-yellow-900', badge: 'bg-yellow-100 text-yellow-800' },
    completed: { bg: 'bg-green-50', text: 'text-green-900', badge: 'bg-green-100 text-green-800' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-900', badge: 'bg-red-100 text-red-800' },
};

export function OvertimeDetailModal({
    isOpen,
    onClose,
    onEdit,
    onApprove,
    record,
}: OvertimeDetailModalProps) {
    if (!record) return null;

    const status = record.status as keyof typeof statusColors;
    const colors = statusColors[status] || statusColors.planned;

    const getStatusLabel = (s: string) => {
        const labels: Record<string, string> = {
            planned: 'Planned',
            in_progress: 'In Progress',
            completed: 'Completed',
            cancelled: 'Cancelled',
        };
        return labels[s] || s;
    };

    const hoursDifference = record.actual_hours ? record.actual_hours - record.planned_hours : 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <DialogTitle>Overtime Record Details</DialogTitle>
                        <Badge className={colors.badge}>{getStatusLabel(status)}</Badge>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="history">Status History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                        {/* Employee Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <User className="h-5 w-5" />
                                    Employee Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold">Name</p>
                                    <p className="text-lg">{record.employee_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold">Employee ID</p>
                                    <p className="text-lg font-mono">{record.employee_number}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold">Department</p>
                                    <p className="text-lg">{record.department_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold">Position</p>
                                    <p className="text-lg">{record.department_name}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Overtime Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Clock className="h-5 w-5" />
                                    Overtime Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Date and Status */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Overtime Date
                                        </p>
                                        <p className="text-lg mt-2">{record.overtime_date}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold">Status</p>
                                        <div className="mt-2">
                                            <Badge className={colors.badge}>{getStatusLabel(status)}</Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="border-t pt-4 grid grid-cols-2 gap-4">
                                    <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                                        <CardContent className="pt-4">
                                            <p className="text-xs text-gray-600 font-semibold">Planned Hours</p>
                                            <p className="text-3xl font-bold text-blue-600 mt-2">
                                                {record.planned_hours}h
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {record.actual_hours ? (
                                        <Card className={`bg-gradient-to-br ${hoursDifference > 0 ? 'from-orange-50 to-orange-100' : 'from-green-50 to-green-100'}`}>
                                            <CardContent className="pt-4">
                                                <p className="text-xs text-gray-600 font-semibold">Actual Hours</p>
                                                <p className={`text-3xl font-bold mt-2 ${hoursDifference > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                                    {record.actual_hours}h
                                                </p>
                                                <p className={`text-xs font-semibold mt-1 ${hoursDifference > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                                    {hoursDifference > 0 ? '+' : ''}{hoursDifference.toFixed(1)}h
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                                            <CardContent className="pt-4">
                                                <p className="text-xs text-gray-600 font-semibold">Actual Hours</p>
                                                <p className="text-lg text-gray-500 mt-2">Not recorded yet</p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {/* Reason */}
                                <div className="border-t pt-4">
                                    <p className="text-xs text-gray-600 font-semibold mb-2">Reason</p>
                                    <p className="text-sm text-gray-700 leading-relaxed">{record.reason}</p>
                                </div>

                                {/* Notes */}
                                {record.notes && (
                                    <div className="border-t pt-4">
                                        <p className="text-xs text-gray-600 font-semibold mb-2">Notes</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{record.notes}</p>
                                    </div>
                                )}

                                {/* Created Info */}
                                <div className="border-t pt-4 bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs text-gray-600 font-semibold mb-2">Created By</p>
                                    <p className="text-sm">{record.created_by_name || 'HR Manager'}</p>
                                    <p className="text-xs text-gray-500 mt-1">{record.created_at}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Status Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Planned */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                                            <div className="w-0.5 h-12 bg-gray-200 my-1" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">Created</p>
                                            <p className="text-xs text-gray-600">{record.created_at}</p>
                                        </div>
                                    </div>

                                    {/* Status changes */}
                                    {record.status === 'in_progress' && (
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                                                <div className="w-0.5 h-12 bg-gray-200 my-1" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">Started</p>
                                                <p className="text-xs text-gray-600">{record.updated_at || 'In progress'}</p>
                                            </div>
                                        </div>
                                    )}

                                    {record.status === 'completed' && (
                                        <>
                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-4 h-4 rounded-full bg-yellow-500" />
                                                    <div className="w-0.5 h-12 bg-gray-200 my-1" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">In Progress</p>
                                                    <p className="text-xs text-gray-600">Overtime being worked</p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-4 h-4 rounded-full bg-green-500" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">Completed</p>
                                                    <p className="text-xs text-gray-600">{record.updated_at}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {record.status === 'cancelled' && (
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-4 h-4 rounded-full bg-red-500" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">Cancelled</p>
                                                <p className="text-xs text-gray-600">{record.updated_at}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="gap-3">
                    {onEdit && record.status === 'planned' && (
                        <Button variant="outline" onClick={() => onEdit(record)} className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                        </Button>
                    )}
                    {onApprove && record.status === 'planned' && (
                        <Button onClick={() => onApprove(record)} className="gap-2">
                            Approve & Start
                        </Button>
                    )}
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
