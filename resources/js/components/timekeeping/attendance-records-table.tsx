import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AttendanceStatusBadge } from './attendance-status-badge';
import { SourceIndicator } from './source-indicator';
import { AttendanceRecord } from '@/types/timekeeping-pages';

interface AttendanceRecordsTableProps {
    records: AttendanceRecord[];
    title?: string;
    description?: string;
    onViewRecord?: (record: AttendanceRecord) => void;
    onEditRecord?: (record: AttendanceRecord) => void;
    pageSize?: number;
}

/**
 * Reusable attendance records table component
 * Displays attendance records with status badges, source indicators, and quick actions
 */
export function AttendanceRecordsTable({
    records,
    title = 'Attendance Records',
    description = 'List of attendance records from RFID and manual entries',
    onViewRecord,
    onEditRecord,
    pageSize = 10,
}: AttendanceRecordsTableProps) {
    const displayRecords = records.slice(0, pageSize);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3 px-4 font-semibold">Employee</th>
                                <th className="text-left py-3 px-4 font-semibold">Date</th>
                                <th className="text-left py-3 px-4 font-semibold">Time In</th>
                                <th className="text-left py-3 px-4 font-semibold">Time Out</th>
                                <th className="text-left py-3 px-4 font-semibold">Status</th>
                                <th className="text-left py-3 px-4 font-semibold">Source</th>
                                <th className="text-right py-3 px-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayRecords.map((record) => (
                                <tr key={record.id} className="border-b hover:bg-muted/50 transition-colors">
                                    <td className="py-3 px-4">
                                        <div className="font-medium">{record.employee_name}</div>
                                        <div className="text-xs text-muted-foreground">{record.employee_number}</div>
                                    </td>
                                    <td className="py-3 px-4 text-sm">{record.date}</td>
                                    <td className="py-3 px-4 text-sm font-medium">{record.time_in}</td>
                                    <td className="py-3 px-4 text-sm">{record.time_out || '-'}</td>
                                    <td className="py-3 px-4">
                                        <AttendanceStatusBadge status={record.status} />
                                    </td>
                                    <td className="py-3 px-4">
                                        <SourceIndicator 
                                            source={record.source}
                                            deviceId={record.device_id}
                                            showLabel={false}
                                        />
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {onViewRecord && (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={() => onViewRecord(record)}
                                                >
                                                    View
                                                </Button>
                                            )}
                                            {onEditRecord && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => onEditRecord(record)}
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {displayRecords.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No attendance records found
                    </div>
                )}
                {records.length > pageSize && (
                    <div className="mt-4 text-sm text-muted-foreground">
                        Showing {displayRecords.length} of {records.length} records
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
