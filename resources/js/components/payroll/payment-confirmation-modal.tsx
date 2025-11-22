import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Upload, CheckCircle } from 'lucide-react';
import type { PaymentTracking } from '@/types/payroll-pages';

interface PaymentConfirmationModalProps {
    isOpen: boolean;
    payment?: PaymentTracking;
    onClose: () => void;
    onConfirm: (paymentId: number, data: PaymentConfirmationData) => void;
    isLoading?: boolean;
}

export interface PaymentConfirmationData {
    payment_date: string;
    payment_reference: string;
    confirmation_file?: File;
    payment_method?: 'bank_transfer' | 'cash' | 'check';
    notes?: string;
}

export default function PaymentConfirmationModal({
    isOpen,
    payment,
    onClose,
    onConfirm,
    isLoading = false,
}: PaymentConfirmationModalProps) {
    const [formData, setFormData] = useState<PaymentConfirmationData>({
        payment_date: new Date().toISOString().split('T')[0],
        payment_reference: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, payment_date: e.target.value });
        setErrors({ ...errors, payment_date: '' });
    };

    const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, payment_reference: e.target.value });
        setErrors({ ...errors, payment_reference: '' });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setFormData({ ...formData, confirmation_file: file });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.payment_date) {
            newErrors.payment_date = 'Payment date is required';
        }

        if (!formData.payment_reference.trim()) {
            newErrors.payment_reference = 'Payment reference is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm() && payment) {
            onConfirm(payment.id, formData);
        }
    };

    if (!payment) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Confirm Payment</DialogTitle>
                    <DialogDescription>
                        Record payment details for {payment.employee_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Payment Summary Card */}
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-600">Employee</p>
                                    <p className="font-semibold text-sm">{payment.employee_name}</p>
                                    <p className="text-xs text-gray-500">{payment.employee_number}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Amount</p>
                                    <p className="font-semibold text-sm text-blue-600">{payment.formatted_net_pay}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Period</p>
                                    <p className="font-semibold text-sm">{payment.period_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600">Method</p>
                                    <p className="font-semibold text-sm">{payment.payment_method_label}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Fields */}
                    <div className="space-y-3">
                        {/* Payment Date */}
                        <div>
                            <Label htmlFor="payment_date" className="text-xs font-medium">
                                Payment Date *
                            </Label>
                            <Input
                                id="payment_date"
                                type="date"
                                value={formData.payment_date}
                                onChange={handleDateChange}
                                disabled={isLoading}
                                className="mt-1"
                            />
                            {errors.payment_date && (
                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.payment_date}
                                </p>
                            )}
                        </div>

                        {/* Payment Reference */}
                        <div>
                            <Label htmlFor="payment_reference" className="text-xs font-medium">
                                Payment Reference (Transaction ID / Check #) *
                            </Label>
                            <Input
                                id="payment_reference"
                                type="text"
                                placeholder="e.g., TXN123456 or CHK00789"
                                value={formData.payment_reference}
                                onChange={handleReferenceChange}
                                disabled={isLoading}
                                className="mt-1"
                            />
                            {errors.payment_reference && (
                                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.payment_reference}
                                </p>
                            )}
                        </div>

                        {/* File Upload */}
                        <div>
                            <Label htmlFor="confirmation_file" className="text-xs font-medium">
                                Upload Confirmation (Bank Receipt/Proof)
                            </Label>
                            <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition">
                                <input
                                    id="confirmation_file"
                                    type="file"
                                    onChange={handleFileSelect}
                                    disabled={isLoading}
                                    className="hidden"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <label htmlFor="confirmation_file" className="cursor-pointer">
                                    {selectedFile ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <span className="text-xs text-gray-700">{selectedFile.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1">
                                            <Upload className="h-4 w-4 text-gray-400" />
                                            <span className="text-xs text-gray-600">Click to upload or drag file</span>
                                            <span className="text-xs text-gray-400">PDF, JPG, PNG (Max 5MB)</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Info Alert */}
                    <div className="flex gap-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>
                            Payment reference helps track the transaction with the bank. Keep the confirmation file for audit purposes.
                        </span>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-xs"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-xs"
                    >
                        {isLoading ? 'Confirming...' : 'Confirm Payment'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
