import React from 'react';
import { ModuleCard } from '@/components/module-card';
import { ModuleGridProps } from '@/types/modules';
import { Separator } from '@/components/ui/separator';

export function ModuleGrid({ categories, showComingSoon = false }: ModuleGridProps) {
    const visibleCategories = categories.filter(
        cat => cat.modules.some(m => !m.comingSoon || showComingSoon)
    );

    if (visibleCategories.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No modules available</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {visibleCategories.map((category, index) => {
                const visibleModules = category.modules.filter(
                    m => !m.comingSoon || showComingSoon
                );

                if (visibleModules.length === 0) {
                    return null;
                }

                return (
                    <div key={category.id}>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">{category.title}</h3>
                            {category.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {category.description}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {visibleModules.map(module => (
                                <ModuleCard
                                    key={module.id}
                                    icon={module.icon}
                                    title={module.title}
                                    description={module.description}
                                    href={module.href}
                                    badge={module.badge}
                                    isDisabled={module.isDisabled}
                                    comingSoon={module.comingSoon}
                                />
                            ))}
                        </div>
                        {index < visibleCategories.length - 1 && (
                            <Separator className="mt-8" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
