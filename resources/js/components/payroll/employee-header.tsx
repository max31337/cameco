import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { router } from '@inertiajs/react';

interface EmployeeHeaderProps {
    employeeName: string;
    description?: string;
    backHref?: string;
}

export function EmployeeHeader({
    employeeName,
    description = '',
    backHref = '/payroll/adjustments',
}: EmployeeHeaderProps) {
    return (
        <div className="space-y-4">
            <Button
                variant="ghost"
                onClick={() => router.visit(backHref)}
                className="mb-2"
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
            </Button>

            <div>
                <h1 className="text-3xl font-bold tracking-tight">{employeeName}</h1>
                {description && (
                    <p className="text-muted-foreground mt-1">{description}</p>
                )}
            </div>
        </div>
    );
}
