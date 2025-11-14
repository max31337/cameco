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
import { Clock, MapPin, User, Edit, AlertCircle } from 'lucide-react';
import { AttendanceStatusBadge } from '@/components/timekeeping/attendance-status-badge';
import { SourceIndicator } from '@/components/timekeeping/source-indicator';
import type { AttendanceRecord, AttendanceCorrection } from '@/types/timekeeping-pages';

interface AttendanceDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (record: AttendanceRecord) => void;
    onCorrect?: (record: AttendanceRecord) => void;
    record: AttendanceRecord | null;
    corrections?: AttendanceCorrection[];
}

export function AttendanceDetailModal({
    isOpen,
    onClose,
    onEdit,
    onCorrect,
    record,
    corrections = [],
}: AttendanceDetailModalProps) {
    if (!record) return null;

    const calculateHours = (tIn: string | null | undefined, tOut: string | null | undefined, bStart?: string | null, bEnd?: string | null) => {
        if (!tIn || !tOut) return 0;
        const inDate = new Date(`2000-01-01T${tIn}`);
        const outDate = new Date(`2000-01-01T${tOut}`);
        let hours = (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60);

        if (bStart && bEnd) {
            const breakStartDate = new Date(`2000-01-01T${bStart}`);
            const breakEndDate = new Date(`2000-01-01T${bEnd}`);
            const breakHours = (breakEndDate.getTime() - breakStartDate.getTime()) / (1000 * 60 * 60);
            hours -= breakHours;
        }

        return Math.max(0, hours);
    };

    const totalHours = calculateHours(record.time_in, record.time_out, record.break_start, record.break_end);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Attendance Record Details</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="corrections">Corrections ({corrections.length})</TabsTrigger>
                        <TabsTrigger value="audit">Audit Trail</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
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
                                    <p className="text-lg mt-2">{record.employee_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold">Employee ID</p>
                                    <p className="text-lg mt-2">{record.employee_number}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold">Department</p>
                                    <p className="text-lg mt-2">{record.department_name}</p>
                                </div>
                                {record.schedule_name && (
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold">Schedule</p>
                                        <p className="text-lg mt-2">{record.schedule_name}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Record Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Clock className="h-5 w-5" />
                                    Record Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold">Date</p>
                                        <p className="text-lg mt-2">{record.date}</p>
                                    </div>
                                    <SourceIndicator source={record.source} />
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t">
                                    {record.time_in && (
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-600 font-semibold">Time In</p>
                                            <p className="text-lg font-mono mt-2 text-blue-600">{record.time_in}</p>
                                        </div>
                                    )}

                                    {record.time_out && (
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-600 font-semibold">Time Out</p>
                                            <p className="text-lg font-mono mt-2 text-green-600">{record.time_out}</p>
                                        </div>
                                    )}
                                </div>

                                {(record.break_start || record.break_end) && (
                                    <div className="flex items-center gap-4 pt-2">
                                        {record.break_start && (
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-600 font-semibold">Break Start</p>
                                                <p className="text-lg font-mono mt-2 text-yellow-600">{record.break_start}</p>
                                            </div>
                                        )}

                                        {record.break_end && (
                                            <div className="flex-1">
                                                <p className="text-xs text-gray-600 font-semibold">Break End</p>
                                                <p className="text-lg font-mono mt-2 text-yellow-600">{record.break_end}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                                <CardContent className="pt-4">
                                    <p className="text-xs text-gray-600 font-semibold">Total Hours</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-2">{totalHours.toFixed(2)}h</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                                <CardContent className="pt-4">
                                    <p className="text-xs text-gray-600 font-semibold">Break Duration</p>
                                    <p className="text-2xl font-bold text-purple-600 mt-2">{record.break_duration || 0}min</p>
                                </CardContent>
                            </Card>

                            <Card className="bg-gradient-to-br from-red-50 to-red-100">
                                <CardContent className="pt-4">
                                    <p className="text-xs text-gray-600 font-semibold">Status</p>
                                    <div className="mt-2">
                                        <AttendanceStatusBadge status={record.status} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Location & Notes */}
                        {(record.device_location || record.notes) && (
                            <Card className="bg-gray-50">
                                <CardContent className="pt-6 space-y-4">
                                    {record.device_location && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                                            <div>
                                                <p className="text-xs text-gray-600 font-semibold">Location</p>
                                                <p className="text-sm mt-1">{record.device_location}</p>
                                            </div>
                                        </div>
                                    )}

                                    {record.notes && (
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold">Notes</p>
                                            <p className="text-sm mt-1">{record.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    <TabsContent value="corrections" className="space-y-3">
                        {corrections.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No corrections have been made to this record.</p>
                        ) : (
                            corrections.map(correction => (
                                <Card key={correction.id} className="border-l-4 border-l-orange-500">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-semibold text-sm">{correction.field_corrected}</p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {correction.original_value} → {correction.corrected_value}
                                                </p>
                                            </div>
                                            <Badge variant="outline">{correction.correction_reason}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-xs text-gray-600">Reason: {correction.justification}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            By {correction.corrected_by_name} on {correction.corrected_at}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="audit" className="space-y-4">
                        <Card className="bg-gray-50">
                            <CardContent className="pt-6 space-y-3 text-sm">
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold">Created</p>
                                    <p className="mt-1">{record.created_at}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold">Last Updated</p>
                                    <p className="mt-1">{record.updated_at}</p>
                                </div>
                                {record.is_corrected && (
                                    <div className="border-t pt-3 mt-3">
                                        <p className="text-xs text-gray-600 font-semibold flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-orange-500" />
                                            Record Corrected
                                        </p>
                                        <p className="text-xs mt-2">
                                            Original: {record.original_time_in} - {record.original_time_out}
                                        </p>
                                        {record.corrected_at && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Corrected by {record.corrected_by_name} on {record.corrected_at}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="gap-2">
                    {onCorrect && (
                        <Button variant="outline" onClick={() => onCorrect(record)} className="gap-2">
                            <AlertCircle className="h-4 w-4" />
                            Correct Record
                        </Button>
                    )}
                    {onEdit && (
                        <Button onClick={() => onEdit(record)} className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
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
