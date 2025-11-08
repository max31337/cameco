import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { 
    PersonalInfoSection, 
    type PersonalInfoData 
} from '@/components/hr/forms/personal-info-section';
import { 
    EmploymentInfoSection, 
    type EmploymentInfoData 
} from '@/components/hr/forms/employment-info-section';
import { 
    EmergencyContactSection, 
    type EmergencyContactData 
} from '@/components/hr/forms/emergency-contact-section';
import { 
    GovernmentIDsSection, 
    type GovernmentIDsData 
} from '@/components/hr/forms/government-ids-section';
import { 
    DependentsSection, 
    type EmployeeDependentData 
} from '@/components/hr/forms/dependents-section';

// ============================================================================
// Type Definitions
// ============================================================================

interface Department {
    id: number;
    name: string;
}

interface Position {
    id: number;
    name: string;
    department_id: number;
}

interface Supervisor {
    id: number;
    name: string;
    employee_number: string;
}

interface CreateEmployeeProps {
    departments: Department[];
    positions: Position[];
    supervisors: Supervisor[];
}

type EmployeeFormData = PersonalInfoData & EmploymentInfoData & EmergencyContactData & GovernmentIDsData;

// ============================================================================
// Component
// ============================================================================

export default function CreateEmployee({ departments = [], positions = [], supervisors = [] }: CreateEmployeeProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

    // Initialize form data
    const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        date_of_birth: '',
        gender: '',
        civil_status: '',
        email: '',
        phone: '',
        mobile: '',
        current_address: '',
        permanent_address: '',
        same_as_current: false,
    });

    const [employmentInfo, setEmploymentInfo] = useState<EmploymentInfoData>({
        department_id: '',
        position_id: '',
        employment_type: '',
        date_hired: '',
        regularization_date: '',
        supervisor_id: '',
        status: 'active',
    });

    const [emergencyContact, setEmergencyContact] = useState<EmergencyContactData>({
        emergency_contact_name: '',
        emergency_contact_relationship: '',
        emergency_contact_phone: '',
        emergency_contact_address: '',
    });

    const [governmentIDs, setGovernmentIDs] = useState<GovernmentIDsData>({
        sss_number: '',
        tin_number: '',
        philhealth_number: '',
        pagibig_number: '',
    });

    const [dependents, setDependents] = useState<EmployeeDependentData[]>([]);

    // Handle field changes
    const handlePersonalInfoChange = (field: keyof PersonalInfoData, value: string | boolean) => {
        setPersonalInfo(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleEmploymentInfoChange = (field: keyof EmploymentInfoData, value: string) => {
        setEmploymentInfo(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleEmergencyContactChange = (field: keyof EmergencyContactData, value: string) => {
        setEmergencyContact(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleGovernmentIDsChange = (field: keyof GovernmentIDsData, value: string) => {
        setGovernmentIDs(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Combine all form data
        const formData = {
            ...personalInfo,
            ...employmentInfo,
            ...emergencyContact,
            ...governmentIDs,
            dependents: dependents,
        };

        router.post('/hr/employees', formData as unknown as Record<string, string | boolean>, {
            onSuccess: () => {
                // Redirect handled by backend
            },
            onError: (serverErrors) => {
                setErrors(serverErrors as Partial<Record<keyof EmployeeFormData, string>>);
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Employee" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/hr/employees">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Create New Employee</h1>
                            <p className="text-muted-foreground">
                                Add a new employee to the system
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <PersonalInfoSection
                        data={personalInfo}
                        onChange={handlePersonalInfoChange}
                        errors={errors}
                    />

                    {/* Employment Information */}
                    <EmploymentInfoSection
                        data={employmentInfo}
                        onChange={handleEmploymentInfoChange}
                        errors={errors}
                        departments={departments}
                        positions={positions}
                        supervisors={supervisors}
                        isEditMode={false}
                    />

                    {/* Emergency Contact */}
                    <EmergencyContactSection
                        data={emergencyContact}
                        onChange={handleEmergencyContactChange}
                        errors={errors}
                    />

                    {/* Government IDs */}
                    <GovernmentIDsSection
                        data={governmentIDs}
                        onChange={handleGovernmentIDsChange}
                        errors={errors}
                    />

                    {/* Dependents */}
                    <DependentsSection
                        dependents={dependents}
                        onChange={setDependents}
                        isEditMode={true}
                    />

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t">
                        <Link href="/hr/employees">
                            <Button type="button" variant="outline" disabled={isSubmitting}>
                                Cancel
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isSubmitting}>
                            <Save className="h-4 w-4 mr-2" />
                            {isSubmitting ? 'Creating...' : 'Create Employee'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
