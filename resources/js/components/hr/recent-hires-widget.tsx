import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

interface RecentHire {
    id: number;
    name: string;
    position: string;
    department: string;
    date_hired: string;
    date_hired_formatted?: string;
    photo_url?: string;
    employment_type?: string;
}

interface RecentHiresWidgetProps {
    recent_hires: RecentHire[];
}

export function RecentHiresWidget({ recent_hires }: RecentHiresWidgetProps) {
    const formatDate = (date: string) => {
        try {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return date;
        }
    };

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Recent Hires</CardTitle>
                        <CardDescription>Latest employees added to the system</CardDescription>
                    </div>
                    <Link href="/hr/employees">
                        <Button variant="outline" size="sm">
                            View All
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                {recent_hires && recent_hires.length > 0 ? (
                    <div className="space-y-4">
                        {recent_hires.map((hire) => (
                            <div
                                key={hire.id}
                                className="flex items-start justify-between border-b pb-4 last:border-0"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-medium text-sm">{hire.name}</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <Badge variant="default" className="text-xs">
                                            {hire.position}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                            {hire.department}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-gray-600">
                                        <span>Hired: {hire.date_hired_formatted || formatDate(hire.date_hired)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-sm text-gray-500">No recent hires</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default RecentHiresWidget;
