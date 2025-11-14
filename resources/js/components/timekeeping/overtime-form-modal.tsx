import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { Clock } from 'lucide-react';
import type { OvertimeRecord, EmployeeBasic } from '@/types/timekeeping-pages';

interface OvertimeFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: OvertimeFormData) => void;
    record?: OvertimeRecord | null;
    employees: EmployeeBasic[];
    isLoading?: boolean;
}

export interface OvertimeFormData {
    employee_id: number;
    overtime_date: string;
    planned_hours: number;
    actual_hours?: number;
    reason: string;
    status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
}

export function OvertimeFormModal({
    isOpen,
    onClose,
    onSave,
    record,
    employees,
    isLoading = false,
}: OvertimeFormModalProps) {
    const [employeeId, setEmployeeId] = useState(record?.employee_id?.toString() || '');
    const [overtimeDate, setOvertimeDate] = useState(record?.overtime_date || new Date().toISOString().split('T')[0]);
    const [plannedHours, setPlannedHours] = useState(record?.planned_hours?.toString() || '');
    const [actualHours, setActualHours] = useState(record?.actual_hours?.toString() || '');
    const [reason, setReason] = useState(record?.reason || '');
    const [status, setStatus] = useState<'planned' | 'in_progress' | 'completed' | 'cancelled'>(
        record?.status || 'planned'
    );
    const [notes, setNotes] = useState(record?.notes || '');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!employeeId) newErrors.employee_id = 'Employee is required';
        if (!overtimeDate) newErrors.overtime_date = 'Date is required';
        if (!plannedHours || parseFloat(plannedHours) <= 0) {
            newErrors.planned_hours = 'Planned hours must be greater than 0';
        }
        if (!reason || reason.trim().length === 0) {
            newErrors.reason = 'Reason is required';
        }
        if (actualHours && parseFloat(actualHours) < 0) {
            newErrors.actual_hours = 'Actual hours cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        onSave({
            employee_id: parseInt(employeeId),
            overtime_date: overtimeDate,
            planned_hours: parseFloat(plannedHours),
            actual_hours: actualHours ? parseFloat(actualHours) : undefined,
            reason,
            status,
            notes: notes || undefined,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{record ? 'Edit Overtime Record' : 'Create Overtime Record'}</DialogTitle>
                    <DialogDescription>
                        Create or modify overtime records for employees
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Employee Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="employee">Employee *</Label>
                        <Select value={employeeId} onValueChange={setEmployeeId}>
                            <SelectTrigger id="employee" className={errors.employee_id ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((emp) => (
                                    <SelectItem key={emp.id} value={emp.id.toString()}>
                                        {emp.name} ({emp.employee_number})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.employee_id && <p className="text-xs text-red-600">{errors.employee_id}</p>}
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                        <Label htmlFor="overtime-date">Overtime Date *</Label>
                        <Input
                            id="overtime-date"
                            type="date"
                            value={overtimeDate}
                            onChange={(e) => setOvertimeDate(e.target.value)}
                            className={errors.overtime_date ? 'border-red-500' : ''}
                        />
                        {errors.overtime_date && <p className="text-xs text-red-600">{errors.overtime_date}</p>}
                    </div>

                    {/* Hours Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="planned-hours">Planned Hours *</Label>
                            <Input
                                id="planned-hours"
                                type="number"
                                min="0"
                                step="0.5"
                                value={plannedHours}
                                onChange={(e) => setPlannedHours(e.target.value)}
                                placeholder="e.g., 2, 2.5"
                                className={errors.planned_hours ? 'border-red-500' : ''}
                            />
                            {errors.planned_hours && (
                                <p className="text-xs text-red-600">{errors.planned_hours}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="actual-hours">Actual Hours (Optional)</Label>
                            <Input
                                id="actual-hours"
                                type="number"
                                min="0"
                                step="0.5"
                                value={actualHours}
                                onChange={(e) => setActualHours(e.target.value)}
                                placeholder="e.g., 2, 2.5"
                                className={errors.actual_hours ? 'border-red-500' : ''}
                            />
                            {errors.actual_hours && (
                                <p className="text-xs text-red-600">{errors.actual_hours}</p>
                            )}
                        </div>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason *</Label>
                        <textarea
                            id="reason"
                            placeholder="Why is this overtime necessary?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.reason ? 'border-red-500' : 'border-gray-300'
                            }`}
                            rows={3}
                        />
                        {errors.reason && <p className="text-xs text-red-600">{errors.reason}</p>}
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onValueChange={(value: 'planned' | 'in_progress' | 'completed' | 'cancelled') => setStatus(value)}>
                            <SelectTrigger id="status">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="planned">Planned</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <textarea
                            id="notes"
                            placeholder="Additional notes..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>

                    {/* Hours Preview */}
                    {plannedHours && (
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-semibold text-blue-900">Planned Overtime</p>
                                            <p className="text-2xl font-bold text-blue-600">{plannedHours} hours</p>
                                        </div>
                                    </div>
                                    {actualHours && (
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-green-900">Actual: {actualHours}h</p>
                                            <p className={`text-lg font-bold ${
                                                parseFloat(actualHours) > parseFloat(plannedHours)
                                                    ? 'text-orange-600'
                                                    : 'text-green-600'
                                            }`}>
                                                {parseFloat(actualHours) > parseFloat(plannedHours) ? '+' : ''}
                                                {(parseFloat(actualHours) - parseFloat(plannedHours)).toFixed(1)}h
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </form>

                <DialogFooter className="gap-3">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading} className="gap-2">
                        {isLoading && <span className="animate-spin">⟳</span>}
                        {record ? 'Update Record' : 'Create Record'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
