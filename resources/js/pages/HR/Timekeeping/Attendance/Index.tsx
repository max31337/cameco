import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { AttendanceRecordsTable } from '@/components/timekeeping/attendance-records-table';
import { AttendanceRecord } from '@/types/timekeeping-pages';

interface AttendanceIndexProps {
    attendance: AttendanceRecord[];
    summary: {
        total_records: number;
        present_count: number;
        present_rate: number;
        late_count: number;
        absent_count: number;
    };
}

export default function AttendanceIndex() {
    const { attendance = [], summary = { total_records: 0, present_count: 0, present_rate: 0, late_count: 0, absent_count: 0 } } = usePage().props as unknown as AttendanceIndexProps;

    const breadcrumbs = [
        { title: 'HR', href: '/hr' },
        { title: 'Timekeeping', href: '/hr/timekeeping' },
        { title: 'Attendance', href: '/hr/timekeeping/attendance' },
    ];

    const handleViewRecord = (record: AttendanceRecord) => {
        // Navigate to detail page
        console.log('View record:', record.id);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Attendance Records" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold">Attendance Records</h1>
                        <p className="text-gray-600">Track and manage attendance records</p>
                        
                    </div>
                    <div>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add Manual Entry
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{summary.total_records}</div>
                            <p className="text-xs text-gray-500">today</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Present</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{summary.present_count}</div>
                            <p className="text-xs text-gray-500">{summary.present_rate}%</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Late</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{summary.late_count}</div>
                            <p className="text-xs text-gray-500">arrivals</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Absent</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{summary.absent_count}</div>
                            <p className="text-xs text-gray-500">employees</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Attendance Records Table */}
                <AttendanceRecordsTable
                    records={attendance}
                    onViewRecord={handleViewRecord}
                />
            </div>
        </AppLayout>
    );
}
