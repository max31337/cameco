import { Card, CardContent } from '@/components/ui/card';

interface EmployeeSummaryCardsProps {
    employeeNumber: string;
    position: string;
    department: string;
}

export function EmployeeSummaryCards({
    employeeNumber,
    position,
    department,
}: EmployeeSummaryCardsProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Employee Number
                        </p>
                        <p className="text-lg font-semibold mt-1">{employeeNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Position
                        </p>
                        <p className="text-lg font-semibold mt-1">{position}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Department
                        </p>
                        <p className="text-lg font-semibold mt-1">{department}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
