import { Calendar, Edit3, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AttendanceSource } from '@/types/timekeeping-pages';

interface SourceIndicatorProps {
    source: AttendanceSource;
    deviceId?: string | null;
    className?: string;
    showLabel?: boolean;
}

/**
 * Reusable source indicator component
 * Shows the source of attendance record (RFID edge machine, manual entry, or imported)
 * with appropriate icon and styling
 */
export function SourceIndicator({ source, deviceId, className, showLabel = true }: SourceIndicatorProps) {
    const sourceConfig = {
        edge_machine: {
            icon: Calendar,
            label: 'Edge Machine',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            tooltip: `RFID Edge Device${deviceId ? `: ${deviceId}` : ''}`,
        },
        manual: {
            icon: Edit3,
            label: 'Manual Entry',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            tooltip: 'Manual attendance entry',
        },
        imported: {
            icon: Download,
            label: 'Imported',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            tooltip: 'Imported from file',
        },
    };

    const config = sourceConfig[source];
    const IconComponent = config.icon;

    return (
        <div
            className={cn('inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium', config.bg, className)}
            title={config.tooltip}
        >
            <IconComponent className={cn('w-4 h-4', config.color)} />
            {showLabel && <span className={config.color}>{config.label}</span>}
        </div>
    );
}
