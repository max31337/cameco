import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotationPattern, RotationPatternType } from '@/types/workforce-pages';
import { Check, X, RotateCcw } from 'lucide-react';

interface RotationPatternBuilderProps {
    pattern: RotationPattern;
    patternType: RotationPatternType;
    onPatternChange: (pattern: RotationPattern) => void;
    onPatternTypeChange?: (type: RotationPatternType) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const PRESET_PATTERNS = {
    '4x2': { work_days: 4, rest_days: 2, pattern: [1, 1, 1, 1, 0, 0] },
    '5x2': { work_days: 5, rest_days: 2, pattern: [1, 1, 1, 1, 1, 0, 0] },
    '6x1': { work_days: 6, rest_days: 1, pattern: [1, 1, 1, 1, 1, 1, 0] },
    '3x2x2': { work_days: 5, rest_days: 4, pattern: [1, 1, 1, 0, 0, 1, 1, 0, 0] },
};

export function RotationPatternBuilder({
    pattern,
    patternType,
    onPatternChange,
    onPatternTypeChange,
}: RotationPatternBuilderProps) {
    const [displayPattern, setDisplayPattern] = useState<number[]>(pattern.pattern || []);
    const [expandPattern, setExpandPattern] = useState(false);
    const [jsonInput, setJsonInput] = useState('');
    const [editMode, setEditMode] = useState<'visual' | 'json'>('visual');

    useEffect(() => {
        setDisplayPattern(pattern.pattern);
    }, [pattern]);

    const toggleDay = (index: number) => {
        const newPattern = [...displayPattern];
        newPattern[index] = newPattern[index] === 1 ? 0 : 1;
        setDisplayPattern(newPattern);
        updatePattern(newPattern);
    };

    const updatePattern = (newPattern: number[]) => {
        const workDays = newPattern.filter((d) => d === 1).length;
        const restDays = newPattern.filter((d) => d === 0).length;

        onPatternChange({
            work_days: workDays,
            rest_days: restDays,
            pattern: newPattern,
            cycle_length: newPattern.length,
            description: pattern.description,
        });
    };

    const addDay = () => {
        const newPattern = [...displayPattern, 0];
        setDisplayPattern(newPattern);
        updatePattern(newPattern);
    };

    const removeDay = () => {
        if (displayPattern.length > 1) {
            const newPattern = displayPattern.slice(0, -1);
            setDisplayPattern(newPattern);
            updatePattern(newPattern);
        }
    };

    const handleReset = () => {
        if (patternType && patternType in PRESET_PATTERNS) {
            const preset = PRESET_PATTERNS[patternType as keyof typeof PRESET_PATTERNS];
            setDisplayPattern(preset.pattern);
            updatePattern(preset.pattern);
        }
    };

    const handleFillAll = () => {
        const allWork = displayPattern.map(() => 1);
        setDisplayPattern(allWork);
        updatePattern(allWork);
    };

    const handleClearAll = () => {
        const allRest = displayPattern.map(() => 0);
        setDisplayPattern(allRest);
        updatePattern(allRest);
    };

    const handleJsonImport = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            if (Array.isArray(parsed.pattern) && parsed.pattern.every((v: number) => v === 0 || v === 1)) {
                setDisplayPattern(parsed.pattern);
                updatePattern(parsed.pattern);
                setEditMode('visual');
                setJsonInput('');
            } else {
                alert('Invalid pattern format. Pattern must be an array of 0s and 1s.');
            }
        } catch {
            alert('Invalid JSON format');
        }
    };

    const patternStats = {
        workDays: displayPattern.filter((d) => d === 1).length,
        restDays: displayPattern.filter((d) => d === 0).length,
        cycleLength: displayPattern.length,
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Pattern Builder</CardTitle>
                    <div className="flex gap-2">
                        {editMode === 'visual' && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEditMode('json')}
                            >
                                JSON
                            </Button>
                        )}
                        {editMode === 'json' && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEditMode('visual')}
                            >
                                Visual
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Pattern Statistics */}
                <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-blue-50 rounded text-center">
                        <p className="text-xs text-gray-600">Work Days</p>
                        <p className="text-xl font-bold text-blue-600">{patternStats.workDays}</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded text-center">
                        <p className="text-xs text-gray-600">Rest Days</p>
                        <p className="text-xl font-bold text-gray-600">{patternStats.restDays}</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded text-center">
                        <p className="text-xs text-gray-600">Cycle</p>
                        <p className="text-xl font-bold text-purple-600">{patternStats.cycleLength}d</p>
                    </div>
                </div>

                {/* Visual Pattern Editor */}
                {editMode === 'visual' && (
                    <div className="space-y-4">
                        {/* Preset Quick Select */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-600">Quick Presets:</p>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(PRESET_PATTERNS).map(([key, value]) => (
                                    <Button
                                        key={key}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setDisplayPattern(value.pattern);
                                            updatePattern(value.pattern);
                                            if (onPatternTypeChange) {
                                                onPatternTypeChange(key as RotationPatternType);
                                            }
                                        }}
                                    >
                                        {key === '3x2x2' ? '3-2-2' : key.toUpperCase()}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Days Grid */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-600">Pattern ({DAYS.length} days):</p>
                            <div className="grid grid-cols-7 gap-1">
                                {DAYS.map((day, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => toggleDay(index)}
                                        className={`p-2 rounded font-medium text-xs transition-colors flex flex-col items-center justify-center gap-1 min-h-12 ${
                                            displayPattern[index] === 1
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-gray-200 text-gray-700'
                                        }`}
                                        title={displayPattern[index] === 1 ? 'Work Day' : 'Rest Day'}
                                    >
                                        <span>{day}</span>
                                        <span className="text-xs">
                                            {displayPattern[index] === 1 ? (
                                                <Check className="h-3 w-3" />
                                            ) : (
                                                <X className="h-3 w-3" />
                                            )}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Extended Pattern */}
                        {displayPattern.length > 7 && (
                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => setExpandPattern(!expandPattern)}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    {expandPattern ? 'Hide extended pattern' : 'Show extended pattern'}
                                </button>

                                {expandPattern && (
                                    <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))' }}>
                                        {displayPattern.map((day, index) => {
                                            if (index < 7) return null;
                                            return (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => toggleDay(index)}
                                                    className={`p-1 rounded text-xs font-medium transition-colors ${
                                                        day === 1
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-200 text-gray-700'
                                                    }`}
                                                    title={`Day ${index + 1}`}
                                                >
                                                    {index + 1}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pattern Controls */}
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                className="gap-2"
                            >
                                <RotateCcw className="h-3 w-3" />
                                Reset
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleFillAll}
                            >
                                Fill All Work
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleClearAll}
                            >
                                Clear All
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addDay}
                            >
                                + Day
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={removeDay}
                                disabled={displayPattern.length <= 1}
                            >
                                - Day
                            </Button>
                        </div>
                    </div>
                )}

                {/* JSON Editor */}
                {editMode === 'json' && (
                    <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-600">Import JSON Pattern:</p>
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder={JSON.stringify(
                                {
                                    pattern: [1, 1, 1, 1, 0, 0],
                                    work_days: 4,
                                    rest_days: 2,
                                },
                                null,
                                2
                            )}
                            className="w-full p-2 border rounded text-xs font-mono text-gray-700 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={6}
                        />
                        <Button
                            type="button"
                            onClick={handleJsonImport}
                            className="w-full"
                        >
                            Import Pattern
                        </Button>
                    </div>
                )}

                {/* JSON Preview */}
                <div className="p-3 bg-gray-50 rounded text-xs font-mono text-gray-600 overflow-x-auto border border-gray-200">
                    <pre>
                        {JSON.stringify(
                            {
                                pattern: displayPattern,
                                work_days: patternStats.workDays,
                                rest_days: patternStats.restDays,
                                cycle_length: patternStats.cycleLength,
                            },
                            null,
                            2
                        )}
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}
