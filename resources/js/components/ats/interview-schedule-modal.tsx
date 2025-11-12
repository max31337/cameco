import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { InterviewLocationType } from '@/types/ats-pages';

interface ScheduleInterviewData {
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  location_type: InterviewLocationType;
}

interface InterviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ScheduleInterviewData) => Promise<void>;
  candidateName: string;
  applicationId: number;
}

/**
 * Interview Schedule Modal
 * Reusable modal for scheduling interviews with date, time, location type, and duration
 */
export function InterviewScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  candidateName,
  applicationId,
}: InterviewScheduleModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ScheduleInterviewData>({
    scheduled_date: '',
    scheduled_time: '',
    duration_minutes: 30,
    location_type: 'office',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.scheduled_date) {
      newErrors.scheduled_date = 'Interview date is required';
    }

    if (!formData.scheduled_time) {
      newErrors.scheduled_time = 'Interview time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        scheduled_date: '',
        scheduled_time: '',
        duration_minutes: 30,
        location_type: 'office',
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>
            Schedule an interview with {candidateName} for application #{applicationId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Interview Date */}
          <div className="space-y-2">
            <Label htmlFor="interview-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Interview Date
            </Label>
            <Input
              id="interview-date"
              type="date"
              value={formData.scheduled_date}
              onChange={(e) => handleChange('scheduled_date', e.target.value)}
              className={errors.scheduled_date ? 'border-red-500' : ''}
            />
            {errors.scheduled_date && (
              <p className="text-xs text-red-500">{errors.scheduled_date}</p>
            )}
          </div>

          {/* Interview Time */}
          <div className="space-y-2">
            <Label htmlFor="interview-time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Interview Time
            </Label>
            <Input
              id="interview-time"
              type="time"
              value={formData.scheduled_time}
              onChange={(e) => handleChange('scheduled_time', e.target.value)}
              className={errors.scheduled_time ? 'border-red-500' : ''}
            />
            {errors.scheduled_time && (
              <p className="text-xs text-red-500">{errors.scheduled_time}</p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Duration (minutes)
            </Label>
            <Select
              value={String(formData.duration_minutes)}
              onValueChange={(value) => handleChange('duration_minutes', parseInt(value))}
            >
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Type */}
          <div className="space-y-2">
            <Label htmlFor="location-type" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Interview Location
            </Label>
            <Select
              value={formData.location_type}
              onValueChange={(value) =>
                handleChange('location_type', value as InterviewLocationType)
              }
            >
              <SelectTrigger id="location-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="video_call">Video Call</SelectItem>
                <SelectItem value="phone">Phone Call</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Scheduling...' : 'Schedule Interview'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
