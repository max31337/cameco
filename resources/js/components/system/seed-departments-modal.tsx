import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Loader2, TreePine, Plus, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';

interface SeedDepartmentsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ModalStep = 'preview' | 'confirming' | 'success';

interface DepartmentTemplate {
    name: string;
    code: string;
    level: number;
    description?: string;
}

const DEFAULT_DEPARTMENTS: DepartmentTemplate[] = [
    { name: 'Executive Management', code: 'EXEC', level: 0, description: 'CEO, COO, CFO' },
    { name: 'Human Resources', code: 'HR', level: 0, description: 'Core HR department' },
    { name: 'HR Operations', code: 'HR-OPS', level: 1, description: 'HR day-to-day operations' },
    { name: 'Recruitment & Talent', code: 'HR-REC', level: 1, description: 'Hiring and talent management' },
    { name: 'Finance & Accounting', code: 'FIN', level: 0, description: 'Finance operations' },
    { name: 'Accounts Payable', code: 'FIN-AP', level: 1, description: 'AP management' },
    { name: 'Accounts Receivable', code: 'FIN-AR', level: 1, description: 'AR management' },
    { name: 'Payroll', code: 'FIN-PAY', level: 1, description: 'Payroll processing' },
    { name: 'Operations', code: 'OPS', level: 0, description: 'Operations management' },
    { name: 'Sales & Marketing', code: 'SALES', level: 0, description: 'Sales and marketing' },
    { name: 'IT & Technology', code: 'IT', level: 0, description: 'IT and technology' },
    { name: 'Administration', code: 'ADMIN', level: 0, description: 'Administrative services' },
];

export function SeedDepartmentsModal({ isOpen, onClose }: SeedDepartmentsModalProps) {
    const [step, setStep] = useState<ModalStep>('preview');
    const [seedPositions, setSeedPositions] = useState(false);
    const [departments, setDepartments] = useState<DepartmentTemplate[]>(DEFAULT_DEPARTMENTS);
    const [newDeptName, setNewDeptName] = useState('');
    const [newDeptCode, setNewDeptCode] = useState('');
    const [newDeptLevel, setNewDeptLevel] = useState<0 | 1>(0);
    const [newDeptDescription, setNewDeptDescription] = useState('');

    const handleAddDepartment = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!newDeptName.trim() || !newDeptCode.trim()) return;

        const newDept: DepartmentTemplate = {
            name: newDeptName,
            code: newDeptCode.toUpperCase(),
            level: newDeptLevel,
            description: newDeptDescription,
        };

        setDepartments([...departments, newDept]);
        setNewDeptName('');
        setNewDeptCode('');
        setNewDeptLevel(0);
        setNewDeptDescription('');
    };

    const handleRemoveDepartment = (index: number) => {
        setDepartments(departments.filter((_, i) => i !== index));
    };

    const handleConfirm = (e: FormEvent) => {
        e.preventDefault();
        setStep('confirming');

        // Use Inertia router which automatically handles CSRF
        router.post('/system/organization/departments/seed', {
            seed_positions: seedPositions ? '1' : '0',
            departments: JSON.stringify(departments),
        }, {
            onSuccess: () => {
                setStep('success');
                setTimeout(() => {
                    onClose();
                    setStep('preview');
                    setSeedPositions(false);
                    setDepartments(DEFAULT_DEPARTMENTS);
                    window.location.reload();
                }, 2000);
            },
            onError: (errors) => {
                setStep('preview');
                const errorMessage = Object.values(errors).flat().join(', ');
                alert('Failed to seed departments: ' + errorMessage);
            },
        });
    };

    const getDepartmentsByLevel = (level: number) => departments.filter(d => d.level === level);

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Seed Default Departments</DialogTitle>
                    <DialogDescription>
                        {step === 'preview' && 'Review and create default Philippine company department structure'}
                        {step === 'confirming' && 'Creating departments...'}
                        {step === 'success' && 'Departments created successfully!'}
                    </DialogDescription>
                </DialogHeader>

                {step === 'preview' && (
                    <form onSubmit={handleConfirm} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <TreePine className="size-5 text-primary" />
                                    Department Structure Preview
                                </h3>
                                <div className="bg-muted p-4 rounded-lg space-y-6">
                                    {/* Top-level departments */}
                                    {getDepartmentsByLevel(0).map((dept, idx) => (
                                        <div key={idx} className="space-y-2 pb-4 border-b last:border-b-0 last:pb-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-base">
                                                        ▸ {dept.name} <span className="text-xs font-mono text-muted-foreground">({dept.code})</span>
                                                    </div>
                                                    {dept.description && (
                                                        <div className="text-sm text-muted-foreground ml-4">{dept.description}</div>
                                                    )}
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveDepartment(departments.indexOf(dept))}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950"
                                                >
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </div>

                                            {/* Sub-departments */}
                                            <div className="ml-6 space-y-2">
                                                {departments
                                                    .filter(d => d.level === 1)
                                                    .map((subdept, subIdx) => {
                                                        // Map sub-departments to parent based on code prefix
                                                        const parentCode = dept.code;
                                                        const subDeptCode = subdept.code.split('-')[0];
                                                        if (subDeptCode === parentCode) {
                                                            return (
                                                                <div key={subIdx} className="space-y-1 flex items-start justify-between gap-2">
                                                                    <div className="flex-1">
                                                                        <div className="text-sm">
                                                                            └─ {subdept.name} <span className="text-xs font-mono text-muted-foreground">({subdept.code})</span>
                                                                        </div>
                                                                        {subdept.description && (
                                                                            <div className="text-xs text-muted-foreground ml-4">{subdept.description}</div>
                                                                        )}
                                                                    </div>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveDepartment(departments.indexOf(subdept))}
                                                                        className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950"
                                                                    >
                                                                        <Trash2 className="size-4" />
                                                                    </Button>
                                                                </div>
                                                            );
                                                        }
                                                        return null;
                                                    })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Add New Department Section */}
                            <div className="space-y-3 border-t pt-4">
                                <h4 className="font-semibold text-sm">Add Custom Department</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="dept-name" className="text-xs">Department Name</Label>
                                        <Input
                                            id="dept-name"
                                            placeholder="e.g., Quality Assurance"
                                            value={newDeptName}
                                            onChange={(e) => setNewDeptName(e.target.value)}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="dept-code" className="text-xs">Code</Label>
                                        <Input
                                            id="dept-code"
                                            placeholder="e.g., QA"
                                            value={newDeptCode}
                                            onChange={(e) => setNewDeptCode(e.target.value.toUpperCase())}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="dept-description" className="text-xs">Description (Optional)</Label>
                                    <Input
                                        id="dept-description"
                                        placeholder="Department description"
                                        value={newDeptDescription}
                                        onChange={(e) => setNewDeptDescription(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="dept-level" className="text-xs">Department Level</Label>
                                    <select
                                        id="dept-level"
                                        value={newDeptLevel}
                                        onChange={(e) => setNewDeptLevel(parseInt(e.target.value) as 0 | 1)}
                                        className="w-full mt-1 px-3 py-2 border rounded-md bg-background text-foreground text-sm"
                                    >
                                        <option value={0}>Top Level</option>
                                        <option value={1}>Sub Department</option>
                                    </select>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAddDepartment}
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                >
                                    <Plus className="size-4 mr-2" />
                                    Add Department
                                </Button>
                            </div>

                            <div className="space-y-3 border-t pt-4">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="seed-positions"
                                        checked={seedPositions}
                                        onCheckedChange={(checked) => setSeedPositions(checked === true)}
                                    />
                                    <Label htmlFor="seed-positions" className="text-sm font-medium cursor-pointer">
                                        Also create sample job positions for each department
                                    </Label>
                                </div>
                                <p className="text-xs text-muted-foreground ml-6">
                                    Default positions include Executive, Manager, Senior Staff, and Junior levels
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                ℹ️ This action will create {departments.length} departments
                            </p>
                            <p className="text-xs text-blue-800 dark:text-blue-200">
                                You can add, edit, or delete departments after seeding.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Seed {departments.length} Departments
                            </Button>
                        </div>
                    </form>
                )}

                {step === 'confirming' && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <Loader2 className="size-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Creating {departments.length} departments...</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <CheckCircle2 className="size-12 text-green-500" />
                        <div className="text-center">
                            <p className="text-lg font-semibold">Departments Created Successfully!</p>
                            <p className="text-sm text-muted-foreground">Redirecting...</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
