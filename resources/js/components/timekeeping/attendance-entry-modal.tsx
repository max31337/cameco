import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { AlertTriangle, Loader } from 'lucide-react';
import type { AttendanceRecord, EmployeeBasic } from '@/types/timekeeping-pages';

export interface AttendanceFormData {
    employee_id: string;
    date: string;
    time_in: string;
    time_out: string;
    break_start?: string;
    break_end?: string;
    source: 'edge_machine' | 'manual';
    device_id?: string;
    manual_entry_reason?: string;
    location?: string;
    notes?: string;
}

interface AttendanceEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: AttendanceFormData) => void;
    employees: EmployeeBasic[];
    record?: AttendanceRecord | null;
    isLoading?: boolean;
}

const manualReasons = [
    { value: 'lost_card', label: 'Lost Card' },
    { value: 'machine_failure', label: 'Machine Failure' },
    { value: 'forgot_to_tap', label: 'Forgot to Tap' },
    { value: 'other', label: 'Other' },
];

export function AttendanceEntryModal({
    isOpen,
    onClose,
    onSave,
    employees,
    record = null,
    isLoading = false,
}: AttendanceEntryModalProps) {
    const [employeeId, setEmployeeId] = useState(record?.employee_id?.toString() || '');
    const [date, setDate] = useState(record?.date || new Date().toISOString().split('T')[0]);
    const [timeIn, setTimeIn] = useState(record?.time_in || '');
    const [timeOut, setTimeOut] = useState(record?.time_out || '');
    const [breakStart, setBreakStart] = useState(record?.break_start || '');
    const [breakEnd, setBreakEnd] = useState(record?.break_end || '');
    const [source, setSource] = useState<'edge_machine' | 'manual'>(record?.source === 'manual' ? 'manual' : 'edge_machine');
    const [deviceId, setDeviceId] = useState(record?.device_id || '');
    const [manualReason, setManualReason] = useState(record?.manual_entry_reason || '');
    const [location, setLocation] = useState(record?.device_location || '');
    const [notes, setNotes] = useState(record?.notes || '');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const calculateHours = (tIn: string, tOut: string, bStart?: string, bEnd?: string) => {
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

    const totalHours = useMemo(() => calculateHours(timeIn, timeOut, breakStart, breakEnd), [timeIn, timeOut, breakStart, breakEnd]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!employeeId) newErrors.employeeId = 'Employee is required';
        if (!date) newErrors.date = 'Date is required';
        if (!timeIn) newErrors.timeIn = 'Time in is required';
        if (!timeOut) newErrors.timeOut = 'Time out is required';
        if (timeOut <= timeIn) newErrors.timeOut = 'Time out must be after time in';
        if (breakStart && !breakEnd) newErrors.breakEnd = 'Break end is required if break start is set';
        if (!breakStart && breakEnd) newErrors.breakStart = 'Break start is required if break end is set';
        if (source === 'manual' && !manualReason) newErrors.manualReason = 'Reason is required for manual entry';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

        onSave({
            employee_id: employeeId,
            date,
            time_in: timeIn,
            time_out: timeOut,
            break_start: breakStart,
            break_end: breakEnd,
            source,
            device_id: source === 'edge_machine' ? deviceId : undefined,
            manual_entry_reason: source === 'manual' ? manualReason : undefined,
            location,
            notes,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {record ? 'Edit Attendance Record' : 'Add Manual Attendance Entry'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {source === 'manual' && (
                        <Alert className="border-yellow-200 bg-yellow-50">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <div className="ml-3 text-sm text-yellow-800">
                                Manual entries are for exceptions only. Ensure proper justification.
                            </div>
                        </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        {/* Employee Selection */}
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="employee">Employee</Label>
                            <Select value={employeeId} onValueChange={setEmployeeId}>
                                <SelectTrigger id="employee">
                                    <SelectValue placeholder="Select employee..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map(emp => (
                                        <SelectItem key={emp.id} value={emp.id.toString()}>
                                            {emp.name} ({emp.employee_number})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId}</p>}
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                        </div>

                        {/* Source */}
                        <div className="space-y-2">
                            <Label htmlFor="source">Source</Label>
                            <Select value={source} onValueChange={(v) => setSource(v as 'edge_machine' | 'manual')}>
                                <SelectTrigger id="source">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="edge_machine">Edge Machine</SelectItem>
                                    <SelectItem value="manual">Manual Entry</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Time In */}
                        <div className="space-y-2">
                            <Label htmlFor="timeIn">Time In</Label>
                            <Input
                                id="timeIn"
                                type="time"
                                value={timeIn}
                                onChange={(e) => setTimeIn(e.target.value)}
                            />
                            {errors.timeIn && <p className="text-sm text-red-500">{errors.timeIn}</p>}
                        </div>

                        {/* Time Out */}
                        <div className="space-y-2">
                            <Label htmlFor="timeOut">Time Out</Label>
                            <Input
                                id="timeOut"
                                type="time"
                                value={timeOut}
                                onChange={(e) => setTimeOut(e.target.value)}
                            />
                            {errors.timeOut && <p className="text-sm text-red-500">{errors.timeOut}</p>}
                        </div>

                        {/* Break Start */}
                        <div className="space-y-2">
                            <Label htmlFor="breakStart">Break Start (Optional)</Label>
                            <Input
                                id="breakStart"
                                type="time"
                                value={breakStart}
                                onChange={(e) => setBreakStart(e.target.value)}
                            />
                            {errors.breakStart && <p className="text-sm text-red-500">{errors.breakStart}</p>}
                        </div>

                        {/* Break End */}
                        <div className="space-y-2">
                            <Label htmlFor="breakEnd">Break End (Optional)</Label>
                            <Input
                                id="breakEnd"
                                type="time"
                                value={breakEnd}
                                onChange={(e) => setBreakEnd(e.target.value)}
                            />
                            {errors.breakEnd && <p className="text-sm text-red-500">{errors.breakEnd}</p>}
                        </div>

                        {/* Device ID (for edge machine) */}
                        {source === 'edge_machine' && (
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="deviceId">Device ID</Label>
                                <Input
                                    id="deviceId"
                                    placeholder="RFID device ID..."
                                    value={deviceId}
                                    onChange={(e) => setDeviceId(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Manual Reason */}
                        {source === 'manual' && (
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="manualReason">Reason for Manual Entry</Label>
                                <Select value={manualReason} onValueChange={setManualReason}>
                                    <SelectTrigger id="manualReason">
                                        <SelectValue placeholder="Select reason..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {manualReasons.map(reason => (
                                            <SelectItem key={reason.value} value={reason.value}>
                                                {reason.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.manualReason && <p className="text-sm text-red-500">{errors.manualReason}</p>}
                            </div>
                        )}

                        {/* Location */}
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                placeholder="Device location..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        {/* Notes */}
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                placeholder="Additional notes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Total Hours Preview */}
                    {timeIn && timeOut && (
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <p className="text-sm text-gray-600">Total Hours: <span className="font-bold text-lg text-blue-600">{totalHours.toFixed(2)}h</span></p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                        {record ? 'Update' : 'Add'} Record
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
