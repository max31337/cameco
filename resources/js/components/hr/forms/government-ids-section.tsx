import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';

// ============================================================================
// Type Definitions
// ============================================================================

export interface GovernmentIDsData {
    sss_number?: string;
    tin_number?: string;
    philhealth_number?: string;
    pagibig_number?: string;
}

interface GovernmentIDsSectionProps {
    data: GovernmentIDsData;
    onChange: (field: keyof GovernmentIDsData, value: string) => void;
    errors?: Partial<Record<keyof GovernmentIDsData, string>>;
}

// ============================================================================
// Component
// ============================================================================

export function GovernmentIDsSection({ data, onChange, errors = {} }: GovernmentIDsSectionProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                        <CardTitle>Government IDs</CardTitle>
                        <CardDescription>Philippine government identification numbers (Optional)</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="sss_number">SSS Number</Label>
                        <Input
                            id="sss_number"
                            value={data.sss_number || ''}
                            onChange={(e) => onChange('sss_number', e.target.value)}
                            placeholder="00-0000000-0"
                            maxLength={12}
                        />
                        {errors.sss_number && (
                            <p className="text-xs text-destructive">{errors.sss_number}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Format: 00-0000000-0
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tin_number">TIN (Tax Identification Number)</Label>
                        <Input
                            id="tin_number"
                            value={data.tin_number || ''}
                            onChange={(e) => onChange('tin_number', e.target.value)}
                            placeholder="000-000-000-000"
                            maxLength={15}
                        />
                        {errors.tin_number && (
                            <p className="text-xs text-destructive">{errors.tin_number}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Format: 000-000-000-000
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="philhealth_number">PhilHealth Number</Label>
                        <Input
                            id="philhealth_number"
                            value={data.philhealth_number || ''}
                            onChange={(e) => onChange('philhealth_number', e.target.value)}
                            placeholder="00-000000000-0"
                            maxLength={14}
                        />
                        {errors.philhealth_number && (
                            <p className="text-xs text-destructive">{errors.philhealth_number}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Format: 00-000000000-0
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pagibig_number">Pag-IBIG Number</Label>
                        <Input
                            id="pagibig_number"
                            value={data.pagibig_number || ''}
                            onChange={(e) => onChange('pagibig_number', e.target.value)}
                            placeholder="0000-0000-0000"
                            maxLength={14}
                        />
                        {errors.pagibig_number && (
                            <p className="text-xs text-destructive">{errors.pagibig_number}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Format: 0000-0000-0000
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
