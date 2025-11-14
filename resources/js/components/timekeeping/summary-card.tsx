import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
    title: string;
    value: string | number;
    description?: string;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    className?: string;
}

/**
 * Reusable summary metric card component
 * Displays a single metric with title, value, and optional description
 * Used for all summary statistics throughout timekeeping module
 */
export function SummaryCard({ 
    title, 
    value, 
    description,
    variant = 'default',
    className
}: SummaryCardProps) {
    return (
        <Card className={className}>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground">{description}</p>
                )}
            </CardContent>
        </Card>
    );
}
