import { cn } from '@/lib/utils';
import { AttendanceStatus } from '@/types/timekeeping-pages';

interface AttendanceStatusBadgeProps {
    status: AttendanceStatus;
    className?: string;
}

/**
 * Reusable attendance status badge component
 * Displays status with color coding based on attendance state
 */
export function AttendanceStatusBadge({ status, className }: AttendanceStatusBadgeProps) {
    const statusStyles = {
        present: 'bg-green-100 text-green-700',
        late: 'bg-yellow-100 text-yellow-700',
        absent: 'bg-red-100 text-red-700',
        on_leave: 'bg-blue-100 text-blue-700',
        undertime: 'bg-orange-100 text-orange-700',
        overtime: 'bg-purple-100 text-purple-700',
    };

    const statusLabels = {
        present: 'Present',
        late: 'Late',
        absent: 'Absent',
        on_leave: 'On Leave',
        undertime: 'Undertime',
        overtime: 'Overtime',
    };

    return (
        <span className={cn(
            'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
            statusStyles[status],
            className
        )}>
            {statusLabels[status]}
        </span>
    );
}
