import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';

// ============================================================================
// Type Definitions
// ============================================================================

export interface PersonalInfoData {
    first_name: string;
    middle_name: string;
    last_name: string;
    suffix?: string;
    date_of_birth: string;
    gender: string;
    civil_status: string;
    email: string;
    phone: string;
    mobile: string;
    current_address: string;
    permanent_address: string;
    same_as_current: boolean;
}

interface PersonalInfoSectionProps {
    data: PersonalInfoData;
    onChange: (field: keyof PersonalInfoData, value: string | boolean) => void;
    errors?: Partial<Record<keyof PersonalInfoData, string>>;
}

// ============================================================================
// Component
// ============================================================================

export function PersonalInfoSection({ data, onChange, errors = {} }: PersonalInfoSectionProps) {
    const handleSameAsCurrentChange = (checked: boolean) => {
        onChange('same_as_current', checked);
        if (checked) {
            onChange('permanent_address', data.current_address);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Basic personal details and contact information</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="first_name">
                            First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="first_name"
                            value={data.first_name}
                            onChange={(e) => onChange('first_name', e.target.value)}
                            placeholder="Juan"
                        />
                        {errors.first_name && (
                            <p className="text-xs text-destructive">{errors.first_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="middle_name">Middle Name</Label>
                        <Input
                            id="middle_name"
                            value={data.middle_name}
                            onChange={(e) => onChange('middle_name', e.target.value)}
                            placeholder="Santos"
                        />
                        {errors.middle_name && (
                            <p className="text-xs text-destructive">{errors.middle_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="last_name">
                            Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="last_name"
                            value={data.last_name}
                            onChange={(e) => onChange('last_name', e.target.value)}
                            placeholder="Dela Cruz"
                        />
                        {errors.last_name && (
                            <p className="text-xs text-destructive">{errors.last_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="suffix">Suffix</Label>
                        <Input
                            id="suffix"
                            value={data.suffix || ''}
                            onChange={(e) => onChange('suffix', e.target.value)}
                            placeholder="Jr., Sr., III"
                        />
                        {errors.suffix && (
                            <p className="text-xs text-destructive">{errors.suffix}</p>
                        )}
                    </div>
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="date_of_birth">
                            Date of Birth <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="date_of_birth"
                            type="date"
                            value={data.date_of_birth}
                            onChange={(e) => onChange('date_of_birth', e.target.value)}
                        />
                        {errors.date_of_birth && (
                            <p className="text-xs text-destructive">{errors.date_of_birth}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gender">
                            Gender <span className="text-destructive">*</span>
                        </Label>
                        <Select value={data.gender || 'male'} onValueChange={(value) => onChange('gender', value)}>
                            <SelectTrigger id="gender">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.gender && (
                            <p className="text-xs text-destructive">{errors.gender}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="civil_status">
                            Civil Status <span className="text-destructive">*</span>
                        </Label>
                        <Select value={data.civil_status || 'single'} onValueChange={(value) => onChange('civil_status', value)}>
                            <SelectTrigger id="civil_status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married">Married</SelectItem>
                                <SelectItem value="widowed">Widowed</SelectItem>
                                <SelectItem value="separated">Separated</SelectItem>
                                <SelectItem value="divorced">Divorced</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.civil_status && (
                            <p className="text-xs text-destructive">{errors.civil_status}</p>
                        )}
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => onChange('email', e.target.value)}
                            placeholder="juan.delacruz@example.com"
                        />
                        {errors.email && (
                            <p className="text-xs text-destructive">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => onChange('phone', e.target.value)}
                            placeholder="(02) 1234-5678"
                        />
                        {errors.phone && (
                            <p className="text-xs text-destructive">{errors.phone}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mobile">
                            Mobile Number <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="mobile"
                            type="tel"
                            value={data.mobile}
                            onChange={(e) => onChange('mobile', e.target.value)}
                            placeholder="0917-123-4567"
                        />
                        {errors.mobile && (
                            <p className="text-xs text-destructive">{errors.mobile}</p>
                        )}
                    </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current_address">
                            Current Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="current_address"
                            value={data.current_address}
                            onChange={(e) => onChange('current_address', e.target.value)}
                            placeholder="Street, Barangay, City, Province"
                        />
                        {errors.current_address && (
                            <p className="text-xs text-destructive">{errors.current_address}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="same_as_current"
                            checked={data.same_as_current}
                            onChange={(e) => handleSameAsCurrentChange(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="same_as_current" className="font-normal cursor-pointer">
                            Permanent address is same as current address
                        </Label>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="permanent_address">
                            Permanent Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="permanent_address"
                            value={data.permanent_address}
                            onChange={(e) => onChange('permanent_address', e.target.value)}
                            placeholder="Street, Barangay, City, Province"
                            disabled={data.same_as_current}
                        />
                        {errors.permanent_address && (
                            <p className="text-xs text-destructive">{errors.permanent_address}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
