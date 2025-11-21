import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ValidationError {
  employee_id: number;
  employee_name?: string;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface BankFileValidationProps {
  fileName: string;
  fileSize: number;
  totalRecords: number;
  validRecords: number;
  warningRecords: number;
  errorRecords: number;
  errors: ValidationError[];
  isValidating?: boolean;
}

export function BankFileValidation({
  fileName,
  fileSize,
  totalRecords,
  validRecords,
  warningRecords,
  errorRecords,
  errors,
  isValidating = false,
}: BankFileValidationProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const validationPercentage = totalRecords > 0 ? (validRecords / totalRecords) * 100 : 0;
  const isValid = errorRecords === 0;

  return (
    <div className="space-y-6">
      {/* Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isValidating ? (
              <>
                <Info className="h-5 w-5 text-blue-600" />
                Validating File...
              </>
            ) : isValid ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                File Validation Successful
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-600" />
                Validation Issues Found
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600">File Name</p>
              <p className="font-medium">{fileName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">File Size</p>
              <p className="font-medium">{formatFileSize(fileSize)}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium">Record Validation</p>
              <p className="text-sm text-gray-600">
                {validRecords} of {totalRecords}
              </p>
            </div>
            <Progress value={validationPercentage} className="h-2" />
          </div>

          {/* Status Summary */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-xs font-medium text-green-700">VALID</p>
              <p className="mt-1 text-xl font-bold text-green-900">{validRecords}</p>
            </div>
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <p className="text-xs font-medium text-yellow-700">WARNINGS</p>
              <p className="mt-1 text-xl font-bold text-yellow-900">{warningRecords}</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-xs font-medium text-red-700">ERRORS</p>
              <p className="mt-1 text-xl font-bold text-red-900">{errorRecords}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Validation Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">Format Validation</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Correct file format (CSV, Excel, TXT)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Valid column headers present
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                No missing required fields
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Account Number Validation</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Valid 10-16 digit account numbers
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Account names match employee names
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                No duplicate account numbers
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Amount Validation</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Valid numeric amounts (no negative)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Amount matches payroll calculation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                No amounts exceeding bank limits
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Errors & Warnings */}
      {errors.length > 0 && (
        <Card className={isValid ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}>
          <CardHeader>
            <CardTitle className="text-base">
              {isValid ? 'Warnings' : 'Errors & Warnings'} ({errors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {errors.map((error, idx) => (
                <Alert
                  key={idx}
                  className={
                    error.severity === 'error'
                      ? 'border-red-200 bg-red-50'
                      : 'border-yellow-200 bg-yellow-50'
                  }
                >
                  <div className="flex items-start gap-2">
                    {error.severity === 'error' ? (
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {error.severity === 'error' ? 'Error' : 'Warning'} - Employee #{error.employee_id}
                      </p>
                      <p className="text-sm text-gray-700">{error.message}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {error.field}
                      </Badge>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control Totals */}
      {!isValidating && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">Control Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Total Records:</span>
              <span className="font-semibold">{totalRecords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Control Total Amount:</span>
              <span className="font-semibold">₱1,250,000.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Hash Value:</span>
              <span className="font-mono text-xs">a3f7b2c9d4e1f6a8b9c0d2e3f4a5b6c7</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
