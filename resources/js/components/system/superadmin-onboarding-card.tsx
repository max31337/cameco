import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Link } from '@inertiajs/react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    action_url?: string;
    action_label?: string;
    required: boolean;
}

interface UserOnboarding {
    id: number | null;
    user_id: number;
    status: string;
    checklist_json?: ChecklistItem[];
    completion_percentage?: number;
}

interface SuperadminOnboardingCardProps {
    onboarding: UserOnboarding;
    compact?: boolean;
    dismissible?: boolean;
    onDismiss?: () => void;
}

export default function SuperadminOnboardingCard({
    onboarding,
    compact = false,
    dismissible = false,
    onDismiss,
}: SuperadminOnboardingCardProps) {
    const [isOpen, setIsOpen] = useState(!compact);

    const checklist = onboarding.checklist_json || [];
    const completedItems = checklist.filter((item) => item.completed).length;
    const totalItems = checklist.length;
    const completionPercentage = onboarding.completion_percentage || 
        (totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0);

    const requiredItems = checklist.filter((item) => item.required && !item.completed);
    const optionalItems = checklist.filter((item) => !item.required && !item.completed);

    // Don't show the card if profile is 100% complete and not dismissible
    if (completionPercentage === 100 && !dismissible) {
        return null;
    }

    const getStatusColor = () => {
        if (completionPercentage === 100) return 'secondary';
        if (completionPercentage >= 50) return 'outline';
        return 'destructive';
    };

    const getStatusText = () => {
        if (completionPercentage === 100) return 'Complete';
        if (requiredItems.length > 0) return 'Action Required';
        return 'In Progress';
    };

    return (
        <Card className={`${
            completionPercentage < 100 
                ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/20' 
                : 'border-green-500/50 bg-green-50 dark:bg-green-950/20'
        }`}>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">
                                {completionPercentage === 100 
                                    ? 'Profile Setup Complete' 
                                    : 'Complete Your Profile'}
                            </CardTitle>
                            <Badge variant={getStatusColor()}>
                                {getStatusText()}
                            </Badge>
                        </div>
                        <CardDescription className="mt-1">
                            {completionPercentage === 100
                                ? 'You have full access to all system features'
                                : 'Complete your Superadmin profile to access all system features'}
                        </CardDescription>
                    </div>
                    {dismissible && onDismiss && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDismiss}
                            className="ml-2 shrink-0"
                        >
                            Dismiss
                        </Button>
                    )}
                </div>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                            {completedItems} of {totalItems} tasks complete
                        </span>
                        <span className="text-muted-foreground">
                            {completionPercentage}%
                        </span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                </div>
            </CardHeader>

            {totalItems > 0 && completionPercentage < 100 && (
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CardContent>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className="mb-4 w-full justify-between p-0 hover:bg-transparent"
                            >
                                <span className="text-sm font-medium">
                                    {isOpen ? 'Hide' : 'Show'} pending tasks
                                </span>
                                {isOpen ? (
                                    <ChevronUp className="h-4 w-4" />
                                ) : (
                                    <ChevronDown className="h-4 w-4" />
                                )}
                            </Button>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="space-y-4">
                            {/* Required Items */}
                            {requiredItems.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                            Required Tasks ({requiredItems.length})
                                        </h4>
                                    </div>
                                    <div className="space-y-2">
                                        {requiredItems.map((item) => (
                                            <ChecklistItemCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Optional Items */}
                            {optionalItems.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-muted-foreground">
                                        Optional Tasks ({optionalItems.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {optionalItems.map((item) => (
                                            <ChecklistItemCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Completed Items */}
                            {completedItems > 0 && (
                                <div className="space-y-3 border-t pt-4">
                                    <h4 className="text-sm font-semibold text-green-700 dark:text-green-300">
                                        Completed ({completedItems})
                                    </h4>
                                    <div className="space-y-2 opacity-60">
                                        {checklist
                                            .filter((item) => item.completed)
                                            .map((item) => (
                                                <ChecklistItemCard key={item.id} item={item} />
                                            ))}
                                    </div>
                                </div>
                            )}
                        </CollapsibleContent>
                    </CardContent>
                </Collapsible>
            )}
        </Card>
    );
}

function ChecklistItemCard({ item }: { item: ChecklistItem }) {
    return (
        <div
            className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                item.completed
                    ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
                    : 'border-border bg-card hover:bg-accent/50'
            }`}
        >
            <div className="mt-0.5 shrink-0">
                {item.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                )}
            </div>
            <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                        <h5 className={`text-sm font-medium ${
                            item.completed ? 'line-through' : ''
                        }`}>
                            {item.title}
                        </h5>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {item.description}
                        </p>
                    </div>
                    {!item.completed && item.action_url && (
                        <Link href={item.action_url}>
                            <Button size="sm" variant="outline" className="shrink-0">
                                {item.action_label || 'Complete'}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
