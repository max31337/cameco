import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';

interface Department {
    id: number;
    name: string;
}

interface Position {
    id: number;
    title: string;
}

interface ImportPageProps {
    departments: Department[];
    positions: Position[];
}

export default function ImportPage({ departments, positions }: ImportPageProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isImporting, setIsImporting] = useState(false);
    const [result, setResult] = useState<{
        imported: number;
        skipped: number;
        errors: string[];
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
                setError('Please select a CSV file');
                return;
            }
            setFile(selectedFile);
            setError(null);
            setResult(null);
        }
    };

    const handleImport = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }

        setIsImporting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/hr/employees/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResult({
                imported: response.data.imported,
                skipped: response.data.skipped,
                errors: response.data.errors,
            });

            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            const message = axios.isAxiosError(err) 
                ? err.response?.data?.message || err.message 
                : 'Import failed';
            setError(message);
        } finally {
            setIsImporting(false);
        }
    };

    const handleDownloadTemplate = () => {
        window.location.href = '/hr/employees/import/template';
    };

    return (
        <AppLayout>
            <Head title="Import Employees" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/hr/employees">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Import Employees</h1>
                        <p className="text-muted-foreground mt-1">
                            Bulk import employees from a CSV file
                        </p>
                    </div>
                </div>

                {/* Main Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upload CSV File</CardTitle>
                        <CardDescription>
                            Import multiple employees at once using a CSV file. Download the template below to see the required format.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Template Download */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-blue-900">Download Template</h3>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Download the CSV template to see the required columns and format.
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownloadTemplate}
                                    className="gap-2"
                                >
                                    <Download className="h-4 w-4" />
                                    Download Template
                                </Button>
                            </div>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Success Alert */}
                        {result && (
                            <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    <strong>Import completed!</strong> {result.imported} employees imported, {result.skipped} skipped.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* File Upload */}
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition"
                                onClick={() => fileInputRef.current?.click()}>
                                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                <p className="font-semibold text-gray-700">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    CSV files only (max 10MB)
                                </p>
                                {file && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Selected: {file.name}
                                    </p>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </div>

                            {/* Import Button */}
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleImport}
                                    disabled={!file || isImporting}
                                    className="gap-2"
                                >
                                    <Upload className="h-4 w-4" />
                                    {isImporting ? 'Importing...' : 'Import'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setFile(null);
                                        setResult(null);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>

                        {/* Import Results */}
                        {result && result.errors.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="font-semibold text-amber-900">Import Issues</h3>
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                                    <ul className="space-y-1 text-sm text-amber-800">
                                        {result.errors.map((err, index) => (
                                            <li key={index} className="flex gap-2">
                                                <span className="text-amber-600">•</span>
                                                <span>{err}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* CSV Format Info */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                            <h3 className="font-semibold text-gray-900">CSV Format Requirements</h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <p><strong>Required columns:</strong></p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>First Name</li>
                                    <li>Last Name</li>
                                    <li>Department (must match existing department name)</li>
                                    <li>Position (must match existing position title)</li>
                                    <li>Date Hired (format: YYYY-MM-DD)</li>
                                </ul>
                                <p className="mt-3"><strong>Optional columns:</strong></p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Employee Number</li>
                                    <li>Middle Name</li>
                                    <li>Email</li>
                                    <li>Mobile</li>
                                    <li>Employment Type (default: regular)</li>
                                    <li>Status (default: active)</li>
                                    <li>Gender</li>
                                    <li>Civil Status</li>
                                    <li>Date of Birth (format: YYYY-MM-DD)</li>
                                </ul>
                                <p className="mt-3 text-gray-600">
                                    All dates should be in YYYY-MM-DD format (e.g., 2024-01-15)
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Reference Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Available Departments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {departments.map((dept) => (
                                    <div key={dept.id} className="text-sm text-gray-700 py-1 border-b">
                                        {dept.name}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Available Positions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {positions.map((pos) => (
                                    <div key={pos.id} className="text-sm text-gray-700 py-1 border-b">
                                        {pos.title}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
