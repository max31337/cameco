import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BankFilesList } from '@/components/payroll/bank-files-list';
import { BankFileGeneratorModal } from '@/components/payroll/bank-file-generator-modal';
import { BankFileValidation } from '@/components/payroll/bank-file-validation';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import type { BreadcrumbItem } from '@/types';
import type { BankFilesPageProps } from '@/types/payroll-pages';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Payroll', href: '/payroll' },
  { title: 'Bank Files', href: '/payroll/bank-files' },
];

export default function BankFilesIndex({
  bankFiles,
  periods,
  bankList,
  employeesCount,
}: BankFilesPageProps) {
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<number | null>(null);

  const handleGenerateFile = (data: { period_id: number; bank_name: string; file_format: string }) => {
    console.log('Generating bank file:', data);
    setIsGeneratorOpen(false);
  };

  const handleDownload = (id: number) => {
    console.log('Download file:', id);
  };

  const handleView = (id: number) => {
    setSelectedFile(id);
  };

  const handleUpload = (id: number) => {
    console.log('Upload file:', id);
  };

  const handleRegenerate = (id: number) => {
    console.log('Regenerate file:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete file:', id);
  };

  const confirmedFiles = bankFiles.filter((f) => f.status === 'confirmed').length;
  const pendingFiles = bankFiles.filter((f) => f.status === 'generated').length;
  const totalAmount = bankFiles.reduce((sum, f) => sum + f.total_amount, 0);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Bank Files" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bank Payroll Files</h1>
            <p className="mt-2 text-gray-600">Generate and manage payroll files for bank submission</p>
          </div>
          <Button onClick={() => setIsGeneratorOpen(true)} size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Generate New File
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Files</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{bankFiles.length}</p>
              <p className="mt-1 text-xs text-gray-600">{employeesCount} employees processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Confirmed Files</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{confirmedFiles}</p>
              <p className="mt-1 text-xs text-gray-600">Ready for bank submission</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {new Intl.NumberFormat('en-PH', {
                  style: 'currency',
                  currency: 'PHP',
                  minimumFractionDigits: 0,
                }).format(totalAmount)}
              </p>
              <p className="mt-1 text-xs text-gray-600">All periods combined</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {pendingFiles > 0 && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You have {pendingFiles} generated file(s) awaiting validation and upload to the bank.
            </AlertDescription>
          </Alert>
        )}

        {/* Reference Card */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Supported Banks & Formats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bankList.map((bank) => (
                <div key={bank.id} className="rounded border border-blue-200 bg-white p-3">
                  <p className="font-semibold text-blue-900">{bank.name}</p>
                  <p className="text-xs text-gray-600">Code: {bank.code}</p>
                  <p className="mt-1 text-xs font-medium text-blue-700">
                    Formats: {bank.supported_formats.map((f) => f.toUpperCase()).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bank Files List */}
        <BankFilesList
          files={bankFiles}
          onDownload={handleDownload}
          onView={handleView}
          onUpload={handleUpload}
          onRegenerate={handleRegenerate}
          onDelete={handleDelete}
        />

        {/* File Validation (when file is selected) */}
        {selectedFile && (
          <BankFileValidation
            fileName="BPI_PAYROLL_20251120100000.csv"
            fileSize={125000}
            totalRecords={25}
            validRecords={24}
            warningRecords={1}
            errorRecords={0}
            errors={[
              {
                employee_id: 5,
                employee_name: 'Juan Dela Cruz',
                field: 'bank_account_number',
                message: 'Account number format appears unusual for selected bank',
                severity: 'warning',
              },
            ]}
          />
        )}

        {/* Info Card */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-base">Bank File Generation Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-purple-900">
            <div>
              <p className="font-medium">1. Select Period & Bank</p>
              <p className="text-xs text-purple-800">
                Choose a payroll period and the bank for which you want to generate the file.
              </p>
            </div>
            <div>
              <p className="font-medium">2. Choose File Format</p>
              <p className="text-xs text-purple-800">
                Select the appropriate file format supported by your bank (CSV, Excel, or TXT).
              </p>
            </div>
            <div>
              <p className="font-medium">3. Generate & Validate</p>
              <p className="text-xs text-purple-800">
                The system generates the file and performs validation checks on all records.
              </p>
            </div>
            <div>
              <p className="font-medium">4. Upload to Bank</p>
              <p className="text-xs text-purple-800">
                Upload the validated file to your bank portal using the appropriate channel (eFPS, etc.).
              </p>
            </div>
            <div>
              <p className="font-medium">5. Track Status</p>
              <p className="text-xs text-purple-800">
                Monitor the confirmation status and maintain records for audit trail.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generator Modal */}
      <BankFileGeneratorModal
        isOpen={isGeneratorOpen}
        periods={periods}
        banks={bankList}
        onGenerate={handleGenerateFile}
        onCancel={() => setIsGeneratorOpen(false)}
      />
    </AppLayout>
  );
}
