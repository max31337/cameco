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

interface Profile {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    date_of_birth: string;
    place_of_birth: string | null;
    is_pwd: boolean | null;
    gender: string;
    civil_status: string;
    spouse_name: string | null;
    spouse_date_of_birth: string | null;
    spouse_contact_number: string | null;
    father_name: string | null;
    father_date_of_birth: string | null;
    mother_name: string | null;
    mother_date_of_birth: string | null;
    phone: string | null;
    mobile: string | null;
    current_address: string | null;
    permanent_address: string | null;
    emergency_contact_name: string | null;
    emergency_contact_relationship: string | null;
    emergency_contact_phone: string | null;
    emergency_contact_address: string | null;
    sss_number: string | null;
    tin_number: string | null;
    philhealth_number: string | null;
    pagibig_number: string | null;
}

interface Employee {
    id: number;
    employee_number: string;
    email: string;
    department_id: number;
    position_id: number;
    employment_type: string;
    date_hired: string;
    regularization_date: string | null;
    supervisor_id: number | null;
    status: string;
    profile: Profile;
    dependents?: EmployeeDependentData[];
}

interface EditEmployeeProps {
    employee: Employee;
    departments: Department[];
    positions: Position[];
    supervisors: Supervisor[];
}

type EmployeeFormData = PersonalInfoData & EmploymentInfoData & EmergencyContactData & GovernmentIDsData;

// ============================================================================
// Component
// ============================================================================

export default function EditEmployee({ 
    employee, 
    departments = [], 
    positions = [], 
    supervisors = [] 
}: EditEmployeeProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

    // Debug: Log employee data on mount
    console.log('Edit Employee - Received employee data:', {
        id: employee.id,
        profile: employee.profile,
        gender: employee.profile.gender,
        civil_status: employee.profile.civil_status,
    });

    // Initialize form data from employee prop
    const [personalInfo, setPersonalInfo] = useState<PersonalInfoData>({
        first_name: employee.profile.first_name || '',
        middle_name: employee.profile.middle_name || '',
        last_name: employee.profile.last_name || '',
        suffix: employee.profile.suffix || '',
        date_of_birth: employee.profile.date_of_birth || '',
        place_of_birth: employee.profile.place_of_birth || '',
        is_pwd: employee.profile.is_pwd || false,
        gender: employee.profile.gender || 'male',
        civil_status: employee.profile.civil_status || 'single',
        spouse_name: employee.profile.spouse_name || '',
        spouse_date_of_birth: employee.profile.spouse_date_of_birth || '',
        spouse_contact_number: employee.profile.spouse_contact_number || '',
        father_name: employee.profile.father_name || '',
        father_date_of_birth: employee.profile.father_date_of_birth || '',
        mother_name: employee.profile.mother_name || '',
        mother_date_of_birth: employee.profile.mother_date_of_birth || '',
        email: employee.email || '',
        phone: employee.profile.phone || '',
        mobile: employee.profile.mobile || '',
        current_address: employee.profile.current_address || '',
        permanent_address: employee.profile.permanent_address || '',
        same_as_current: employee.profile.current_address === employee.profile.permanent_address,
    });

    const [employmentInfo, setEmploymentInfo] = useState<EmploymentInfoData>({
        employee_number: employee.employee_number,
        department_id: employee.department_id.toString(),
        position_id: employee.position_id.toString(),
        employment_type: employee.employment_type,
        date_hired: employee.date_hired,
        regularization_date: employee.regularization_date || '',
        supervisor_id: employee.supervisor_id?.toString() || '',
        status: employee.status,
    });

    const [emergencyContact, setEmergencyContact] = useState<EmergencyContactData>({
        emergency_contact_name: employee.profile.emergency_contact_name || '',
        emergency_contact_relationship: employee.profile.emergency_contact_relationship || '',
        emergency_contact_phone: employee.profile.emergency_contact_phone || '',
        emergency_contact_address: employee.profile.emergency_contact_address || '',
    });

    const [governmentIDs, setGovernmentIDs] = useState<GovernmentIDsData>({
        sss_number: employee.profile.sss_number || '',
        tin_number: employee.profile.tin_number || '',
        philhealth_number: employee.profile.philhealth_number || '',
        pagibig_number: employee.profile.pagibig_number || '',
    });

    const [dependents, setDependents] = useState<EmployeeDependentData[]>(employee.dependents || []);

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

        // Combine all form data (exclude employee_number from submission)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { employee_number, ...employmentData } = employmentInfo;
        const formData = {
            ...personalInfo,
            ...employmentData,
            ...emergencyContact,
            ...governmentIDs,
            dependents: dependents,
        };

        router.put(`/hr/employees/${employee.id}`, formData as unknown as Record<string, string | boolean>, {
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
            <Head title={`Edit Employee - ${employee.employee_number}`} />

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
                            <h1 className="text-3xl font-bold tracking-tight">Edit Employee</h1>
                            <p className="text-muted-foreground">
                                Update employee information for {employee.employee_number}
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
                        isEditMode={true}
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
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
