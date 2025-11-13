/**
 * Office Hours Utility Functions
 * Handles office hours validation and conflict checking
 */

import type { Interview } from '@/types/ats-pages';

// Office hours constants (9 AM to 6 PM, Monday-Friday)
export const OFFICE_HOURS_START = 9; // 9 AM
export const OFFICE_HOURS_END = 18; // 6 PM (18:00)
export const OFFICE_DAYS = [1, 2, 3, 4, 5]; // Monday (1) to Friday (5)

/**
 * Parse time string to hour and minute
 * Supports both "HH:MM" and "HH:MM AM/PM" formats
 */
export function parseTimeToHourMinute(timeStr: string): { hour: number; minute: number } | null {
  const timeRegex = /(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i;
  const match = timeStr.match(timeRegex);

  if (!match) return null;

  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const meridiem = match[3]?.toUpperCase();

  // Convert to 24-hour format if AM/PM is provided
  if (meridiem) {
    if (meridiem === 'PM' && hour !== 12) {
      hour += 12;
    } else if (meridiem === 'AM' && hour === 12) {
      hour = 0;
    }
  }

  return { hour, minute };
}

/**
 * Convert hour and minute to time string in 24-hour format
 */
export function hourMinuteToString(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/**
 * Check if a date is a weekday
 */
export function isWeekday(date: Date): boolean {
  const dayOfWeek = date.getDay();
  // JavaScript: 0 = Sunday, 6 = Saturday
  // We need Monday (1) to Friday (5)
  return dayOfWeek >= 1 && dayOfWeek <= 5;
}

/**
 * Check if a time is within office hours
 */
export function isWithinOfficeHours(hour: number, minute: number): boolean {
  if (hour < OFFICE_HOURS_START) return false;
  if (hour >= OFFICE_HOURS_END) return false;
  // If it's the last hour (5 PM / 17:00), only allow if there are minutes left for at least 15 min interview
  if (hour === OFFICE_HOURS_END - 1) {
    return minute === 0; // Only exact hour boundary
  }
  return true;
}

/**
 * Check if an interview fits within office hours
 */
export function checkInterviewFitsOfficeHours(
  hour: number,
  minute: number,
  durationMinutes: number
): boolean {
  if (!isWithinOfficeHours(hour, minute)) return false;

  let endHour = hour;
  let endMinute = minute + durationMinutes;

  if (endMinute >= 60) {
    endHour += Math.floor(endMinute / 60);
    endMinute = endMinute % 60;
  }

  // Check if end time exceeds office hours
  return endHour < OFFICE_HOURS_END;
}

/**
 * Check if two time ranges conflict
 */
export function hasTimeConflict(
  startHour1: number,
  startMinute1: number,
  duration1: number,
  startHour2: number,
  startMinute2: number,
  duration2: number
): boolean {
  // Convert both to minutes since start of day for easier comparison
  const start1 = startHour1 * 60 + startMinute1;
  const end1 = start1 + duration1;

  const start2 = startHour2 * 60 + startMinute2;
  const end2 = start2 + duration2;

  // Check if there's any overlap
  return !(end1 <= start2 || end2 <= start1);
}

/**
 * Get available time slots for a specific date
 * Returns array of available start times (HH:MM format)
 */
export function getAvailableTimeSlots(
  date: Date,
  interviews: Interview[],
  slotDurationMinutes: number = 30,
  interviewDurationMinutes: number = 30
): string[] {
  if (!isWeekday(date)) {
    return []; // No slots available on weekends
  }

  // Get all interviews on this date
  const dayInterviews = interviews.filter((interview) => {
    const interviewDate = new Date(interview.scheduled_date);
    return (
      interviewDate.getFullYear() === date.getFullYear() &&
      interviewDate.getMonth() === date.getMonth() &&
      interviewDate.getDate() === date.getDate()
    );
  });

  const availableSlots: string[] = [];

  // Check each 30-minute slot from 9 AM to 6 PM
  for (let hour = OFFICE_HOURS_START; hour < OFFICE_HOURS_END; hour++) {
    for (let minute = 0; minute < 60; minute += slotDurationMinutes) {
      // Check if this slot + interview duration fits within office hours
      if (!checkInterviewFitsOfficeHours(hour, minute, interviewDurationMinutes)) {
        continue;
      }

      // Check for conflicts with existing interviews
      const timeStr = hourMinuteToString(hour, minute);
      const hasConflict = dayInterviews.some((interview) => {
        const interviewTime = parseTimeToHourMinute(interview.scheduled_time);
        if (!interviewTime) return false;

        return hasTimeConflict(
          hour,
          minute,
          interviewDurationMinutes,
          interviewTime.hour,
          interviewTime.minute,
          interview.duration_minutes
        );
      });

      if (!hasConflict) {
        availableSlots.push(timeStr);
      }
    }
  }

  return availableSlots;
}

/**
 * Check if there are any available slots on a given date
 */
export function hasAvailableSlots(
  date: Date,
  interviews: Interview[],
  interviewDurationMinutes: number = 30
): boolean {
  return getAvailableTimeSlots(date, interviews, 30, interviewDurationMinutes).length > 0;
}

/**
 * Convert 24-hour format time to 12-hour AM/PM format
 */
export function formatTimeToAMPM(hour: number, minute: number): string {
  const meridiem = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${String(minute).padStart(2, '0')} ${meridiem}`;
}
