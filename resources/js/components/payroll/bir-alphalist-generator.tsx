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
    AlertTriangle,
    Search,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BIRPeriod } from '@/types/bir-pages';

interface BIRAlphaListGeneratorProps {
    period?: BIRPeriod;
    periodId: string;
}

/**
 * BIR Alphalist Generator Component
 * Employee listing in DAT format for BIR submission
 * Contains employee TIN, annual gross, and withholding tax
 */
export const BIRAlphaListGenerator: React.FC<BIRAlphaListGeneratorProps> = ({
    period,
    periodId,
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusMessage, setStatusMessage] = useState<{
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
    } | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Mock data for alphalist employees
    const mockEmployees = [
        {
            sequence_number: 1,
            tin: '123456789012',
            employee_name: 'Juan Dela Cruz',
            address: '123 Main St, Manila',
            birth_date: '1990-05-15',
            gender: 'M' as const,
            civil_status: 'Married',
            annual_gross_compensation: 540000,
            annual_non_taxable_compensation: 45000,
            annual_taxable_compensation: 495000,
            annual_tax_withheld: 64350,
            status_flag: 'Active',
        },
        {
            sequence_number: 2,
            tin: '123456789013',
            employee_name: 'Maria Santos',
            address: '456 Oak Ave, Makati',
            birth_date: '1988-08-22',
            gender: 'F' as const,
            civil_status: 'Single',
            annual_gross_compensation: 660000,
            annual_non_taxable_compensation: 55000,
            annual_taxable_compensation: 605000,
            annual_tax_withheld: 79650,
            status_flag: 'Active',
        },
        {
            sequence_number: 3,
            tin: '123456789014',
            employee_name: 'Pedro Reyes',
            address: '789 Pine Rd, QC',
            birth_date: '1992-03-10',
            gender: 'M' as const,
            civil_status: 'Divorced',
            annual_gross_compensation: 456000,
            annual_non_taxable_compensation: 38000,
            annual_taxable_compensation: 418000,
            annual_tax_withheld: 50340,
            status_flag: 'Active',
        },
        {
            sequence_number: 4,
            tin: '123456789015',
            employee_name: 'Rosa Garcia',
            address: '321 Elm St, Cebu',
            birth_date: '1985-12-05',
            gender: 'F' as const,
            civil_status: 'Married',
            annual_gross_compensation: 504000,
            annual_non_taxable_compensation: 42000,
            annual_taxable_compensation: 462000,
            annual_tax_withheld: 60480,
            status_flag: 'Active',
        },
        {
            sequence_number: 5,
            tin: '123456789016',
            employee_name: 'Carlos Morales',
            address: '654 Birch Ln, Davao',
            birth_date: '1987-07-18',
            gender: 'M' as const,
            civil_status: 'Single',
            annual_gross_compensation: 624000,
            annual_non_taxable_compensation: 52000,
            annual_taxable_compensation: 572000,
            annual_tax_withheld: 74360,
            status_flag: 'Active',
        },
    ];

    const filteredEmployees = mockEmployees.filter((emp) =>
        emp.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.tin.includes(searchTerm) ||
        emp.status_flag.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const summary = {
        total_employees: mockEmployees.length,
        total_gross_compensation: mockEmployees.reduce(
            (sum, e) => sum + e.annual_gross_compensation,
            0
        ),
        total_taxable_compensation: mockEmployees.reduce(
            (sum, e) => sum + e.annual_taxable_compensation,
            0
        ),
        total_tax_withheld: mockEmployees.reduce((sum, e) => sum + e.annual_tax_withheld, 0),
    };

    const handleValidate = () => {
        setIsValidating(true);
        // Simulate validation
        setTimeout(() => {
            const errors: string[] = [];

            // Check for missing TINs
            if (mockEmployees.some((e) => !e.tin)) {
                errors.push('Some employees have missing TINs');
            }

            // Check for missing addresses
            if (mockEmployees.some((e) => !e.address)) {
                errors.push('Some employees have missing addresses');
            }

            // Check for invalid compensation data
            if (mockEmployees.some((e) => e.annual_gross_compensation === 0)) {
                errors.push('Some employees have zero gross compensation');
            }

            setValidationErrors(errors);

            if (errors.length === 0) {
                setStatusMessage({
                    type: 'success',
                    message: 'All employee data validated successfully',
                });
            } else {
                setStatusMessage({
                    type: 'warning',
                    message: `Validation found ${errors.length} issue(s)`,
                });
            }

            setTimeout(() => setStatusMessage(null), 3000);
            setIsValidating(false);
        }, 1500);
    };

    const handleGenerate = () => {
        if (validationErrors.length > 0) {
            setStatusMessage({
                type: 'error',
                message: 'Please fix validation errors before generating',
            });
            return;
        }

        setIsGenerating(true);
        router.post(
            `/payroll/government/bir/generate-alphalist/${periodId}`,
            {},
            {
                onSuccess: () => {
                    setStatusMessage({
                        type: 'success',
                        message: 'Alphalist generated successfully in DAT format',
                    });
                    setTimeout(() => setStatusMessage(null), 3000);
                },
                onError: () => {
                    setStatusMessage({
                        type: 'error',
                        message: 'Failed to generate alphalist. Please try again.',
                    });
                },
                onFinish: () => setIsGenerating(false),
            }
        );
    };

    const handleDownload = () => {
        router.get(`/payroll/government/bir/download-alphalist/${periodId}`);
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
                <Alert
                    variant={
                        statusMessage.type === 'error'
                            ? 'destructive'
                            : statusMessage.type === 'warning'
                              ? 'destructive'
                              : 'default'
                    }
                >
                    {statusMessage.type === 'error' ? (
                        <AlertCircle className="h-4 w-4" />
                    ) : statusMessage.type === 'warning' ? (
                        <AlertTriangle className="h-4 w-4" />
                    ) : (
                        <CheckCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                        {statusMessage.type === 'error'
                            ? 'Error'
                            : statusMessage.type === 'warning'
                              ? 'Warning'
                              : 'Success'}
                    </AlertTitle>
                    <AlertDescription>{statusMessage.message}</AlertDescription>
                </Alert>
            )}

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Validation Errors</AlertTitle>
                    <AlertDescription>
                        <ul className="list-disc list-inside space-y-1 mt-2">
                            {validationErrors.map((error, idx) => (
                                <li key={idx}>{error}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}

            {/* Form Header */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle>BIR Alphalist</CardTitle>
                            <CardDescription>
                                Employee listing for BIR (DAT file format)
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded">
                            <FileText className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-900">
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
                            <p className="text-2xl font-bold">{summary.total_employees}</p>
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

            {/* Employee List */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-base">Alphalist Employee Data</CardTitle>
                            <CardDescription>
                                Employee compensation and tax information
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Search className="w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search TIN or name..."
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
                                    <TableHead className="w-12">Seq</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>TIN</TableHead>
                                    <TableHead className="text-right">Gross</TableHead>
                                    <TableHead className="text-right">Non-Taxable</TableHead>
                                    <TableHead className="text-right">Taxable</TableHead>
                                    <TableHead className="text-right">Tax Withheld</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredEmployees.map((emp) => (
                                    <TableRow key={emp.tin}>
                                        <TableCell className="font-mono text-sm">
                                            {emp.sequence_number}
                                        </TableCell>
                                        <TableCell className="font-medium">{emp.employee_name}</TableCell>
                                        <TableCell className="font-mono text-sm">{emp.tin}</TableCell>
                                        <TableCell className="text-right text-sm">
                                            ₱{emp.annual_gross_compensation.toLocaleString('en-PH')}
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-green-600">
                                            ₱{emp.annual_non_taxable_compensation.toLocaleString('en-PH')}
                                        </TableCell>
                                        <TableCell className="text-right text-sm">
                                            ₱{emp.annual_taxable_compensation.toLocaleString('en-PH')}
                                        </TableCell>
                                        <TableCell className="text-right text-sm font-semibold">
                                            ₱{emp.annual_tax_withheld.toLocaleString('en-PH')}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded">
                                                {emp.status_flag}
                                            </span>
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
                        <Button
                            variant="outline"
                            onClick={handleValidate}
                            disabled={isValidating}
                            className="flex-1"
                        >
                            {isValidating ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    Validating...
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Validate Data
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="flex-1"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Generate Alphalist
                                </>
                            )}
                        </Button>
                        <Button variant="outline" onClick={handleDownload} className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download (DAT)
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Information */}
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>BIR Alphalist Information</AlertTitle>
                <AlertDescription>
                    The Alphalist is a listing of all employees with their annual gross
                    compensation and income tax withheld. It must be submitted in DAT format with
                    the BIR.
                </AlertDescription>
            </Alert>

            {/* Format Specifications */}
            <Card className="bg-gray-50">
                <CardHeader>
                    <CardTitle className="text-sm">DAT File Format Specifications</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-700 space-y-2">
                    <p>
                        <strong>Field Sequence:</strong> TIN, Name, Address, Birth Date, Gender,
                        Civil Status, Annual Gross, Annual Taxable, Annual Tax Withheld
                    </p>
                    <p>
                        <strong>File Format:</strong> Pipe-delimited (|) text file with UTF-8
                        encoding
                    </p>
                    <p>
                        <strong>Record Format:</strong> One employee per line with consistent
                        delimiter usage
                    </p>
                    <p>
                        <strong>Date Format:</strong> YYYY-MM-DD for birth dates and transaction
                        dates
                    </p>
                    <p>
                        <strong>Amount Format:</strong> Numeric values with 2 decimal places, no
                        currency symbols
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
