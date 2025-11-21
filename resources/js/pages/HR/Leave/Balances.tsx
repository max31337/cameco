import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar, TrendingUp, TrendingDown, Search, X } from 'lucide-react';

interface BalanceItem {
    type: string;
    name: string;
    earned: number;
    used: number;
    remaining: number;
    carried_forward: number;
}

interface EmployeeBalance {
    id: number;
    employee_number: string;
    name: string;
    department: string;
    balances: BalanceItem[];
}

interface LeaveBalancesPageProps {
    balances: EmployeeBalance[];
    employees?: unknown[];
    selectedYear?: number;
    selectedEmployeeId?: number;
    years?: number[];
    summary?: {
        total_employees: number;
        total_earned: number;
        total_used: number;
        total_remaining: number;
    };
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'HR', href: '/hr/dashboard' },
    { title: 'Leave Management', href: '#' },
    { title: 'Balances', href: '/hr/leave/balances' },
];

function getLeaveTypeColor(type: string): string {
    const colorMap: Record<string, string> = {
        'Vacation Leave': 'bg-blue-100 text-blue-800',
        'Sick Leave': 'bg-red-100 text-red-800',
        'Emergency Leave': 'bg-yellow-100 text-yellow-800',
        'Maternity Leave': 'bg-pink-100 text-pink-800',
        'Paternity Leave': 'bg-pink-100 text-pink-800',
        'Privilege Leave': 'bg-green-100 text-green-800',
        'Bereavement Leave': 'bg-purple-100 text-purple-800',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
}
export default function LeaveBalances({ balances, summary }: LeaveBalancesPageProps) {
    const employeeBalances = Array.isArray(balances) ? balances : [];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedLeaveType, setSelectedLeaveType] = useState('all');

    // Flatten balances for filtering
    const flatBalances = employeeBalances.flatMap((emp) =>
        emp.balances.map((bal) => ({
            ...bal,
            employee_id: emp.id,
            employee_number: emp.employee_number,
            employee_name: emp.name,
            department: emp.department,
            leave_type: bal.name,
        }))
    );

    const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());
    const leaveTypes = ['all', ...Array.from(new Set(flatBalances.map((b) => b.leave_type)))];

    const filteredBalances = flatBalances.filter((balance) => {
        const matchesSearch =
            searchTerm === '' ||
            balance.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            balance.employee_number?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLeaveType = selectedLeaveType === 'all' || balance.leave_type === selectedLeaveType;

        return matchesSearch && matchesLeaveType;
    });

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedYear(new Date().getFullYear().toString());
        setSelectedLeaveType('all');
    };

    const totalEarned = summary?.total_earned || filteredBalances.reduce((sum, b) => sum + (b.earned || 0), 0);
    const totalUsed = summary?.total_used || filteredBalances.reduce((sum, b) => sum + (b.used || 0), 0);
    const totalRemaining = summary?.total_remaining || filteredBalances.reduce((sum, b) => sum + (b.remaining || 0), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Leave Balances" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* Header */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold tracking-tight">Leave Balances</h1>
                    </div>
                    <p className="text-muted-foreground">
                        View employee leave balance across all leave types
                    </p>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Filters</CardTitle>
                        <CardDescription>Filter leave balances by employee, year, or leave type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                            {/* Search */}
                            <div className="space-y-2">
                                <Label htmlFor="search">Search Employee</Label>
                                <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Name or number..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-8"
                                    />
                                </div>
                            </div>

                            {/* Year Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="year">Year</Label>
                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger id="year">
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Leave Type Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="leave_type">Leave Type</Label>
                                <Select value={selectedLeaveType} onValueChange={setSelectedLeaveType}>
                                    <SelectTrigger id="leave_type">
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {leaveTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type === 'all' ? 'All Types' : type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex items-end">
                                <Button variant="outline" onClick={handleClearFilters} className="w-full">
                                    <X className="h-4 w-4 mr-2" />
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                            Showing {filteredBalances.length} of {flatBalances.length} balances
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                <span>Total Earned</span>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalEarned.toFixed(1)} days</div>
                            <p className="text-xs text-muted-foreground mt-1">Across all leave types</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                <span>Total Used</span>
                                <TrendingDown className="h-4 w-4 text-blue-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalUsed.toFixed(1)} days</div>
                            <p className="text-xs text-muted-foreground mt-1">Already consumed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                <span>Total Remaining</span>
                                <Calendar className="h-4 w-4 text-amber-600" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{totalRemaining.toFixed(1)} days</div>
                            <p className="text-xs text-muted-foreground mt-1">Available to use</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Leave Balances Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Leave Balance Details</CardTitle>
                        <CardDescription>
                            Detailed breakdown of leave balances by type and employee
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredBalances && filteredBalances.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-semibold">Employee</th>
                                            <th className="text-left py-3 px-4 font-semibold">Leave Type</th>
                                            <th className="text-right py-3 px-4 font-semibold">Earned</th>
                                            <th className="text-right py-3 px-4 font-semibold">Used</th>
                                            <th className="text-right py-3 px-4 font-semibold">Remaining</th>
                                            <th className="text-right py-3 px-4 font-semibold">Carried Forward</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredBalances.map((balance, index) => (
                                            <tr key={`${balance.employee_id}-${balance.type}-${index}`} className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4 font-medium">{balance.employee_name || 'N/A'}</td>
                                                <td className="py-3 px-4">
                                                    <Badge className={getLeaveTypeColor(balance.leave_type || '')}>
                                                        {balance.leave_type || 'N/A'}
                                                    </Badge>
                                                </td>
                                                <td className="text-right py-3 px-4">{balance.earned?.toFixed(1) || '0.0'}</td>
                                                <td className="text-right py-3 px-4 text-red-600">{balance.used?.toFixed(1) || '0.0'}</td>
                                                <td className="text-right py-3 px-4 font-semibold text-green-600">{balance.remaining?.toFixed(1) || '0.0'}</td>
                                                <td className="text-right py-3 px-4">{balance.carried_forward?.toFixed(1) || '0.0'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No leave balance data found</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Leave balances will appear here once they are configured
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
