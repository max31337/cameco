import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState } from 'react';

export interface EmployeeDependentData {
    id?: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    date_of_birth: string;
    relationship: string;
    remarks?: string | null;
}

interface DependentsSectionProps {
    dependents: EmployeeDependentData[];
    onChange: (dependents: EmployeeDependentData[]) => void;
    isEditMode: boolean;
}

export function DependentsSection({ dependents, onChange, isEditMode }: DependentsSectionProps) {
    const [newDependent, setNewDependent] = useState<EmployeeDependentData>({
        first_name: '',
        middle_name: '',
        last_name: '',
        date_of_birth: '',
        relationship: '',
        remarks: '',
    });

    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const handleAddDependent = () => {
        if (newDependent.first_name && newDependent.last_name && newDependent.date_of_birth && newDependent.relationship) {
            if (editingIndex !== null) {
                // Update existing dependent
                const updatedDependents = [...dependents];
                updatedDependents[editingIndex] = { ...newDependent, id: dependents[editingIndex].id };
                onChange(updatedDependents);
                setEditingIndex(null);
            } else {
                // Add new dependent
                onChange([...dependents, { ...newDependent, id: Date.now() }]);
            }
            setNewDependent({
                first_name: '',
                middle_name: '',
                last_name: '',
                date_of_birth: '',
                relationship: '',
                remarks: '',
            });
        }
    };

    const handleEditDependent = (index: number) => {
        setEditingIndex(index);
        setNewDependent(dependents[index]);
    };

    const handleRemoveDependent = (index: number) => {
        onChange(dependents.filter((_, i) => i !== index));
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setNewDependent({
            first_name: '',
            middle_name: '',
            last_name: '',
            date_of_birth: '',
            relationship: '',
            remarks: '',
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Dependents</CardTitle>
                <CardDescription>Manage employee's dependents or their children information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Existing Dependents */}
                {dependents.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold">Listed Dependents</h3>
                        {dependents.map((dependent, index) => (
                            <div key={dependent.id || index} className="border rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label className="text-xs">First Name</Label>
                                                <p className="text-sm font-medium">{dependent.first_name}</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Middle Name</Label>
                                                <p className="text-sm font-medium">{dependent.middle_name || '-'}</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Last Name</Label>
                                                <p className="text-sm font-medium">{dependent.last_name}</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Date of Birth</Label>
                                                <p className="text-sm font-medium">{dependent.date_of_birth}</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs">Relationship</Label>
                                                <p className="text-sm font-medium">{dependent.relationship}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {isEditMode && (
                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleEditDependent(index)}
                                                title="Edit dependent"
                                                className="h-9 px-3 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600 hover:text-blue-700"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleRemoveDependent(index)}
                                                title="Delete dependent"
                                                className="h-9 px-3 bg-red-50 hover:bg-red-100 border-red-200 text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                {dependent.remarks && (
                                    <div className="border-t pt-3">
                                        <Label className="text-xs">Remarks</Label>
                                        <p className="text-sm text-muted-foreground">{dependent.remarks}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Add New Dependent Form */}
                {isEditMode && (
                    <div className="border-t pt-6 space-y-4">
                        <h3 className="text-sm font-semibold">
                            {editingIndex !== null ? 'Edit Dependent' : 'Add New Dependent'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="dependent-first-name">First Name</Label>
                                <Input
                                    id="dependent-first-name"
                                    value={newDependent.first_name}
                                    onChange={(e) => setNewDependent({ ...newDependent, first_name: e.target.value })}
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="dependent-middle-name">Middle Name</Label>
                                <Input
                                    id="dependent-middle-name"
                                    value={newDependent.middle_name || ''}
                                    onChange={(e) => setNewDependent({ ...newDependent, middle_name: e.target.value })}
                                    placeholder="Enter middle name (optional)"
                                />
                            </div>
                            <div>
                                <Label htmlFor="dependent-last-name">Last Name</Label>
                                <Input
                                    id="dependent-last-name"
                                    value={newDependent.last_name}
                                    onChange={(e) => setNewDependent({ ...newDependent, last_name: e.target.value })}
                                    placeholder="Enter last name"
                                />
                            </div>
                            <div>
                                <Label htmlFor="dependent-dob">Date of Birth</Label>
                                <Input
                                    id="dependent-dob"
                                    type="date"
                                    value={newDependent.date_of_birth}
                                    onChange={(e) => setNewDependent({ ...newDependent, date_of_birth: e.target.value })}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="dependent-relationship">Relationship</Label>
                                <Select value={newDependent.relationship} onValueChange={(value) => setNewDependent({ ...newDependent, relationship: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select relationship" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="son">Son</SelectItem>
                                        <SelectItem value="daughter">Daughter</SelectItem>
                                        <SelectItem value="stepson">Stepson</SelectItem>
                                        <SelectItem value="stepdaughter">Stepdaughter</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="dependent-remarks">Remarks (Optional)</Label>
                                <Textarea
                                    id="dependent-remarks"
                                    value={newDependent.remarks || ''}
                                    onChange={(e) => setNewDependent({ ...newDependent, remarks: e.target.value })}
                                    placeholder="Enter any remarks about this dependent"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" onClick={handleAddDependent} className="w-full md:w-auto">
                                <Plus className="h-4 w-4 mr-2" />
                                {editingIndex !== null ? 'Update Dependent' : 'Add Dependent'}
                            </Button>
                            {editingIndex !== null && (
                                <Button type="button" onClick={handleCancelEdit} variant="outline" className="w-full md:w-auto">
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
