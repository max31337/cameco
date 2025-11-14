/**
 * Workforce Management Utilities
 * Shared functions for shift assignments, schedules, and rotations
 */

/**
 * Format time from HH:MM:SS format to 12-hour display format
 * @param time - Time string in HH:MM:SS format
 * @returns Formatted time string (e.g., "6:00 AM")
 */
export function formatTime(time: string): string {
    try {
        const date = new Date(`2000-01-01T${time}`);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    } catch {
        return time;
    }
}

/**
 * Calculate shift duration in hours
 * @param startTime - Start time in HH:MM:SS format
 * @param endTime - End time in HH:MM:SS format
 * @returns Duration as a number (e.g., 8.0)
 */
export function calculateShiftDuration(startTime: string, endTime: string): number {
    try {
        const start = new Date(`2000-01-01T${startTime}`).getTime();
        let end = new Date(`2000-01-01T${endTime}`).getTime();

        // Handle overnight shifts (end time < start time)
        if (end < start) {
            end += 24 * 60 * 60 * 1000;
        }

        const durationMs = end - start;
        const durationHours = durationMs / (1000 * 60 * 60);

        return parseFloat(durationHours.toFixed(1));
    } catch {
        return 0;
    }
}

/**
 * Format shift duration as a readable string
 * @param startTime - Start time in HH:MM:SS format
 * @param endTime - End time in HH:MM:SS format
 * @returns Formatted duration string (e.g., "8.0h")
 */
export function formatShiftDuration(startTime: string, endTime: string): string {
    const duration = calculateShiftDuration(startTime, endTime);
    return duration > 0 ? `${duration}h` : '0h';
}

/**
 * Calculate overtime hours based on shift duration
 * @param duration - Shift duration in hours
 * @param standardHours - Standard work hours (default: 8)
 * @returns Overtime hours
 */
export function calculateOvertimeHours(duration: number, standardHours: number = 8): number {
    return Math.max(0, duration - standardHours);
}

/**
 * Validate shift times (end time must be after start time or next day for overnight shifts)
 * @param startTime - Start time in HH:MM:SS format
 * @param endTime - End time in HH:MM:SS format
 * @returns Object with isValid and errorMessage
 */
export function validateShiftTimes(
    startTime: string,
    endTime: string
): { isValid: boolean; errorMessage?: string } {
    if (!startTime || !endTime) {
        return { isValid: false, errorMessage: 'Start and end times are required' };
    }

    const start = new Date(`2000-01-01T${startTime}`).getTime();
    const end = new Date(`2000-01-01T${endTime}`).getTime();

    // Allow same time (for same-day shifts) or end > start (for next-day end times)
    // Overnight shifts are valid (e.g., 22:00 to 06:00)
    if (end === start) {
        return { isValid: false, errorMessage: 'End time must be different from start time' };
    }

    return { isValid: true };
}

/**
 * Check if a date is in the past
 * @param date - Date string in YYYY-MM-DD format
 * @returns true if date is in the past
 */
export function isDateInPast(date: string): boolean {
    const checkDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkDate < today;
}

/**
 * Format date for display
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date (e.g., "November 13, 2025")
 */
export function formatDate(dateString: string): string {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch {
        return dateString;
    }
}

/**
 * Format date and time for display
 * @param dateString - Date string in YYYY-MM-DD format
 * @param timeString - Time string in HH:MM:SS format
 * @returns Formatted datetime (e.g., "Nov 13, 6:00 AM")
 */
export function formatDateTime(dateString: string, timeString: string): string {
    try {
        const date = new Date(dateString);
        const time = formatTime(timeString);
        return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${time}`;
    } catch {
        return `${dateString} ${timeString}`;
    }
}

/**
 * Get shift type based on start time
 * @param startTime - Start time in HH:MM:SS format
 * @returns Shift type: 'morning' | 'afternoon' | 'night' | 'graveyard'
 */
export function getShiftTypeFromTime(startTime: string): 'morning' | 'afternoon' | 'night' | 'graveyard' {
    try {
        const hour = parseInt(startTime.split(':')[0]);

        if (hour >= 6 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 18) return 'afternoon';
        if (hour >= 18 && hour < 22) return 'night';
        return 'graveyard';
    } catch {
        return 'morning';
    }
}

/**
 * Get CSS color classes for shift type
 * @param shiftType - Shift type
 * @returns Object with bg, text, and border classes
 */
export function getShiftTypeColorClasses(shiftType: string): {
    bg: string;
    text: string;
    border: string;
} {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
        morning: {
            bg: 'bg-yellow-50',
            text: 'text-yellow-700',
            border: 'border-yellow-200',
        },
        afternoon: {
            bg: 'bg-orange-50',
            text: 'text-orange-700',
            border: 'border-orange-200',
        },
        night: {
            bg: 'bg-blue-50',
            text: 'text-blue-700',
            border: 'border-blue-200',
        },
        graveyard: {
            bg: 'bg-slate-50',
            text: 'text-slate-700',
            border: 'border-slate-200',
        },
    };

    return colors[shiftType] || {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
    };
}

/**
 * Get CSS color classes for assignment status
 * @param status - Assignment status
 * @returns CSS class string for badge
 */
export function getStatusColorClasses(status: string): string {
    const statusColors: Record<string, string> = {
        scheduled: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-purple-100 text-purple-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return statusColors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Simulate conflict detection (in real app, this would call backend API)
 * @param employeeId - Employee ID
 * @param date - Date in YYYY-MM-DD format
 * @returns Promise with conflict detection result
 */
export async function detectConflicts(
    employeeId: number,
    date: string
): Promise<{
    hasConflict: boolean;
    conflictMessage?: string;
}> {
    // Simulate API call delay
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulate 10% conflict rate for demo
            const hasConflict = Math.random() < 0.1;

            if (hasConflict) {
                resolve({
                    hasConflict: true,
                    conflictMessage: `Employee already has a shift assigned on ${formatDate(date)} (10:00 AM - 6:00 PM)`,
                });
            } else {
                resolve({
                    hasConflict: false,
                });
            }
        }, 300);
    });
}

/**
 * Calculate total hours for a date range
 * @param assignments - Array of assignments with date and shift times
 * @returns Total hours
 */
export function calculateTotalHours(
    assignments: Array<{ shift_start: string; shift_end: string }>
): number {
    return assignments.reduce((total, assignment) => {
        return total + calculateShiftDuration(assignment.shift_start, assignment.shift_end);
    }, 0);
}

/**
 * Check if employee has overtime in given period
 * @param assignments - Array of assignments
 * @param standardHoursPerWeek - Standard hours per week (default: 40)
 * @returns true if any assignments result in overtime
 */
export function hasOvertime(
    assignments: Array<{ shift_start: string; shift_end: string; is_overtime: boolean }>,
    standardHoursPerWeek: number = 40
): boolean {
    return assignments.some((a) => a.is_overtime) || 
           calculateTotalHours(assignments) > standardHoursPerWeek;
}

/**
 * Get week number from date
 * @param date - Date string in YYYY-MM-DD format
 * @returns Week number (1-53)
 */
export function getWeekNumber(dateString: string): number {
    const date = new Date(dateString);
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

/**
 * Get start and end dates of a week
 * @param dateString - Any date in the week (YYYY-MM-DD format)
 * @returns Object with startDate and endDate (YYYY-MM-DD format)
 */
export function getWeekRange(dateString: string): {
    startDate: string;
    endDate: string;
} {
    const date = new Date(dateString);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday

    const startDate = new Date(date.setDate(diff));
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
    };
}
