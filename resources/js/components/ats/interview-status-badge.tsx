import React from 'react';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import type { InterviewStatus } from '@/types/ats-pages';

interface InterviewStatusBadgeProps {
  status: InterviewStatus;
  showIcon?: boolean;
  className?: string;
}

/**
 * Interview Status Badge
 * Displays interview status with consistent color-coding and icon
 * 
 * Color Scheme:
 * - Scheduled: Blue (information/pending)
 * - Completed: Green (success)
 * - Cancelled: Red (error/danger)
 * - No Show: Orange (warning)
 */
export function InterviewStatusBadge({
  status,
  showIcon = true,
  className = '',
}: InterviewStatusBadgeProps) {
  const statusConfig: Record<
    InterviewStatus,
    {
      label: string;
      icon: React.ReactNode;
      bgColor: string;
      textColor: string;
      borderColor: string;
    }
  > = {
    scheduled: {
      label: 'Scheduled',
      icon: <Clock className="h-3 w-3" />,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      borderColor: 'border-blue-300',
    },
    completed: {
      label: 'Completed',
      icon: <CheckCircle className="h-3 w-3" />,
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
    },
    cancelled: {
      label: 'Cancelled',
      icon: <XCircle className="h-3 w-3" />,
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
    },
    no_show: {
      label: 'No Show',
      icon: <AlertCircle className="h-3 w-3" />,
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-800',
      borderColor: 'border-amber-300',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor} ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
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
  const colorConfig: Record<InterviewStatus, { bg: string; text: string; border: string }> = {
    scheduled: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-800',
      border: 'border-blue-300',
    },
    completed: { 
      bg: 'bg-green-100', 
      text: 'text-green-800',
      border: 'border-green-300',
    },
    cancelled: { 
      bg: 'bg-red-100', 
      text: 'text-red-800',
      border: 'border-red-300',
    },
    no_show: { 
      bg: 'bg-amber-100', 
      text: 'text-amber-800',
      border: 'border-amber-300',
    },
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
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
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
    no_show: 'bg-amber-500',
  };

  const color = dotColors[status];

  return (
    <div
      className={`h-2 w-2 rounded-full ${color} ${className}`}
      title={status.replace('_', ' ')}
    />
  );
}
