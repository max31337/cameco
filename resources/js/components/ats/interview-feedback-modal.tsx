import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Interview {
  id: number;
  candidate_name: string;
  job_title: string;
  scheduled_date: string;
  scheduled_time: string;
  interviewer_name: string;
}

interface InterviewFeedbackFormData {
  overall_score: number;
  recommendation: 'hire' | 'pending' | 'reject';
  feedback: string;
  strengths?: string;
  weaknesses?: string;
  technical_skills?: number;
  communication_skills?: number;
  cultural_fit?: number;
  interviewer_notes?: string;
}

interface InterviewFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InterviewFeedbackFormData) => Promise<void>;
  interview: Interview | null;
}

const STORAGE_KEY_PREFIX = 'interview_feedback_draft_';

const getScoreLabel = (score: number): string => {
  if (score <= 3) return 'Poor';
  if (score <= 6) return 'Average';
  if (score <= 8) return 'Good';
  return 'Excellent';
};

export function InterviewFeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  interview,
}: InterviewFeedbackModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<InterviewFeedbackFormData>({
    overall_score: 5,
    recommendation: 'pending',
    feedback: '',
    strengths: '',
    weaknesses: '',
    technical_skills: 5,
    communication_skills: 5,
    cultural_fit: 5,
    interviewer_notes: '',
  });

  // Load draft from localStorage on mount or when interview changes
  useEffect(() => {
    if (isOpen && interview) {
      const draftKey = `${STORAGE_KEY_PREFIX}${interview.id}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          setFormData(JSON.parse(savedDraft));
        } catch (e) {
          console.error('Failed to load draft:', e);
        }
      }
    }
  }, [isOpen, interview]);

  // Auto-save to localStorage
  useEffect(() => {
    if (interview && isOpen) {
      const draftKey = `${STORAGE_KEY_PREFIX}${interview.id}`;
      localStorage.setItem(draftKey, JSON.stringify(formData));
    }
  }, [formData, interview, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.feedback.trim() || formData.feedback.trim().length < 50) {
      alert('Feedback must be at least 50 characters long');
      return;
    }

    if (!formData.recommendation) {
      alert('Please select a recommendation');
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit(formData);

      // Clear draft after successful submission
      if (interview) {
        const draftKey = `${STORAGE_KEY_PREFIX}${interview.id}`;
        localStorage.removeItem(draftKey);
      }

      // Reset form
      setFormData({
        overall_score: 5,
        recommendation: 'pending',
        feedback: '',
        strengths: '',
        weaknesses: '',
        technical_skills: 5,
        communication_skills: 5,
        cultural_fit: 5,
        interviewer_notes: '',
      });

      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!interview) return null;

  const feedbackLength = formData.feedback.length;
  const feedbackMinMet = feedbackLength >= 50;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Interview Feedback</DialogTitle>
          <DialogDescription>
            Provide feedback for {interview.candidate_name} - {interview.job_title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Interview Details Header */}
          <Card className="bg-slate-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-slate-600">Candidate</p>
                  <p className="text-slate-900">{interview.candidate_name}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-600">Job Title</p>
                  <p className="text-slate-900">{interview.job_title}</p>
                </div>
                <div>
                  <p className="font-medium text-slate-600">Date & Time</p>
                  <p className="text-slate-900">
                    {interview.scheduled_date} at {interview.scheduled_time}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-slate-600">Interviewer</p>
                  <p className="text-slate-900">{interview.interviewer_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Score */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Overall Score</Label>
              <span className="text-2xl font-bold text-blue-600">
                {formData.overall_score}/10
              </span>
            </div>
            <p className="text-sm text-slate-600">
              {getScoreLabel(formData.overall_score)}
            </p>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.overall_score}
              onChange={(e) =>
                setFormData({ ...formData, overall_score: parseInt(e.target.value) })
              }
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>1 - Poor</span>
              <span>10 - Excellent</span>
            </div>
          </div>

          {/* Recommendation - Buttons */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Recommendation</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    recommendation: 'hire',
                  })
                }
                className={`px-4 py-2 rounded-lg font-medium border-2 transition ${
                  formData.recommendation === 'hire'
                    ? 'border-green-600 bg-green-50 text-green-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                ✓ Hire
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    recommendation: 'pending',
                  })
                }
                className={`px-4 py-2 rounded-lg font-medium border-2 transition ${
                  formData.recommendation === 'pending'
                    ? 'border-yellow-600 bg-yellow-50 text-yellow-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                ⏸ Pending
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    recommendation: 'reject',
                  })
                }
                className={`px-4 py-2 rounded-lg font-medium border-2 transition ${
                  formData.recommendation === 'reject'
                    ? 'border-red-600 bg-red-50 text-red-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                ✗ Reject
              </button>
            </div>
          </div>

          {/* Feedback Textarea (Required) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="feedback" className="text-base font-semibold">
                Feedback <span className="text-red-500">*</span>
              </Label>
              <span
                className={`text-sm ${
                  feedbackMinMet ? 'text-green-600' : 'text-amber-600'
                }`}
              >
                {feedbackLength}/50 min
              </span>
            </div>
            <Textarea
              id="feedback"
              placeholder="Provide detailed feedback about the interview. Minimum 50 characters required."
              value={formData.feedback}
              onChange={(e) =>
                setFormData({ ...formData, feedback: e.target.value })
              }
              className="min-h-24 resize-none"
              maxLength={1000}
            />
            <p className="text-xs text-slate-500">
              {formData.feedback.length}/1000 characters
            </p>
          </div>

          {/* Strengths (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="strengths" className="text-sm font-medium">
              Strengths <span className="text-slate-500">(Optional)</span>
            </Label>
            <Textarea
              id="strengths"
              placeholder="What were the candidate's key strengths?"
              value={formData.strengths || ''}
              onChange={(e) =>
                setFormData({ ...formData, strengths: e.target.value })
              }
              className="min-h-20 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-slate-500">
              {(formData.strengths || '').length}/500 characters
            </p>
          </div>

          {/* Weaknesses (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="weaknesses" className="text-sm font-medium">
              Weaknesses <span className="text-slate-500">(Optional)</span>
            </Label>
            <Textarea
              id="weaknesses"
              placeholder="What areas need improvement?"
              value={formData.weaknesses || ''}
              onChange={(e) =>
                setFormData({ ...formData, weaknesses: e.target.value })
              }
              className="min-h-20 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-slate-500">
              {(formData.weaknesses || '').length}/500 characters
            </p>
          </div>

          {/* Skill Assessments (Optional) */}
          <div className="space-y-4 rounded-lg border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">
              Skill Assessments <span className="text-slate-500">(Optional)</span>
            </h3>

            {/* Technical Skills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Technical Skills</Label>
                <span className="text-sm font-semibold text-blue-600">
                  {formData.technical_skills || 5}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.technical_skills || 5}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, technical_skills: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Communication Skills */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Communication Skills
                </Label>
                <span className="text-sm font-semibold text-blue-600">
                  {formData.communication_skills || 5}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.communication_skills || 5}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, communication_skills: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Cultural Fit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Cultural Fit</Label>
                <span className="text-sm font-semibold text-blue-600">
                  {formData.cultural_fit || 5}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.cultural_fit || 5}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, cultural_fit: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Interviewer Notes (Private to HR) */}
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <Label htmlFor="interviewer_notes" className="text-sm font-medium">
              Private Interviewer Notes{' '}
              <span className="text-slate-500">(Only visible to HR)</span>
            </Label>
            <Textarea
              id="interviewer_notes"
              placeholder="Internal notes - not visible to candidates or other interviewers"
              value={formData.interviewer_notes || ''}
              onChange={(e) =>
                setFormData({ ...formData, interviewer_notes: e.target.value })
              }
              className="min-h-20 resize-none bg-white"
              maxLength={500}
            />
            <p className="text-xs text-slate-500">
              {(formData.interviewer_notes || '').length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !feedbackMinMet || !formData.recommendation}
              className="min-w-32"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </div>

          {/* Auto-save Indicator */}
          <p className="text-center text-xs text-slate-500">
            Your responses are auto-saved to your browser
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
