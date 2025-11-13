import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { RotationPattern, RotationPatternType } from '@/types/workforce-pages';
import { RotationPatternPreview } from './rotation-pattern-preview';
import { Check, Grid3x3, Zap, Repeat2, Settings } from 'lucide-react';

interface RotationTemplate {
    pattern_type: RotationPatternType;
    name: string;
    description: string;
    pattern: RotationPattern;
    icon: React.ReactNode;
    color: string;
}

interface RotationTemplateSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTemplate: (template: RotationTemplate) => void;
    patternTemplates?: Array<{
        pattern_type: RotationPatternType;
        name: string;
        pattern: RotationPattern;
    }>;
}

const DEFAULT_TEMPLATES: RotationTemplate[] = [
    {
        pattern_type: '4x2',
        name: '4x2 - Four Days Work / Two Days Rest',
        description: 'Standard manufacturing rotation. Work 4 consecutive days, then 2 days off.',
        pattern: {
            work_days: 4,
            rest_days: 2,
            pattern: [1, 1, 1, 1, 0, 0],
            cycle_length: 6,
            description: '4 Days On / 2 Days Off',
        },
        icon: <Grid3x3 className="h-5 w-5" />,
        color: 'bg-blue-50 border-blue-200',
    },
    {
        pattern_type: '5x2',
        name: '5x2 - Five Days Work / Two Days Rest',
        description: 'Standard office schedule. Work 5 consecutive days (Mon-Fri), then 2 days off (Sat-Sun).',
        pattern: {
            work_days: 5,
            rest_days: 2,
            pattern: [1, 1, 1, 1, 1, 0, 0],
            cycle_length: 7,
            description: '5 Days On / 2 Days Off',
        },
        icon: <Repeat2 className="h-5 w-5" />,
        color: 'bg-green-50 border-green-200',
    },
    {
        pattern_type: '6x1',
        name: '6x1 - Six Days Work / One Day Rest',
        description: 'Intensive rotation for high-capacity operations. Work 6 consecutive days, then 1 day off.',
        pattern: {
            work_days: 6,
            rest_days: 1,
            pattern: [1, 1, 1, 1, 1, 1, 0],
            cycle_length: 7,
            description: '6 Days On / 1 Day Off',
        },
        icon: <Zap className="h-5 w-5" />,
        color: 'bg-orange-50 border-orange-200',
    },
    {
        pattern_type: 'custom',
        name: 'Custom Pattern',
        description: 'Create a custom rotation pattern using the pattern builder.',
        pattern: {
            work_days: 0,
            rest_days: 0,
            pattern: [],
            cycle_length: 0,
            description: 'Custom Pattern',
        },
        icon: <Settings className="h-5 w-5" />,
        color: 'bg-purple-50 border-purple-200',
    },
];

export function RotationTemplateSelector({
    isOpen,
    onClose,
    onSelectTemplate,
    patternTemplates = [],
}: RotationTemplateSelectorProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<RotationTemplate | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    // Use custom templates if provided, otherwise use defaults
    const templates = patternTemplates.length > 0
        ? patternTemplates.map((t) => {
            const template = DEFAULT_TEMPLATES.find((dt) => dt.pattern_type === t.pattern_type);
            return {
                pattern_type: t.pattern_type,
                name: t.name || template?.name || '',
                description: template?.description || '',
                pattern: t.pattern,
                icon: template?.icon || <Settings className="h-5 w-5" />,
                color: template?.color || 'bg-gray-50 border-gray-200',
            };
        })
        : DEFAULT_TEMPLATES;

    const handleSelectTemplate = (template: RotationTemplate) => {
        setSelectedTemplate(template);
        setShowPreview(true);
    };

    const handleConfirmSelection = () => {
        if (selectedTemplate) {
            onSelectTemplate(selectedTemplate);
            handleClose();
        }
    };

    const handleClose = () => {
        setSelectedTemplate(null);
        setShowPreview(false);
        onClose();
    };

    const getPatternStats = (pattern: RotationPattern) => {
        return {
            workDays: pattern.work_days || 0,
            restDays: pattern.rest_days || 0,
            cycleLength: pattern.cycle_length || pattern.pattern.length || 0,
        };
    };

    const isSelected = (template: RotationTemplate) => selectedTemplate?.pattern_type === template.pattern_type;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Select Rotation Pattern Template</DialogTitle>
                    <DialogDescription>
                        Choose from preset rotation patterns or create a custom one. You can preview each pattern
                        before selecting.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Template Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {templates.map((template) => {
                            const stats = getPatternStats(template.pattern);
                            const selected = isSelected(template);

                            return (
                                <Card
                                    key={template.pattern_type}
                                    className={`cursor-pointer transition-all ${
                                        selected
                                            ? 'ring-2 ring-blue-500 border-blue-500'
                                            : 'hover:border-gray-400 hover:shadow-md'
                                    } ${template.color}`}
                                    onClick={() => handleSelectTemplate(template)}
                                >
                                    <CardContent className="p-4 space-y-3">
                                        {/* Header with Icon and Selection Indicator */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-lg bg-white border">
                                                    {template.icon}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-sm">{template.name}</h3>
                                                    <Badge variant="outline" className="text-xs mt-1">
                                                        {template.pattern_type}
                                                    </Badge>
                                                </div>
                                            </div>
                                            {selected && (
                                                <div className="p-1 rounded-full bg-blue-500">
                                                    <Check className="h-4 w-4 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600">{template.description}</p>

                                        {/* Pattern Stats */}
                                        {template.pattern_type !== 'custom' && (
                                            <div className="flex gap-3 pt-2 border-t">
                                                <div className="flex-1 text-center">
                                                    <div className="text-xl font-bold text-gray-900">
                                                        {stats.workDays}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Work Days</div>
                                                </div>
                                                <div className="flex-1 text-center">
                                                    <div className="text-xl font-bold text-gray-900">
                                                        {stats.restDays}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Rest Days</div>
                                                </div>
                                                <div className="flex-1 text-center">
                                                    <div className="text-xl font-bold text-gray-900">
                                                        {stats.cycleLength}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Cycle Days</div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Pattern Visualization */}
                                        {template.pattern_type !== 'custom' && template.pattern.pattern.length > 0 && (
                                            <div className="flex gap-1 pt-2">
                                                {template.pattern.pattern.map((day, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`h-6 w-6 rounded text-xs flex items-center justify-center font-semibold text-white ${
                                                            day === 1 ? 'bg-blue-500' : 'bg-gray-300'
                                                        }`}
                                                    >
                                                        {day === 1 ? 'W' : 'R'}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Preview Section */}
                    {showPreview && selectedTemplate && selectedTemplate.pattern_type !== 'custom' && (
                        <Card className="border-2 border-blue-200 bg-blue-50">
                            <CardContent className="p-4">
                                <h3 className="font-semibold text-sm mb-3">Pattern Preview</h3>
                                <div className="bg-white rounded-lg p-3 border">
                                    <RotationPatternPreview
                                        pattern={selectedTemplate.pattern}
                                        patternName={selectedTemplate.name}
                                        startDate={new Date()}
                                        cyclesShown={2}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Custom Pattern Note */}
                    {showPreview && selectedTemplate?.pattern_type === 'custom' && (
                        <Card className="border-2 border-purple-200 bg-purple-50">
                            <CardContent className="p-4">
                                <p className="text-sm text-gray-700">
                                    <strong>Custom Pattern:</strong> You'll be able to create and define your own
                                    rotation pattern using the visual pattern builder after selecting this option.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmSelection} disabled={!selectedTemplate}>
                        Select Template
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
