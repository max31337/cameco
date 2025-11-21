import React from 'react';
import { Download, RefreshCw, Eye, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface BankFile {
  id: number;
  bank_name: string;
  period_name: string;
  file_format: string;
  status: string;
  status_label: string;
  status_color: string;
  total_employees: number;
  total_amount: number;
  generated_at: string;
  uploaded_at: string | null;
  uploaded_by: string | null;
  confirmation_number: string | null;
  file_name: string;
  file_size: number;
}

interface BankFilesListProps {
  files: BankFile[];
  onDownload?: (id: number) => void;
  onView?: (id: number) => void;
  onUpload?: (id: number) => void;
  onRegenerate?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function BankFilesList({ files, onDownload, onView, onUpload, onRegenerate, onDelete }: BankFilesListProps) {
  const formatPeso = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'processed':
        return 'default';
      case 'uploaded':
        return 'secondary';
      case 'generated':
        return 'outline';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Generated Bank Files</CardTitle>
      </CardHeader>
      <CardContent>
        {files.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Bank</TableHead>
                  <TableHead className="font-semibold">Period</TableHead>
                  <TableHead className="font-semibold">Format</TableHead>
                  <TableHead className="text-right font-semibold">Employees</TableHead>
                  <TableHead className="text-right font-semibold">Total Amount</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Generated</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.id} className="hover:bg-gray-50">
                    <TableCell className="font-semibold">{file.bank_name}</TableCell>
                    <TableCell className="text-sm">{file.period_name}</TableCell>
                    <TableCell className="text-sm">
                      <Badge variant="outline">{file.file_format.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{file.total_employees}</TableCell>
                    <TableCell className="text-right font-medium">{formatPeso(file.total_amount)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(file.status)}>
                        {file.status_label}
                      </Badge>
                      {file.confirmation_number && (
                        <div className="mt-1 text-xs text-gray-600">{file.confirmation_number}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(file.generated_at)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView?.(file.id)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {file.status === 'generated' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onUpload?.(file.id)}
                            title="Upload to Bank"
                          >
                            <Upload className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownload?.(file.id)}
                          title="Download File"
                        >
                          <Download className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRegenerate?.(file.id)}
                          title="Regenerate File"
                        >
                          <RefreshCw className="h-4 w-4 text-orange-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(file.id)}
                          title="Delete File"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">No bank files generated yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
