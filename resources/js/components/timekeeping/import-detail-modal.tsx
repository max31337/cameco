import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import type { ImportBatch, ImportError } from '@/types/timekeeping-pages';

interface ImportDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRetry?: (batch: ImportBatch) => void;
    batch: ImportBatch | null;
    errors?: ImportError[];
}

const statusColors = {
    pending: { bg: 'bg-yellow-50', text: 'text-yellow-900', badge: 'bg-yellow-100 text-yellow-800' },
    processing: { bg: 'bg-blue-50', text: 'text-blue-900', badge: 'bg-blue-100 text-blue-800' },
    completed: { bg: 'bg-green-50', text: 'text-green-900', badge: 'bg-green-100 text-green-800' },
    partial: { bg: 'bg-orange-50', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-800' },
    failed: { bg: 'bg-red-50', text: 'text-red-900', badge: 'bg-red-100 text-red-800' },
};

export function ImportDetailModal({
    isOpen,
    onClose,
    onRetry,
    batch,
    errors = [],
}: ImportDetailModalProps) {
    if (!batch) return null;

    const status = batch.status as keyof typeof statusColors;
    const colors = statusColors[status] || statusColors.pending;

    const getStatusLabel = (s: string) => {
        const labels: Record<string, string> = {
            pending: 'Pending',
            processing: 'Processing',
            completed: 'Completed',
            partial: 'Partial',
            failed: 'Failed',
        };
        return labels[s] || s;
    };

    const successRate = batch.total_records > 0
        ? Math.round((batch.successful_records / batch.total_records) * 100)
        : 0;

    const errorRate = batch.total_records > 0
        ? Math.round((batch.failed_records / batch.total_records) * 100)
        : 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle>Import Batch Details</DialogTitle>
                            <p className="text-xs text-gray-500 mt-1">Batch ID: {batch.id}</p>
                        </div>
                        <Badge className={colors.badge}>{getStatusLabel(status)}</Badge>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="records">Records ({batch.processed_records})</TabsTrigger>
                        {errors.length > 0 && (
                            <TabsTrigger value="errors">Errors ({errors.length})</TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* File Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <FileText className="h-5 w-5" />
                                    File Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* File Name - Full Width */}
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold mb-2">File Name</p>
                                    <p className="text-sm font-mono bg-gray-50 p-3 rounded-lg break-all">{batch.file_name}</p>
                                </div>

                                {/* File Size, Import Type, Upload Time - Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold mb-2">File Size</p>
                                        <p className="text-sm font-semibold text-gray-900">{(batch.file_size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold mb-2">Import Type</p>
                                        <p className="text-sm font-semibold text-gray-900 capitalize">{batch.import_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-600 font-semibold mb-2">Upload Time</p>
                                        <p className="text-sm font-semibold text-gray-900">{batch.created_at}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Processing Statistics */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Clock className="h-5 w-5" />
                                    Processing Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Records Summary */}
                                <div className="grid grid-cols-4 gap-4">
                                    <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                                        <CardContent className="pt-4">
                                            <p className="text-xs text-gray-600 font-semibold">Total Records</p>
                                            <p className="text-2xl font-bold text-gray-900 mt-2">{batch.total_records}</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-green-50 to-green-100">
                                        <CardContent className="pt-4">
                                            <p className="text-xs text-gray-600 font-semibold">Successful</p>
                                            <p className="text-2xl font-bold text-green-600 mt-2">{batch.successful_records}</p>
                                            <p className="text-xs text-green-600 mt-1">{successRate}%</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-red-50 to-red-100">
                                        <CardContent className="pt-4">
                                            <p className="text-xs text-gray-600 font-semibold">Failed</p>
                                            <p className="text-2xl font-bold text-red-600 mt-2">{batch.failed_records}</p>
                                            <p className="text-xs text-red-600 mt-1">{errorRate}%</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
                                        <CardContent className="pt-4">
                                            <p className="text-xs text-gray-600 font-semibold">Warnings</p>
                                            <p className="text-2xl font-bold text-yellow-600 mt-2">{batch.warnings || 0}</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Processing Time */}
                                {batch.processing_time && (
                                    <div className="border-t pt-4">
                                        <p className="text-xs text-gray-600 font-semibold">Processing Time</p>
                                        <p className="text-lg mt-2">{batch.processing_time}</p>
                                    </div>
                                )}

                                {/* Status Timeline */}
                                {batch.started_at && (
                                    <div className="border-t pt-4">
                                        <p className="text-xs text-gray-600 font-semibold mb-3">Timeline</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm">Started: {batch.started_at}</span>
                                            </div>
                                            {batch.completed_at && (
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm">Completed: {batch.completed_at}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Imported By */}
                        <Card className="bg-gray-50">
                            <CardContent className="pt-6">
                                <p className="text-xs text-gray-600 font-semibold">Imported By</p>
                                <p className="text-sm mt-2">{batch.imported_by_name || 'HR Manager'}</p>
                                <p className="text-xs text-gray-500 mt-1">{batch.created_at}</p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="records" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Processed Records</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="font-semibold">Successfully Processed</span>
                                        <Badge variant="outline" className="bg-green-100 text-green-800">
                                            {batch.successful_records} records
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 px-3">
                                        These records have been imported and added to the system.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {errors.length > 0 && (
                        <TabsContent value="errors" className="space-y-4">
                            <div className="space-y-3">
                                {errors.slice(0, 20).map((error, index) => (
                                    <Card key={index} className="border-l-4 border-l-red-500">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-semibold text-sm">Row {error.row_number}</p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        Error: {error.error_type.replace('_', ' ')}
                                                    </p>
                                                </div>
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            </div>
                                        </CardHeader>
                                        {(error.employee_identifier || error.error_message) && (
                                            <CardContent className="pt-0 text-sm">
                                                {error.employee_identifier && (
                                                    <p className="text-xs">
                                                        Employee: <span className="font-mono">{error.employee_identifier}</span>
                                                    </p>
                                                )}
                                                {error.error_message && (
                                                    <p className="text-xs text-gray-600 mt-1">{error.error_message}</p>
                                                )}
                                            </CardContent>
                                        )}
                                    </Card>
                                ))}
                                {errors.length > 20 && (
                                    <p className="text-xs text-gray-500 text-center py-4">
                                        Showing 20 of {errors.length} errors
                                    </p>
                                )}
                            </div>
                        </TabsContent>
                    )}
                </Tabs>

                <DialogFooter className="gap-3">
                    {onRetry && batch.status === 'failed' && (
                        <Button onClick={() => onRetry(batch)} className="gap-2">
                            <Upload className="h-4 w-4" />
                            Retry Import
                        </Button>
                    )}
                    <Button variant="ghost" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
