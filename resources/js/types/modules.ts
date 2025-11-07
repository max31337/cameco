import { LucideIcon } from 'lucide-react';

export type IconType = LucideIcon | string;

export interface ModuleCategory {
    id: string;
    title: string;
    description?: string;
    modules: Module[];
}

export interface Module {
    id: string;
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

export interface ModuleGridProps {
    categories: ModuleCategory[];
    showComingSoon?: boolean;
}
