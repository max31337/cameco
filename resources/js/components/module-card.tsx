import React from 'react';
import { LucideIcon } from 'lucide-react';
import {
    Activity,
    HardDrive,
    Database,
    Shield,
    FileBox,
    Calendar,
    Users,
    Briefcase,
    DollarSign,
    Clock,
    Settings,
    BarChart3,
    AlertCircle,
    Key,
} from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type IconType = LucideIcon | string;

interface ModuleCardProps {
    icon: IconType;
    title: string;
    description: string;
    href: string;
    badge?: {
        count: number;
        label: string;
        variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    };
    isDisabled?: boolean;
    comingSoon?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
    Activity,
    HardDrive,
    Database,
    Shield,
    FileBox,
    Calendar,
    Users,
    Briefcase,
    DollarSign,
    Clock,
    Settings,
    BarChart3,
    AlertCircle,
    Key,
};

export function ModuleCard({
    icon,
    title,
    description,
    href,
    badge,
    isDisabled = false,
    comingSoon = false,
}: ModuleCardProps) {
    // Get the icon component
    const Icon = typeof icon === 'string' ? (iconMap[icon] || Activity) : icon;
    const content = (
        <Card
            className={cn(
                'group cursor-pointer transition-all hover:shadow-lg hover:scale-105',
                isDisabled && 'opacity-50 cursor-not-allowed hover:shadow-none hover:scale-100',
                comingSoon && 'opacity-75 cursor-default hover:shadow-none hover:scale-100'
            )}
        >
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className={cn(
                            'p-2 rounded-lg bg-muted group-hover:bg-primary group-hover:text-primary-foreground transition-colors',
                            isDisabled && 'group-hover:bg-muted'
                        )}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-base">{title}</CardTitle>
                        </div>
                    </div>
                    {badge && !comingSoon && (
                        <Badge variant={badge.variant || 'default'} className="ml-2 whitespace-nowrap">
                            {badge.count > 0 ? `${badge.count} ${badge.label}` : 'No pending'}
                        </Badge>
                    )}
                    {comingSoon && (
                        <Badge variant="outline" className="ml-2">
                            Coming Soon
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-sm line-clamp-2">
                    {description}
                </CardDescription>
            </CardContent>
        </Card>
    );

    if (isDisabled || comingSoon) {
        return content;
    }

    return (
        <Link href={href} className="block no-underline">
            {content}
        </Link>
    );
}
