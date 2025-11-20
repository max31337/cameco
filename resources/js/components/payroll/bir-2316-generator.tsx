import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    AlertCircle,
    CheckCircle,
    Download,
    FileText,
    Loader,
    Upload,
    Search,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BIRPeriod } from '@/types/bir-pages';

interface BIR2316GeneratorProps {
    period?: BIRPeriod;
    periodId: string;
}

/**
 * BIR 2316 Generator Component
 * Certificate of Compensation Income Withheld on Wages
 * Annual certificate issued to each employee
 */
export const BIR2316Generator: React.FC<BIR2316GeneratorProps> = ({ period, periodId }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusMessage, setStatusMessage] = useState<{
        type: 'success' | 'error' | 'info';
        message: string;
    } | null>(null);

    // Mock data for employee annual certificates
    const mockCertificates = [
        {
            id: 'CERT001',
            employee_id: 'EMP001',
            tin: '123456789012',
            employee_name: 'Juan Dela Cruz',
            employee_address: '123 Main St, Manila',
            gross_compensation: 540000,
            non_taxable_compensation: 45000, // 13th month
            taxable_compensation: 495000,
            tax_withheld: 64350,
            deductions_from_compensation: 12000,
            net_compensation: 483000,
        },
        {
            id: 'CERT002',
            employee_id: 'EMP002',
            tin: '123456789013',
            employee_name: 'Maria Santos',
            employee_address: '456 Oak Ave, Makati',
            gross_compensation: 660000,
            non_taxable_compensation: 55000,
            taxable_compensation: 605000,
            tax_withheld: 79650,
            deductions_from_compensation: 15000,
            net_compensation: 645000,
        },
        {
            id: 'CERT003',
            employee_id: 'EMP003',
            tin: '123456789014',
            employee_name: 'Pedro Reyes',
            employee_address: '789 Pine Rd, QC',
            gross_compensation: 456000,
            non_taxable_compensation: 38000,
            taxable_compensation: 418000,
            tax_withheld: 50340,
            deductions_from_compensation: 10000,
            net_compensation: 445960,
        },
        {
            id: 'CERT004',
            employee_id: 'EMP004',
            tin: '123456789015',
            employee_name: 'Rosa Garcia',
            employee_address: '321 Elm St, Cebu',
            gross_compensation: 504000,
            non_taxable_compensation: 42000,
            taxable_compensation: 462000,
            tax_withheld: 60480,
            deductions_from_compensation: 12000,
            net_compensation: 491520,
        },
        {
            id: 'CERT005',
            employee_id: 'EMP005',
            tin: '123456789016',
            employee_name: 'Carlos Morales',
            employee_address: '654 Birch Ln, Davao',
            gross_compensation: 624000,
            non_taxable_compensation: 52000,
            taxable_compensation: 572000,
            tax_withheld: 74360,
            deductions_from_compensation: 14000,
            net_compensation: 609640,
        },
    ];

    const filteredCertificates = mockCertificates.filter((cert) =>
        cert.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.tin.includes(searchTerm)
    );

    const summary = {
        total_certificates: mockCertificates.length,
        total_gross_compensation: mockCertificates.reduce((sum, c) => sum + c.gross_compensation, 0),
        total_taxable_compensation: mockCertificates.reduce(
            (sum, c) => sum + c.taxable_compensation,
            0
        ),
        total_tax_withheld: mockCertificates.reduce((sum, c) => sum + c.tax_withheld, 0),
    };

    const handleGenerate = () => {
        setIsGenerating(true);
        router.post(
            `/payroll/government/bir/generate-2316/${periodId}`,
            {},
            {
                onSuccess: () => {
                    setStatusMessage({
                        type: 'success',
                        message: 'Form 2316 certificates generated successfully for all employees',
                    });
                    setTimeout(() => setStatusMessage(null), 3000);
                },
                onError: () => {
                    setStatusMessage({
                        type: 'error',
                        message: 'Failed to generate certificates. Please try again.',
                    });
                },
                onFinish: () => setIsGenerating(false),
            }
        );
    };

    const handleDownload = () => {
        router.get(`/payroll/government/bir/download-2316/${periodId}`);
    };

    const getTaxYear = () => {
        if (period?.start_date) {
            return new Date(period.start_date).getFullYear();
        }
        return new Date().getFullYear();
    };

    return (
        <div className="space-y-6">
            {/* Status Alert */}
            {statusMessage && (
                <Alert variant={statusMessage.type === 'error' ? 'destructive' : 'default'}>
                    {statusMessage.type === 'error' ? (
                        <AlertCircle className="h-4 w-4" />
                    ) : (
                        <CheckCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>{statusMessage.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                    <AlertDescription>{statusMessage.message}</AlertDescription>
                </Alert>
            )}

            {/* Form Header */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>BIR Form 2316</CardTitle>
                            <CardDescription>
                                Certificate of Compensation Income Withheld on Wages
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">
                                Tax Year {getTaxYear()}
                            </span>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">Total Employees</p>
                            <p className="text-2xl font-bold">{summary.total_certificates}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">Total Gross Compensation</p>
                            <p className="text-2xl font-bold">
                                ₱{(summary.total_gross_compensation / 1000000).toFixed(2)}M
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">Total Taxable Compensation</p>
                            <p className="text-2xl font-bold">
                                ₱{(summary.total_taxable_compensation / 1000000).toFixed(2)}M
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">Total Tax Withheld</p>
                            <p className="text-2xl font-bold">
                                ₱{(summary.total_tax_withheld / 1000000).toFixed(2)}M
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Employee Certificates */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-base">Employee Certificates</CardTitle>
                            <CardDescription>Annual certificates per employee</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Search className="w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search employee..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee Name</TableHead>
                                    <TableHead>Employee ID</TableHead>
                                    <TableHead className="text-right">Gross Compensation</TableHead>
                                    <TableHead className="text-right">Non-Taxable</TableHead>
                                    <TableHead className="text-right">Taxable Compensation</TableHead>
                                    <TableHead className="text-right">Tax Withheld</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCertificates.map((cert) => (
                                    <TableRow key={cert.id}>
                                        <TableCell className="font-medium">{cert.employee_name}</TableCell>
                                        <TableCell className="font-mono text-sm">{cert.employee_id}</TableCell>
                                        <TableCell className="text-right">
                                            ₱{cert.gross_compensation.toLocaleString('en-PH')}
                                        </TableCell>
                                        <TableCell className="text-right text-green-600">
                                            ₱{cert.non_taxable_compensation.toLocaleString('en-PH')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            ₱{cert.taxable_compensation.toLocaleString('en-PH')}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            ₱{cert.tax_withheld.toLocaleString('en-PH')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-3">
                        <Button onClick={handleGenerate} disabled={isGenerating} className="flex-1">
                            {isGenerating ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Generate Form 2316
                                </>
                            )}
                        </Button>
                        <Button variant="outline" onClick={handleDownload} className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download Certificates
                        </Button>
                        <Button variant="secondary" className="flex-1">
                            <Upload className="w-4 h-4 mr-2" />
                            Distribute to Employees
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Information */}
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>BIR Form 2316 Information</AlertTitle>
                <AlertDescription>
                    This form certifies the annual compensation income and taxes withheld from each
                    employee. Must be issued to employees on or before January 31st of the following
                    tax year and filed with the BIR.
                </AlertDescription>
            </Alert>

            {/* Important Notes */}
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-sm">Important Notes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700 space-y-2">
                    <p>
                        • Non-taxable compensation should include 13th month pay and other allowances
                        within statutory limits
                    </p>
                    <p>• Ensure all employee TINs and addresses are complete and accurate</p>
                    <p>
                        • Taxable compensation should match employee annual gross wages less non-taxable
                        items
                    </p>
                    <p>• Keep copies of Form 2316 for at least 3 years for audit purposes</p>
                </CardContent>
            </Card>
        </div>
    );
};
