import React, { useState } from 'react';
import { Send, Mail, Globe, Printer, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { PayslipDistributionRequest } from '@/types/payroll-pages';

interface PayslipDistributionProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDistribute: (data: PayslipDistributionRequest) => void;
    selectedPayslipIds: number[];
    selectedCount: number;
    isLoading?: boolean;
}

export function PayslipDistribution({
    open,
    onOpenChange,
    onDistribute,
    selectedPayslipIds,
    selectedCount,
    isLoading = false,
}: PayslipDistributionProps) {
    const [distributionMethod, setDistributionMethod] = useState<'email' | 'portal' | 'printed'>('email');
    const [emailSubject, setEmailSubject] = useState('Your Payslip for [Period]');
    const [emailMessage, setEmailMessage] = useState(
        'Dear Employee,\n\nPlease find attached your payslip for the period [Period].\n\nBest regards,\nCathay Metal Corporation\nPayroll Department'
    );

    const handleDistribute = () => {
        const data: PayslipDistributionRequest = {
            payslip_ids: selectedPayslipIds,
            distribution_method: distributionMethod,
        };

        if (distributionMethod === 'email') {
            data.email_subject = emailSubject;
            data.email_message = emailMessage;
        }

        onDistribute(data);
    };

    const getDistributionIcon = () => {
        switch (distributionMethod) {
            case 'email':
                return <Mail className="h-5 w-5 text-blue-600" />;
            case 'portal':
                return <Globe className="h-5 w-5 text-green-600" />;
            case 'printed':
                return <Printer className="h-5 w-5 text-gray-600" />;
        }
    };

    const getDistributionDescription = () => {
        switch (distributionMethod) {
            case 'email':
                return `Send ${selectedCount} payslip${selectedCount > 1 ? 's' : ''} via email to employee addresses`;
            case 'portal':
                return `Make ${selectedCount} payslip${selectedCount > 1 ? 's' : ''} available in employee portal`;
            case 'printed':
                return `Add ${selectedCount} payslip${selectedCount > 1 ? 's' : ''} to print queue`;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Distribute Payslips
                    </DialogTitle>
                    <DialogDescription>
                        {selectedCount} payslip{selectedCount > 1 ? 's' : ''} selected for distribution
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Distribution Method */}
                    <div className="space-y-3">
                        <Label>Distribution Method *</Label>
                        <RadioGroup
                            value={distributionMethod}
                            onValueChange={(value: string) => setDistributionMethod(value as 'email' | 'portal' | 'printed')}
                            disabled={isLoading}
                        >
                            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-gray-50">
                                <RadioGroupItem value="email" id="dist-email" />
                                <Label htmlFor="dist-email" className="flex flex-1 cursor-pointer items-center gap-2">
                                    <Mail className="h-4 w-4 text-blue-600" />
                                    <div className="flex-1">
                                        <div className="font-medium">Email</div>
                                        <div className="text-xs text-gray-600">
                                            Send payslips to employee email addresses
                                        </div>
                                    </div>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-gray-50">
                                <RadioGroupItem value="portal" id="dist-portal" />
                                <Label htmlFor="dist-portal" className="flex flex-1 cursor-pointer items-center gap-2">
                                    <Globe className="h-4 w-4 text-green-600" />
                                    <div className="flex-1">
                                        <div className="font-medium">Employee Portal</div>
                                        <div className="text-xs text-gray-600">
                                            Make available for download in employee portal
                                        </div>
                                    </div>
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-gray-50">
                                <RadioGroupItem value="printed" id="dist-printed" />
                                <Label htmlFor="dist-printed" className="flex flex-1 cursor-pointer items-center gap-2">
                                    <Printer className="h-4 w-4 text-gray-600" />
                                    <div className="flex-1">
                                        <div className="font-medium">Print Queue</div>
                                        <div className="text-xs text-gray-600">Add to print queue for hard copies</div>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Email Settings (only for email distribution) */}
                    {distributionMethod === 'email' && (
                        <div className="space-y-4 rounded-lg border bg-blue-50 p-4">
                            <div className="flex items-start gap-2">
                                <Mail className="mt-0.5 h-4 w-4 text-blue-600" />
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email-subject">Email Subject</Label>
                                        <Input
                                            id="email-subject"
                                            value={emailSubject}
                                            onChange={(e) => setEmailSubject(e.target.value)}
                                            placeholder="Enter email subject"
                                            disabled={isLoading}
                                        />
                                        <p className="text-xs text-gray-600">
                                            Use [Period] as placeholder for period name
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email-message">Email Message</Label>
                                        <Textarea
                                            id="email-message"
                                            value={emailMessage}
                                            onChange={(e) => setEmailMessage(e.target.value)}
                                            placeholder="Enter email message"
                                            rows={6}
                                            disabled={isLoading}
                                        />
                                        <p className="text-xs text-gray-600">
                                            Use [Period] as placeholder. Payslip will be attached as PDF.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Distribution Summary */}
                    <Alert>
                        <div className="flex items-start gap-2">
                            {getDistributionIcon()}
                            <div className="flex-1">
                                <AlertDescription>
                                    <strong>Distribution Summary:</strong>
                                    <br />
                                    {getDistributionDescription()}
                                </AlertDescription>
                            </div>
                        </div>
                    </Alert>

                    {/* Distribution Tracking Info */}
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Tracking:</strong> Distribution status will be tracked and logged. Employees will be
                            able to acknowledge receipt.
                        </AlertDescription>
                    </Alert>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleDistribute} disabled={selectedPayslipIds.length === 0 || isLoading}>
                        {isLoading ? (
                            <>Distributing...</>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Distribute {selectedCount} Payslip{selectedCount > 1 ? 's' : ''}
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
