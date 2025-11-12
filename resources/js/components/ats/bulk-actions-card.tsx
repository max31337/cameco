import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BulkAction {
  label: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onClick: () => void;
  disabled?: boolean;
  loadingText?: string;
  isLoading?: boolean;
}

interface BulkActionsCardProps {
  selectedCount: number;
  actions: BulkAction[];
  onClear: () => void;
  isLoading?: boolean;
}

/**
 * Reusable Bulk Actions Card Component
 * 
 * Displays a card with the count of selected items and action buttons
 * 
 * @example
 * <BulkActionsCard
 *   selectedCount={3}
 *   actions={[
 *     { label: 'Archive', onClick: handleArchive },
 *     { label: 'Delete', variant: 'destructive', onClick: handleDelete },
 *   ]}
 *   onClear={() => setSelectedIds(new Set())}
 * />
 */
export function BulkActionsCard({
  selectedCount,
  actions,
  onClear,
  isLoading = false,
}: BulkActionsCardProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <Card className="border-blue-300 bg-blue-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </p>
          </div>
          <div className="flex gap-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled !== undefined ? action.disabled : isLoading}
                variant={action.variant || 'outline'}
                size="sm"
              >
                {action.isLoading ? action.loadingText || action.label : action.label}
              </Button>
            ))}
            <Button
              onClick={onClear}
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
