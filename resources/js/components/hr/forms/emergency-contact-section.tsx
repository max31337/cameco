import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';

// ============================================================================
// Type Definitions
// ============================================================================

export interface EmergencyContactData {
    emergency_contact_name?: string;
    emergency_contact_relationship?: string;
    emergency_contact_phone?: string;
    emergency_contact_address?: string;
}

interface EmergencyContactSectionProps {
    data: EmergencyContactData;
    onChange: (field: keyof EmergencyContactData, value: string) => void;
    errors?: Partial<Record<keyof EmergencyContactData, string>>;
}

// ============================================================================
// Component
// ============================================================================

export function EmergencyContactSection({ data, onChange, errors = {} }: EmergencyContactSectionProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <CardTitle>Emergency Contact</CardTitle>
                        <CardDescription>Contact person in case of emergency (Optional)</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="emergency_contact_name">Contact Name</Label>
                        <Input
                            id="emergency_contact_name"
                            value={data.emergency_contact_name || ''}
                            onChange={(e) => onChange('emergency_contact_name', e.target.value)}
                            placeholder="Maria Dela Cruz"
                        />
                        {errors.emergency_contact_name && (
                            <p className="text-xs text-destructive">{errors.emergency_contact_name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                        <Input
                            id="emergency_contact_relationship"
                            value={data.emergency_contact_relationship || ''}
                            onChange={(e) => onChange('emergency_contact_relationship', e.target.value)}
                            placeholder="Spouse, Sibling, Parent, etc."
                        />
                        {errors.emergency_contact_relationship && (
                            <p className="text-xs text-destructive">{errors.emergency_contact_relationship}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                        <Input
                            id="emergency_contact_phone"
                            type="tel"
                            value={data.emergency_contact_phone || ''}
                            onChange={(e) => onChange('emergency_contact_phone', e.target.value)}
                            placeholder="0917-123-4567"
                        />
                        {errors.emergency_contact_phone && (
                            <p className="text-xs text-destructive">{errors.emergency_contact_phone}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="emergency_contact_address">Contact Address</Label>
                        <Input
                            id="emergency_contact_address"
                            value={data.emergency_contact_address || ''}
                            onChange={(e) => onChange('emergency_contact_address', e.target.value)}
                            placeholder="Street, City, Province"
                        />
                        {errors.emergency_contact_address && (
                            <p className="text-xs text-destructive">{errors.emergency_contact_address}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
