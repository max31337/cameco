import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Clock, Calendar, Check } from 'lucide-react';
import { ScheduleTemplate } from '@/types/workforce-pages';

interface ScheduleTemplateSelectorProps {
    templates: ScheduleTemplate[];
    onSelect: (template: ScheduleTemplate) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function ScheduleTemplateSelector({
    templates,
    onSelect,
    isOpen,
    onClose,
}: ScheduleTemplateSelectorProps) {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleSelect = (template: ScheduleTemplate) => {
        setSelectedId(template.id);
        onSelect(template);
        setTimeout(() => {
            onClose();
            setSelectedId(null);
        }, 300);
    };

    const getShiftTypeLabel = (shiftType: string): string => {
        const labels: Record<string, string> = {
            morning: 'Morning Shift',
            afternoon: 'Afternoon Shift',
            night: 'Night Shift',
            graveyard: 'Graveyard Shift',
            custom: 'Custom Shift',
        };
        return labels[shiftType] || shiftType;
    };

    const calculateShiftDuration = (startTime: string, endTime: string): string => {
        if (!startTime || !endTime) return 'N/A';
        try {
            const start = new Date(`2024-01-01 ${startTime}`);
            const end = new Date(`2024-01-01 ${endTime}`);
            let diffMs = end.getTime() - start.getTime();

            // Handle overnight shifts
            if (diffMs < 0) {
                diffMs += 24 * 60 * 60 * 1000;
            }

            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            if (minutes === 0) {
                return `${hours}h`;
            }
            return `${hours}h ${minutes}m`;
        } catch {
            return 'N/A';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Select a Schedule Template</DialogTitle>
                    <DialogDescription>
                        Choose a pre-configured template to quickly set up your schedule with standard shift patterns.
                    </DialogDescription>
                </DialogHeader>

                {templates.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">No templates available</h3>
                        <p className="text-gray-600 mt-2">Create schedules as templates to reuse them later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((template) => (
                            <Card
                                key={template.id}
                                className={`cursor-pointer transition-all hover:shadow-lg ${
                                    selectedId === template.id ? 'border-blue-500 border-2' : ''
                                }`}
                                onClick={() => handleSelect(template)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base font-semibold truncate">
                                                {template.name}
                                            </CardTitle>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {getShiftTypeLabel(template.shift_type)}
                                            </p>
                                        </div>
                                        {selectedId === template.id && (
                                            <Check className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Template Details */}
                                    <div className="space-y-3 text-sm">
                                        {/* Shift Times */}
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-700">
                                                    <span className="font-medium">{template.shift_start}</span>
                                                    {' - '}
                                                    <span className="font-medium">{template.shift_end}</span>
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {calculateShiftDuration(template.shift_start, template.shift_end)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Work Days */}
                                        {template.work_days && template.work_days.length > 0 && (
                                            <div className="flex items-start gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-gray-700">
                                                        {template.work_days.join(', ')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Usage Count */}
                                        {template.usage_count !== undefined && (
                                            <div className="text-xs text-gray-500 pt-2 border-t">
                                                Used <strong>{template.usage_count}</strong> time{template.usage_count !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        <Badge variant={template.is_active ? 'default' : 'secondary'}>
                                            {template.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                        {template.description && (
                                            <p className="text-xs text-gray-600 flex-1 line-clamp-1">
                                                {template.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <Button
                                        className="w-full gap-2 mt-2"
                                        variant={selectedId === template.id ? 'default' : 'outline'}
                                    >
                                        <Copy className="h-4 w-4" />
                                        {selectedId === template.id ? 'Selected' : 'Use Template'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
