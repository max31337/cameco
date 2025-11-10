import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Loader2, Briefcase, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { router } from '@inertiajs/react';

interface SeedPositionsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ModalStep = 'preview' | 'confirming' | 'success';

interface PositionTemplate {
    title: string;
    level: 'executive' | 'director' | 'manager' | 'senior' | 'mid' | 'junior';
    department_code: string;
    reporting_to?: string;
}

const POSITION_LEVELS = {
    executive: { label: 'Executive Level', color: 'bg-red-100 text-red-800' },
    director: { label: 'Director Level', color: 'bg-orange-100 text-orange-800' },
    manager: { label: 'Manager Level', color: 'bg-yellow-100 text-yellow-800' },
    senior: { label: 'Senior Level', color: 'bg-blue-100 text-blue-800' },
    mid: { label: 'Mid Level', color: 'bg-green-100 text-green-800' },
    junior: { label: 'Junior Level', color: 'bg-purple-100 text-purple-800' },
};

const DEFAULT_POSITIONS: PositionTemplate[] = [
    // Executive Level
    { title: 'Chief Executive Officer', level: 'executive', department_code: 'EXEC' },
    { title: 'Chief Operating Officer', level: 'executive', department_code: 'EXEC', reporting_to: 'CEO' },
    { title: 'Chief Financial Officer', level: 'executive', department_code: 'FIN', reporting_to: 'CEO' },
    { title: 'Chief Technology Officer', level: 'executive', department_code: 'IT', reporting_to: 'CEO' },

    // Director Level
    { title: 'HR Director', level: 'director', department_code: 'HR', reporting_to: 'COO' },
    { title: 'Finance Director', level: 'director', department_code: 'FIN', reporting_to: 'CFO' },
    { title: 'Operations Director', level: 'director', department_code: 'OPS', reporting_to: 'COO' },
    { title: 'Sales Director', level: 'director', department_code: 'SALES', reporting_to: 'COO' },
    { title: 'IT Director', level: 'director', department_code: 'IT', reporting_to: 'CTO' },

    // Manager Level
    { title: 'HR Manager', level: 'manager', department_code: 'HR-OPS', reporting_to: 'HR Director' },
    { title: 'Recruitment Manager', level: 'manager', department_code: 'HR-REC', reporting_to: 'HR Director' },
    { title: 'Payroll Manager', level: 'manager', department_code: 'FIN-PAY', reporting_to: 'Finance Director' },
    { title: 'Accounts Manager', level: 'manager', department_code: 'FIN-AP', reporting_to: 'Finance Director' },
    { title: 'IT Manager', level: 'manager', department_code: 'IT', reporting_to: 'IT Director' },
    { title: 'Operations Manager', level: 'manager', department_code: 'OPS', reporting_to: 'Operations Director' },

    // Senior Level
    { title: 'Senior Accountant', level: 'senior', department_code: 'FIN-AP', reporting_to: 'Accounts Manager' },
    { title: 'Senior HR Specialist', level: 'senior', department_code: 'HR-OPS', reporting_to: 'HR Manager' },
    { title: 'Senior Developer', level: 'senior', department_code: 'IT', reporting_to: 'IT Manager' },
    { title: 'Senior Sales Representative', level: 'senior', department_code: 'SALES', reporting_to: 'Sales Director' },

    // Mid Level
    { title: 'Accountant', level: 'mid', department_code: 'FIN-AP', reporting_to: 'Senior Accountant' },
    { title: 'HR Specialist', level: 'mid', department_code: 'HR-OPS', reporting_to: 'HR Manager' },
    { title: 'Developer', level: 'mid', department_code: 'IT', reporting_to: 'Senior Developer' },
    { title: 'Sales Representative', level: 'mid', department_code: 'SALES', reporting_to: 'Senior Sales Representative' },
    { title: 'Operations Coordinator', level: 'mid', department_code: 'OPS', reporting_to: 'Operations Manager' },

    // Junior Level
    { title: 'Junior Accountant', level: 'junior', department_code: 'FIN-AP', reporting_to: 'Accountant' },
    { title: 'HR Associate', level: 'junior', department_code: 'HR-OPS', reporting_to: 'HR Specialist' },
    { title: 'Junior Developer', level: 'junior', department_code: 'IT', reporting_to: 'Developer' },
    { title: 'Junior Sales Representative', level: 'junior', department_code: 'SALES', reporting_to: 'Sales Representative' },
    { title: 'Administrative Assistant', level: 'junior', department_code: 'ADMIN', reporting_to: 'Operations Manager' },
];

export function SeedPositionsModal({ isOpen, onClose }: SeedPositionsModalProps) {
    const [step, setStep] = useState<ModalStep>('preview');
    const [positions, setPositions] = useState<PositionTemplate[]>(DEFAULT_POSITIONS);

    const handleRemovePosition = (index: number) => {
        setPositions(positions.filter((_, i) => i !== index));
    };

    const handleConfirm = (e: FormEvent) => {
        e.preventDefault();
        setStep('confirming');

        // Use Inertia router which automatically handles CSRF
        router.post('/system/organization/positions/seed', {
            positions: JSON.stringify(positions),
        }, {
            onSuccess: () => {
                setStep('success');
                setTimeout(() => {
                    onClose();
                    setStep('preview');
                    setPositions(DEFAULT_POSITIONS);
                    window.location.reload();
                }, 2000);
            },
            onError: (errors) => {
                setStep('preview');
                const errorMessage = Object.values(errors).flat().join(', ');
                alert('Failed to seed positions: ' + errorMessage);
            },
        });
    };

    const getPositionsByLevel = (level: keyof typeof POSITION_LEVELS) => 
        DEFAULT_POSITIONS.filter(p => p.level === level);

    const getLevelInfo = (level: keyof typeof POSITION_LEVELS) => POSITION_LEVELS[level];

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Seed Default Positions</DialogTitle>
                    <DialogDescription>
                        {step === 'preview' && 'Review and create default job positions organized by level'}
                        {step === 'confirming' && 'Creating positions...'}
                        {step === 'success' && 'Positions created successfully!'}
                    </DialogDescription>
                </DialogHeader>

                {step === 'preview' && (
                    <form onSubmit={handleConfirm} className="space-y-6">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Briefcase className="size-5 text-primary" />
                                    Position Hierarchy Preview
                                </h3>
                                
                                {(Object.keys(POSITION_LEVELS) as Array<keyof typeof POSITION_LEVELS>).map((level) => {
                                    const positions = getPositionsByLevel(level);
                                    const levelInfo = getLevelInfo(level);
                                    
                                    return (
                                        <div key={level} className="mb-6 space-y-2">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge className={levelInfo.color}>
                                                    {levelInfo.label}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {positions.length} {positions.length === 1 ? 'position' : 'positions'}
                                                </span>
                                            </div>
                                            
                                            <div className="bg-muted p-4 rounded-lg space-y-2 ml-2">
                                                {positions.map((pos, idx) => {
                                                    const posIndex = positions.findIndex(p => p.title === pos.title && p.level === pos.level && p.department_code === pos.department_code);
                                                    return (
                                                        <div key={idx} className="text-sm flex items-start justify-between gap-2">
                                                            <div className="flex-1">
                                                                <div className="font-medium">
                                                                    • {pos.title}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground ml-4">
                                                                    Dept: <span className="font-mono">{pos.department_code}</span>
                                                                    {pos.reporting_to && (
                                                                        <> | Reports to: {pos.reporting_to}</>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemovePosition(posIndex)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950 flex-shrink-0"
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="space-y-3 bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                    ℹ️ This action will create {positions.length} positions
                                </p>
                                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 ml-4">
                                    <li>• Positions are mapped to existing departments</li>
                                    <li>• Reporting hierarchies are established</li>
                                    <li>• Positions with non-existent departments will be skipped</li>
                                    <li>• You can remove positions you don't need</li>
                                    <li>• You can edit or delete positions after seeding</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Seed {positions.length} Positions
                            </Button>
                        </div>
                    </form>
                )}

                {step === 'confirming' && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <Loader2 className="size-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Creating {positions.length} positions...</p>
                    </div>
                )}

                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                        <CheckCircle2 className="size-12 text-green-500" />
                        <div className="text-center">
                            <p className="text-lg font-semibold">Positions Created Successfully!</p>
                            <p className="text-sm text-muted-foreground">Redirecting...</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
