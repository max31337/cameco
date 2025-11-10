import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DepartmentData {
    id: number;
    name: string;
    code: string;
    employee_count: number;
    percentage: number;
}

interface Props {
    data: DepartmentData[];
}

const COLORS = [
    '#3b82f6', // blue
    '#10b981', // emerald
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#14b8a6', // teal
    '#eab308', // lime
    '#6366f1', // indigo
];

export default function DepartmentBreakdownChart({ data }: Props) {
    // Format data for recharts
    const chartData = data.map((dept, index) => ({
        ...dept,
        displayName: dept.code ? `${dept.name} (${dept.code})` : dept.name,
        color: COLORS[index % COLORS.length],
    }));

    const handleBarClick = () => {
        // Navigate to departments page (can be enhanced to filter by department)
        window.location.href = `/hr/departments`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Employees by Department</CardTitle>
                <CardDescription>Distribution across all departments</CardDescription>
            </CardHeader>
            <CardContent>
                {chartData.length > 0 ? (
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="displayName"
                                    angle={-45}
                                    textAnchor="end"
                                    height={100}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis label={{ value: 'Employees', angle: -90, position: 'insideLeft' }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                    }}
                                    formatter={(value: number) => [`${value} employees`, 'Count']}
                                    labelFormatter={(label: string) => `Department: ${label}`}
                                />
                                <Bar
                                    dataKey="employee_count"
                                    fill="#3b82f6"
                                    onClick={handleBarClick}
                                    cursor="pointer"
                                    radius={[8, 8, 0, 0]}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-80 text-gray-500">
                        <p>No department data available</p>
                    </div>
                )}
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {chartData.map((dept) => (
                        <div key={dept.id} className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: dept.color }}
                            />
                            <div className="text-sm">
                                <p className="font-medium text-gray-900">{dept.name}</p>
                                <p className="text-xs text-gray-600">{dept.employee_count} employees</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
