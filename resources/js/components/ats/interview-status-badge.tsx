import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import type { InterviewStatus } from '@/types/ats-pages';

interface InterviewStatusBadgeProps {
  status: InterviewStatus;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive';
  showIcon?: boolean;
  className?: string;
}

/**
 * Interview Status Badge
 * Displays interview status with color-coding and optional icon
 * Supports all interview statuses: scheduled, completed, cancelled, no_show
 */
export function InterviewStatusBadge({
  status,
  variant,
  showIcon = true,
  className = '',
}: InterviewStatusBadgeProps) {
  const statusConfig: Record<
    InterviewStatus,
    {
      label: string;
      defaultVariant: 'default' | 'outline' | 'secondary' | 'destructive';
      icon: React.ReactNode;
      bgColor: string;
      textColor: string;
    }
  > = {
    scheduled: {
      label: 'Scheduled',
      defaultVariant: 'default',
      icon: <Clock className="h-3 w-3" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    completed: {
      label: 'Completed',
      defaultVariant: 'secondary',
      icon: <CheckCircle className="h-3 w-3" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    cancelled: {
      label: 'Cancelled',
      defaultVariant: 'destructive',
      icon: <XCircle className="h-3 w-3" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    no_show: {
      label: 'No Show',
      defaultVariant: 'outline',
      icon: <AlertCircle className="h-3 w-3" />,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  };

  const config = statusConfig[status];
  const badgeVariant = variant || config.defaultVariant;

  return (
    <Badge
      variant={badgeVariant}
      className={`flex items-center gap-1.5 ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </Badge>
  );
}

/**
 * Interview Status Indicator - Compact version
 * Used in tables and listings where space is limited
 */
export function InterviewStatusIndicator({
  status,
  className = '',
}: {
  status: InterviewStatus;
  className?: string;
}) {
  const colorConfig: Record<InterviewStatus, { bg: string; text: string }> = {
    scheduled: { bg: 'bg-blue-100', text: 'text-blue-800' },
    completed: { bg: 'bg-green-100', text: 'text-green-800' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
    no_show: { bg: 'bg-orange-100', text: 'text-orange-800' },
  };

  const statusLabels: Record<InterviewStatus, string> = {
    scheduled: 'Scheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
    no_show: 'No Show',
  };

  const config = colorConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      {statusLabels[status]}
    </span>
  );
}

/**
 * Interview Status Dot - Minimal indicator for visual reference
 * Used in calendars and compact views
 */
export function InterviewStatusDot({
  status,
  className = '',
}: {
  status: InterviewStatus;
  className?: string;
}) {
  const dotColors: Record<InterviewStatus, string> = {
    scheduled: 'bg-blue-500',
    completed: 'bg-green-500',
    cancelled: 'bg-red-500',
    no_show: 'bg-orange-500',
  };

  const color = dotColors[status];

  return (
    <div
      className={`h-2 w-2 rounded-full ${color} ${className}`}
      title={status.replace('_', ' ')}
    />
  );
}
