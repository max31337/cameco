import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export interface EmployeeRemarkData {
    id?: number;
    remark: string;
    created_by?: number;
    created_at?: string;
    createdBy?: {
        id: number;
        name: string;
    };
}

interface RemarksectionProps {
    remarks: EmployeeRemarkData[];
    onChange: (remarks: EmployeeRemarkData[]) => void;
    isEditMode: boolean;
}

export function RemarksSection({ remarks, onChange, isEditMode }: RemarksectionProps) {
    const [newRemark, setNewRemark] = useState('');

    const handleAddRemark = () => {
        if (newRemark.trim()) {
            onChange([
                ...remarks,
                {
                    id: Date.now(),
                    remark: newRemark,
                    created_at: new Date().toISOString(),
                },
            ]);
            setNewRemark('');
        }
    };

    const handleRemoveRemark = (index: number) => {
        onChange(remarks.filter((_, i) => i !== index));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Remarks</CardTitle>
                <CardDescription>Employee performance notes and remarks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Existing Remarks */}
                {remarks.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold">Remark History</h3>
                        {remarks.map((remark, index) => (
                            <div key={remark.id || index} className="border rounded-lg p-4 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="text-sm">{remark.remark}</p>
                                    {isEditMode && (
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleRemoveRemark(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                                {remark.created_at && (
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(remark.created_at).toLocaleDateString()}
                                    </p>
                                )}
                                {remark.createdBy && (
                                    <p className="text-xs text-muted-foreground">By: {remark.createdBy.name}</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New Remark Form */}
                {isEditMode && (
                    <div className="border-t pt-6 space-y-4">
                        <h3 className="text-sm font-semibold">Add New Remark</h3>
                        <div>
                            <Label htmlFor="new-remark">Remark</Label>
                            <Textarea
                                id="new-remark"
                                value={newRemark}
                                onChange={(e) => setNewRemark(e.target.value)}
                                placeholder="Enter remark or note about the employee"
                                rows={3}
                            />
                        </div>
                        <Button type="button" onClick={handleAddRemark} className="w-full md:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Remark
                        </Button>
                    </div>
                )}

                {remarks.length === 0 && !isEditMode && (
                    <p className="text-sm text-muted-foreground text-center py-4">No remarks added yet</p>
                )}
            </CardContent>
        </Card>
    );
}
