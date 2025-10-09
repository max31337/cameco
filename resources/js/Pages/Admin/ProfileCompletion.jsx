import { useState, useEffect } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import ProfileCompletionLayout from '@/Layouts/ProfileCompletionLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ProfileCompletion({ user, progress, departments, initialStep = 1 }) {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const totalSteps = 4;
    const [draftLoaded, setDraftLoaded] = useState(false);

    // Helper function to get initial form data
    const getInitialFormData = () => {
        const employee = user.employee;
        
        return {
            // Personal Information - mapping from Employee model fields
            first_name: employee?.firstname || '',
            last_name: employee?.lastname || '',
            middle_name: employee?.middlename || '',
            date_of_birth: employee?.date_of_birth || '',
            place_of_birth: employee?.place_of_birth || '',
            gender: employee?.gender || '',
            civil_status: employee?.civil_status || '',
            nationality: employee?.nationality || 'Filipino',
            religion: employee?.religion || '',
            
            // Contact Information - mapping from Employee model fields
            email: employee?.email_personal || user.email || '',
            phone_number: employee?.contact_number || '',
            mobile_number: employee?.mobile_number || '',
            address: employee?.address || '',
            city: employee?.city || '',
            state: employee?.state || '',
            postal_code: employee?.postal_code || '',
            country: employee?.country || 'Philippines',
            
            // Employment Information - mapping from Employee model fields
            position: employee?.position || '',
            department_id: employee?.department_id || '',
            hire_date: employee?.date_employed || new Date().toISOString().split('T')[0],
            employment_type: employee?.employment_type || 'regular',
            work_schedule: employee?.work_schedule || 'day-shift',
            basic_salary: employee?.basic_salary || '',
            hourly_rate: employee?.hourly_rate || '',
            supervisor_id: employee?.immediate_supervisor_id || '',
            
            // Government IDs - mapping from Employee model fields
            sss_number: employee?.sss_no || '',
            philhealth_number: employee?.philhealth_no || '',
            tin_number: employee?.tin_no || '',
            pag_ibig_number: employee?.pagibig_no || '',
            gsis_number: employee?.gsis_no || '',
            
            // Emergency Contact
            emergency_contact_name: employee?.emergency_contact_name || '',
            emergency_contact_relationship: employee?.emergency_contact_relationship || '',
            emergency_contact_phone: employee?.emergency_contact_number || '',
            emergency_contact_address: employee?.emergency_contact_address || '',
        };
    };

    const { data, setData, post, processing, errors, reset } = useForm(getInitialFormData());

    // Load draft on mount
    useEffect(() => {
        async function fetchDraft() {
            try {
                const response = await fetch('/admin/profile/load-draft', {
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                if (!response.ok) return;
                const result = await response.json();
                if (result.draft) {
                    // Overwrite form data with draft
                    Object.entries(result.draft).forEach(([key, value]) => {
                        setData(key, value ?? '');
                    });
                    if (result.step_completed) setCurrentStep(result.step_completed);
                }
            } catch (e) {
                // Ignore errors
            } finally {
                setDraftLoaded(true);
            }
        }
        fetchDraft();
        // eslint-disable-next-line
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        
        // Save Step 4 progress before final submission
        console.log('Final submission - saving Step 4 data first...');
        await saveProgress();
        
        // Then submit the complete profile
        console.log('Submitting complete profile...');
        post(route('admin.profile.store'));
    };

    const saveProgress = async () => {
        try {
            const payload = { ...data, step_completed: currentStep };
            const response = await fetch('/admin/profile/save-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await response.json();
        } catch (error) {
            // Optionally show error to user
        }
    };

    const handleSkip = async () => {
        try {
            // Save current progress before skipping
            await saveProgress();
            
            // Then skip profile completion
            router.post('/admin/profile/skip', {}, {
                onSuccess: () => {
                    router.visit('/dashboard', { replace: true });
                }
            });
        } catch (error) {
            console.error('Failed to save progress before skipping:', error);
            // Still proceed with skip even if save fails
            router.post('/admin/profile/skip', {}, {
                onSuccess: () => {
                    router.visit('/dashboard', { replace: true });
                }
            });
        }
    };

    const nextStep = async () => {
        console.log('NextStep called - Current Step:', currentStep);
        if (currentStep < totalSteps) {
            console.log('Saving progress before moving to next step...');
            // Save progress before moving to next step
            await saveProgress();
            console.log('Moving to next step:', currentStep + 1);
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const getStepTitle = () => {
        switch(currentStep) {
            case 1: return 'Personal Information';
            case 2: return 'Contact Information';
            case 3: return 'Employment Information';
            case 4: return 'Additional Information';
            default: return '';
        }
    };

    const isStepValid = () => {
        switch(currentStep) {
            case 1:
                return data.first_name && data.last_name && data.date_of_birth && data.place_of_birth && data.gender && data.civil_status;
            case 2:
                return data.email && data.phone_number && data.address && data.city && data.state && data.postal_code;
            case 3:
                return data.position && data.department_id && data.hire_date && data.basic_salary;
            case 4:
                return data.emergency_contact_name && data.emergency_contact_relationship && data.emergency_contact_phone;
            default:
                return false;
        }
    };

    return (
        <ProfileCompletionLayout title="Complete Admin Profile">

            {/* Welcome Header */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <div className="text-center">
                    <div className="mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Admin Profile</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Welcome to the SyncingSteel System. Please complete your employee profile to access all system features and begin managing your organization.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
                            <span className="text-sm font-medium text-blue-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            ></div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">{getStepTitle()}</h2>
                    </div>
                </div>

                {/* Main Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <form onSubmit={submit}>
                            {/* Step 1: Personal Information */}
                            {currentStep === 1 && (
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <InputLabel htmlFor="first_name" value="First Name *" />
                                            <TextInput
                                                id="first_name"
                                                className="mt-1 block w-full"
                                                value={data.first_name}
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.first_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="middle_name" value="Middle Name" />
                                            <TextInput
                                                id="middle_name"
                                                className="mt-1 block w-full"
                                                value={data.middle_name}
                                                onChange={(e) => setData('middle_name', e.target.value)}
                                            />
                                            <InputError message={errors.middle_name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="last_name" value="Last Name *" />
                                            <TextInput
                                                id="last_name"
                                                className="mt-1 block w-full"
                                                value={data.last_name}
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.last_name} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="date_of_birth" value="Date of Birth *" />
                                            <TextInput
                                                id="date_of_birth"
                                                type="date"
                                                className="mt-1 block w-full"
                                                value={data.date_of_birth}
                                                onChange={(e) => setData('date_of_birth', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.date_of_birth} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="place_of_birth" value="Place of Birth *" />
                                            <TextInput
                                                id="place_of_birth"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.place_of_birth}
                                                onChange={(e) => setData('place_of_birth', e.target.value)}
                                                placeholder="Enter place of birth"
                                                required
                                            />
                                            <InputError message={errors.place_of_birth} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="gender" value="Gender *" />
                                            <select
                                                id="gender"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                value={data.gender}
                                                onChange={(e) => setData('gender', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                            <InputError message={errors.gender} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="civil_status" value="Civil Status *" />
                                            <select
                                                id="civil_status"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                value={data.civil_status}
                                                onChange={(e) => setData('civil_status', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Civil Status</option>
                                                <option value="single">Single</option>
                                                <option value="married">Married</option>
                                                <option value="divorced">Divorced</option>
                                                <option value="widowed">Widowed</option>
                                                <option value="separated">Separated</option>
                                            </select>
                                            <InputError message={errors.civil_status} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="nationality" value="Nationality" />
                                            <TextInput
                                                id="nationality"
                                                className="mt-1 block w-full"
                                                value={data.nationality}
                                                onChange={(e) => setData('nationality', e.target.value)}
                                            />
                                            <InputError message={errors.nationality} className="mt-2" />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="religion" value="Religion" />
                                        <TextInput
                                            id="religion"
                                            className="mt-1 block w-full"
                                            value={data.religion}
                                            onChange={(e) => setData('religion', e.target.value)}
                                        />
                                        <InputError message={errors.religion} className="mt-2" />
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Contact Information */}
                            {currentStep === 2 && (
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="email" value="Email Address *" />
                                            <TextInput
                                                id="email"
                                                type="email"
                                                className="mt-1 block w-full"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="phone_number" value="Phone Number *" />
                                            <TextInput
                                                id="phone_number"
                                                className="mt-1 block w-full"
                                                value={data.phone_number}
                                                onChange={(e) => setData('phone_number', e.target.value)}
                                                placeholder="+63 xxx xxx xxxx"
                                                required
                                            />
                                            <InputError message={errors.phone_number} className="mt-2" />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="mobile_number" value="Mobile Number" />
                                        <TextInput
                                            id="mobile_number"
                                            className="mt-1 block w-full"
                                            value={data.mobile_number}
                                            onChange={(e) => setData('mobile_number', e.target.value)}
                                            placeholder="+63 xxx xxx xxxx"
                                        />
                                        <InputError message={errors.mobile_number} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="address" value="Complete Address *" />
                                        <textarea
                                            id="address"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            rows="3"
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.address} className="mt-2" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <InputLabel htmlFor="city" value="City *" />
                                            <TextInput
                                                id="city"
                                                className="mt-1 block w-full"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.city} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="state" value="State/Province *" />
                                            <TextInput
                                                id="state"
                                                className="mt-1 block w-full"
                                                value={data.state}
                                                onChange={(e) => setData('state', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.state} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="postal_code" value="Postal Code *" />
                                            <TextInput
                                                id="postal_code"
                                                className="mt-1 block w-full"
                                                value={data.postal_code}
                                                onChange={(e) => setData('postal_code', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.postal_code} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="country" value="Country" />
                                            <TextInput
                                                id="country"
                                                className="mt-1 block w-full"
                                                value={data.country}
                                                onChange={(e) => setData('country', e.target.value)}
                                            />
                                            <InputError message={errors.country} className="mt-2" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Employment Information */}
                            {currentStep === 3 && (
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="position" value="Job Position *" />
                                            <TextInput
                                                id="position"
                                                className="mt-1 block w-full"
                                                value={data.position}
                                                onChange={(e) => setData('position', e.target.value)}
                                                placeholder="e.g., System Administrator"
                                                required
                                            />
                                            <InputError message={errors.position} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="department_id" value="Department *" />
                                            <select
                                                id="department_id"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                value={data.department_id}
                                                onChange={(e) => setData('department_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Select Department</option>
                                                {departments.map((dept) => (
                                                    <option key={dept.id} value={dept.id}>
                                                        {dept.name} ({dept.department_type})
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.department_id} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="hire_date" value="Hire Date *" />
                                            <TextInput
                                                id="hire_date"
                                                type="date"
                                                className="mt-1 block w-full"
                                                value={data.hire_date}
                                                onChange={(e) => setData('hire_date', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.hire_date} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="employment_type" value="Employment Type *" />
                                            <select
                                                id="employment_type"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                value={data.employment_type}
                                                onChange={(e) => setData('employment_type', e.target.value)}
                                                required
                                            >
                                                <option value="regular">Regular</option>
                                                <option value="contractual">Contractual</option>
                                                <option value="probationary">Probationary</option>
                                                <option value="consultant">Consultant</option>
                                            </select>
                                            <InputError message={errors.employment_type} className="mt-2" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="work_schedule" value="Work Schedule *" />
                                            <select
                                                id="work_schedule"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                value={data.work_schedule}
                                                onChange={(e) => setData('work_schedule', e.target.value)}
                                                required
                                            >
                                                <option value="day-shift">Day Shift</option>
                                                <option value="night-shift">Night Shift</option>
                                                <option value="rotating">Rotating</option>
                                                <option value="flexible">Flexible</option>
                                            </select>
                                            <InputError message={errors.work_schedule} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="basic_salary" value="Basic Salary (₱) *" />
                                            <TextInput
                                                id="basic_salary"
                                                type="number"
                                                step="0.01"
                                                className="mt-1 block w-full"
                                                value={data.basic_salary}
                                                onChange={(e) => setData('basic_salary', e.target.value)}
                                                placeholder="0.00"
                                                required
                                            />
                                            <InputError message={errors.basic_salary} className="mt-2" />
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="hourly_rate" value="Hourly Rate (₱)" />
                                        <TextInput
                                            id="hourly_rate"
                                            type="number"
                                            step="0.01"
                                            className="mt-1 block w-full"
                                            value={data.hourly_rate}
                                            onChange={(e) => setData('hourly_rate', e.target.value)}
                                            placeholder="0.00"
                                        />
                                        <InputError message={errors.hourly_rate} className="mt-2" />
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Additional Information */}
                            {currentStep === 4 && (
                                <div className="p-6 space-y-6">
                                    {/* Government IDs */}
                                    <div>
                                        <h4 className="font-semibold text-lg text-gray-800 mb-4">Government IDs</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="sss_number" value="SSS Number" />
                                                <TextInput
                                                    id="sss_number"
                                                    className="mt-1 block w-full"
                                                    value={data.sss_number}
                                                    onChange={(e) => setData('sss_number', e.target.value)}
                                                    placeholder="xx-xxxxxxx-x"
                                                />
                                                <InputError message={errors.sss_number} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="philhealth_number" value="PhilHealth Number" />
                                                <TextInput
                                                    id="philhealth_number"
                                                    className="mt-1 block w-full"
                                                    value={data.philhealth_number}
                                                    onChange={(e) => setData('philhealth_number', e.target.value)}
                                                    placeholder="xx-xxxxxxxxx-x"
                                                />
                                                <InputError message={errors.philhealth_number} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="tin_number" value="TIN Number" />
                                                <TextInput
                                                    id="tin_number"
                                                    className="mt-1 block w-full"
                                                    value={data.tin_number}
                                                    onChange={(e) => setData('tin_number', e.target.value)}
                                                    placeholder="xxx-xxx-xxx-xxx"
                                                />
                                                <InputError message={errors.tin_number} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="pag_ibig_number" value="Pag-IBIG Number" />
                                                <TextInput
                                                    id="pag_ibig_number"
                                                    className="mt-1 block w-full"
                                                    value={data.pag_ibig_number}
                                                    onChange={(e) => setData('pag_ibig_number', e.target.value)}
                                                    placeholder="xxxx-xxxx-xxxx"
                                                />
                                                <InputError message={errors.pag_ibig_number} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="gsis_number" value="GSIS Number" />
                                                <TextInput
                                                    id="gsis_number"
                                                    className="mt-1 block w-full"
                                                    value={data.gsis_number}
                                                    onChange={(e) => setData('gsis_number', e.target.value)}
                                                    placeholder="xxxx-xxxx-xxxx"
                                                />
                                                <InputError message={errors.gsis_number} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Emergency Contact */}
                                    <div>
                                        <h4 className="font-semibold text-lg text-gray-800 mb-4">Emergency Contact</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="emergency_contact_name" value="Contact Name *" />
                                                <TextInput
                                                    id="emergency_contact_name"
                                                    className="mt-1 block w-full"
                                                    value={data.emergency_contact_name}
                                                    onChange={(e) => setData('emergency_contact_name', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.emergency_contact_name} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="emergency_contact_relationship" value="Relationship *" />
                                                <TextInput
                                                    id="emergency_contact_relationship"
                                                    className="mt-1 block w-full"
                                                    value={data.emergency_contact_relationship}
                                                    onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
                                                    placeholder="e.g., Spouse, Parent, Sibling"
                                                    required
                                                />
                                                <InputError message={errors.emergency_contact_relationship} className="mt-2" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <InputLabel htmlFor="emergency_contact_phone" value="Contact Phone *" />
                                                <TextInput
                                                    id="emergency_contact_phone"
                                                    className="mt-1 block w-full"
                                                    value={data.emergency_contact_phone}
                                                    onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                                                    placeholder="+63 xxx xxx xxxx"
                                                    required
                                                />
                                                <InputError message={errors.emergency_contact_phone} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="emergency_contact_address" value="Contact Address" />
                                                <TextInput
                                                    id="emergency_contact_address"
                                                    className="mt-1 block w-full"
                                                    value={data.emergency_contact_address}
                                                    onChange={(e) => setData('emergency_contact_address', e.target.value)}
                                                />
                                                <InputError message={errors.emergency_contact_address} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                                <div className="flex items-center justify-between">
                                    {/* Left side - Previous and Skip */}
                                    <div className="flex items-center space-x-3">
                                        {currentStep > 1 && (
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                                </svg>
                                                Previous
                                            </button>
                                        )}
                                        
                                        <button
                                            type="button"
                                            onClick={handleSkip}
                                            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                            </svg>
                                            Skip for Now
                                        </button>
                                    </div>

                                    {/* Right side - Next/Complete */}
                                    <div>
                                        {currentStep < totalSteps ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                disabled={!isStepValid()}
                                                className="inline-flex items-center px-6 py-2 bg-blue-600 border border-transparent rounded-lg font-medium text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                            >
                                                Next Step
                                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                </svg>
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={processing || !isStepValid()}
                                                className="inline-flex items-center px-6 py-2 bg-green-600 border border-transparent rounded-lg font-medium text-sm text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                            >
                                                {processing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Creating Profile...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                        Complete Profile
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
        </ProfileCompletionLayout>
    );
}