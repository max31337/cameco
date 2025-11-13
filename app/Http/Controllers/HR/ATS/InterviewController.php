<?php

namespace App\Http\Controllers\HR\ATS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InterviewController extends Controller
{
    // Office hours: 9 AM to 6 PM (Monday-Friday)
    private const OFFICE_HOURS_START = 9;      // 9 AM
    private const OFFICE_HOURS_END = 18;       // 6 PM
    private const OFFICE_HOURS_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday (1-5)

    /**
     * Validate if interview time falls within office hours.
     * 
     * @param string $date Interview date (YYYY-MM-DD format)
     * @param string $time Interview time (HH:MM format or with AM/PM)
     * @param int $durationMinutes Interview duration in minutes
     * @return array ['valid' => bool, 'message' => string]
     */
    private function validateOfficeHours(string $date, string $time, int $durationMinutes): array
    {
        // Parse the date
        $dateObj = \DateTime::createFromFormat('Y-m-d', $date);
        if (!$dateObj) {
            return ['valid' => false, 'message' => 'Invalid date format'];
        }

        // Check if it's a weekday (Monday-Friday)
        $dayOfWeek = (int)$dateObj->format('N');
        if (!in_array($dayOfWeek, self::OFFICE_HOURS_DAYS)) {
            return ['valid' => false, 'message' => 'Interviews can only be scheduled on weekdays (Monday-Friday)'];
        }

        // Parse the time
        $timeStr = trim($time);
        
        // Handle both "HH:MM AM/PM" and "HH:MM" formats
        if (preg_match('/(\d{1,2}):(\d{2})\s*(AM|PM)?/i', $timeStr, $matches)) {
            $hour = (int)$matches[1];
            $minute = (int)$matches[2];
            $meridiem = $matches[3] ?? null;

            // Convert to 24-hour format if AM/PM provided
            if ($meridiem) {
                if (strtoupper($meridiem) === 'PM' && $hour !== 12) {
                    $hour += 12;
                } elseif (strtoupper($meridiem) === 'AM' && $hour === 12) {
                    $hour = 0;
                }
            }
        } else {
            return ['valid' => false, 'message' => 'Invalid time format'];
        }

        // Calculate end time
        $endHour = $hour;
        $endMinute = $minute + $durationMinutes;

        if ($endMinute >= 60) {
            $endHour += (int)floor($endMinute / 60);
            $endMinute = $endMinute % 60;
        }

        // Check if start time is within office hours
        if ($hour < self::OFFICE_HOURS_START || $hour >= self::OFFICE_HOURS_END) {
            return [
                'valid' => false,
                'message' => sprintf(
                    'Interview start time must be between %d:00 AM and %d:00 PM',
                    self::OFFICE_HOURS_START,
                    self::OFFICE_HOURS_END
                )
            ];
        }

        // Check if end time exceeds office hours
        if ($endHour > self::OFFICE_HOURS_END) {
            return [
                'valid' => false,
                'message' => sprintf(
                    'Interview end time (%d:%02d) exceeds office hours (ends at %d:00 PM). Duration is too long.',
                    $endHour,
                    $endMinute,
                    self::OFFICE_HOURS_END
                )
            ];
        }

        return ['valid' => true, 'message' => 'Time slot is available'];
    }

    /**
     * Display a listing of interviews.
     */
    public function index(Request $request): Response
    {
        // Mock data: 20+ interviews with multiple scheduled per day
        $interviews = [
            // ===== November 15 - 3 scheduled interviews =====
            [
                'id' => 1,
                'application_id' => 1,
                'candidate_name' => 'John Doe',
                'candidate_id' => 101,
                'job_id' => 1,
                'job_title' => 'Senior Software Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-15',
                'scheduled_time' => '10:00 AM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'location' => 'Conference Room A',
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'status' => 'scheduled',
                'notes' => 'First technical round',
                'created_at' => '2025-11-08',
                'updated_at' => '2025-11-08',
            ],
            [
                'id' => 2,
                'application_id' => 3,
                'candidate_name' => 'Jane Smith',
                'candidate_id' => 103,
                'job_id' => 2,
                'job_title' => 'Marketing Manager',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-15',
                'scheduled_time' => '11:30 AM',
                'duration_minutes' => 45,
                'location_type' => 'video_call',
                'location' => 'Zoom Meeting',
                'meeting_link' => 'https://zoom.us/j/123456789',
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'status' => 'scheduled',
                'notes' => 'Initial HR screening',
                'created_at' => '2025-11-07',
                'updated_at' => '2025-11-07',
            ],
            [
                'id' => 3,
                'application_id' => 5,
                'candidate_name' => 'Robert Martinez',
                'candidate_id' => 105,
                'job_id' => 1,
                'job_title' => 'Senior Software Engineer',
                'interview_type' => 'panel',
                'scheduled_date' => '2025-11-15',
                'scheduled_time' => '2:00 PM',
                'duration_minutes' => 90,
                'location_type' => 'office',
                'location' => 'Finance Department',
                'interviewer_name' => 'Emily Davis, David Wilson',
                'interviewer_id' => 12,
                'status' => 'scheduled',
                'notes' => 'Panel interview with finance team',
                'created_at' => '2025-11-05',
                'updated_at' => '2025-11-05',
            ],
            // ===== November 14 - 3 scheduled interviews =====
            [
                'id' => 4,
                'application_id' => 7,
                'candidate_name' => 'Lisa Anderson',
                'candidate_id' => 107,
                'job_id' => 3,
                'job_title' => 'HR Coordinator',
                'interview_type' => 'behavioral',
                'scheduled_date' => '2025-11-14',
                'scheduled_time' => '9:00 AM',
                'duration_minutes' => 45,
                'location_type' => 'office',
                'location' => 'HR Office',
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'status' => 'scheduled',
                'notes' => 'Behavioral assessment',
                'created_at' => '2025-11-04',
                'updated_at' => '2025-11-04',
            ],
            [
                'id' => 5,
                'application_id' => 2,
                'candidate_name' => 'Michael Brown',
                'candidate_id' => 102,
                'job_id' => 1,
                'job_title' => 'Senior Software Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-14',
                'scheduled_time' => '1:00 PM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'location' => 'Conference Room B',
                'interviewer_name' => 'James Wilson',
                'interviewer_id' => 15,
                'status' => 'scheduled',
                'notes' => 'Technical coding assessment',
                'created_at' => '2025-11-06',
                'updated_at' => '2025-11-06',
            ],
            [
                'id' => 6,
                'application_id' => 8,
                'candidate_name' => 'Patricia Garcia',
                'candidate_id' => 108,
                'job_id' => 4,
                'job_title' => 'Customer Service Representative',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-14',
                'scheduled_time' => '3:30 PM',
                'duration_minutes' => 45,
                'location_type' => 'video_call',
                'location' => 'Teams Meeting',
                'meeting_link' => 'https://teams.microsoft.com/l/meetup-join/123',
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'status' => 'scheduled',
                'notes' => 'Customer service evaluation',
                'created_at' => '2025-11-09',
                'updated_at' => '2025-11-09',
            ],
            // ===== November 10 - 2 completed interviews =====
            [
                'id' => 7,
                'application_id' => 10,
                'candidate_name' => 'Thomas Wilson',
                'candidate_id' => 110,
                'job_id' => 5,
                'job_title' => 'Product Manager',
                'interview_type' => 'panel',
                'scheduled_date' => '2025-11-10',
                'scheduled_time' => '10:00 AM',
                'duration_minutes' => 90,
                'location_type' => 'office',
                'location' => 'Executive Suite',
                'interviewer_name' => 'Emily Davis, David Wilson',
                'interviewer_id' => 12,
                'status' => 'completed',
                'notes' => 'Final round interview',
                'feedback' => 'Excellent product vision and strategic thinking',
                'score' => 9,
                'recommendation' => 'hire',
                'created_at' => '2025-11-05',
                'updated_at' => '2025-11-10',
                'completed_at' => '2025-11-10',
            ],
            [
                'id' => 8,
                'application_id' => 11,
                'candidate_name' => 'Christina Lee',
                'candidate_id' => 111,
                'job_id' => 6,
                'job_title' => 'UX Designer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-10',
                'scheduled_time' => '2:00 PM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'location' => 'Design Studio',
                'interviewer_name' => 'James Wilson',
                'interviewer_id' => 15,
                'status' => 'completed',
                'notes' => 'Portfolio review and design challenge',
                'feedback' => 'Strong design skills, needs more UX research experience',
                'score' => 7,
                'recommendation' => 'pending',
                'created_at' => '2025-11-03',
                'updated_at' => '2025-11-10',
                'completed_at' => '2025-11-10',
            ],
            // ===== November 16 - 3 scheduled interviews =====
            [
                'id' => 9,
                'application_id' => 12,
                'candidate_name' => 'Daniel Rodriguez',
                'candidate_id' => 112,
                'job_id' => 7,
                'job_title' => 'DevOps Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-16',
                'scheduled_time' => '9:00 AM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'location' => 'Conference Room A',
                'interviewer_name' => 'James Wilson',
                'interviewer_id' => 15,
                'status' => 'scheduled',
                'notes' => 'Infrastructure discussion',
                'created_at' => '2025-11-09',
                'updated_at' => '2025-11-09',
            ],
            [
                'id' => 10,
                'application_id' => 13,
                'candidate_name' => 'Sarah Thompson',
                'candidate_id' => 113,
                'job_id' => 8,
                'job_title' => 'Data Analyst',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-16',
                'scheduled_time' => '10:45 AM',
                'duration_minutes' => 60,
                'location_type' => 'video_call',
                'location' => 'Google Meet',
                'meeting_link' => 'https://meet.google.com/abc-defg-hij',
                'interviewer_name' => 'David Wilson',
                'interviewer_id' => 20,
                'status' => 'scheduled',
                'notes' => 'SQL and analytics assessment',
                'created_at' => '2025-11-09',
                'updated_at' => '2025-11-09',
            ],
            [
                'id' => 11,
                'application_id' => 14,
                'candidate_name' => 'James Martinez',
                'candidate_id' => 114,
                'job_id' => 1,
                'job_title' => 'Senior Software Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-16',
                'scheduled_time' => '2:00 PM',
                'duration_minutes' => 75,
                'location_type' => 'office',
                'location' => 'Conference Room B',
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'status' => 'scheduled',
                'notes' => 'API design and architecture discussion',
                'created_at' => '2025-11-08',
                'updated_at' => '2025-11-08',
            ],
            // ===== November 12 - 2 interviews (1 cancelled, 1 scheduled) =====
            [
                'id' => 12,
                'application_id' => 15,
                'candidate_name' => 'Angela White',
                'candidate_id' => 115,
                'job_id' => 9,
                'job_title' => 'Business Analyst',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-12',
                'scheduled_time' => '10:00 AM',
                'duration_minutes' => 45,
                'location_type' => 'video_call',
                'location' => 'Zoom Meeting',
                'meeting_link' => 'https://zoom.us/j/987654321',
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'status' => 'cancelled',
                'notes' => 'Initial HR screening',
                'cancellation_reason' => 'Candidate requested reschedule',
                'created_at' => '2025-11-06',
                'updated_at' => '2025-11-11',
                'cancelled_at' => '2025-11-11',
            ],
            [
                'id' => 13,
                'application_id' => 16,
                'candidate_name' => 'Kevin Johnson',
                'candidate_id' => 116,
                'job_id' => 10,
                'job_title' => 'QA Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-12',
                'scheduled_time' => '1:30 PM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'location' => 'Conference Room A',
                'interviewer_name' => 'James Wilson',
                'interviewer_id' => 15,
                'status' => 'scheduled',
                'notes' => 'QA testing framework discussion',
                'created_at' => '2025-11-08',
                'updated_at' => '2025-11-08',
            ],
            // ===== Additional single interviews on different dates =====
            [
                'id' => 14,
                'application_id' => 17,
                'candidate_name' => 'Christopher Lee',
                'candidate_id' => 117,
                'job_id' => 11,
                'job_title' => 'Project Manager',
                'interview_type' => 'panel',
                'scheduled_date' => '2025-11-17',
                'scheduled_time' => '10:30 AM',
                'duration_minutes' => 75,
                'location_type' => 'office',
                'location' => 'Conference Room C',
                'interviewer_name' => 'David Wilson, Emily Davis',
                'interviewer_id' => 12,
                'status' => 'scheduled',
                'notes' => 'Final round interview',
                'created_at' => '2025-11-08',
                'updated_at' => '2025-11-08',
            ],
            [
                'id' => 15,
                'application_id' => 18,
                'candidate_name' => 'Amanda White',
                'candidate_id' => 118,
                'job_id' => 2,
                'job_title' => 'Marketing Manager',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-08',
                'scheduled_time' => '2:30 PM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'location' => 'Marketing Department',
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'status' => 'completed',
                'notes' => 'Marketing strategy assessment',
                'feedback' => 'Creative thinking, strong portfolio, good presentation skills',
                'score' => 9,
                'recommendation' => 'hire',
                'created_at' => '2025-11-03',
                'updated_at' => '2025-11-08',
                'completed_at' => '2025-11-08',
            ],
            [
                'id' => 16,
                'application_id' => 19,
                'candidate_name' => 'Daniel Thomas',
                'candidate_id' => 119,
                'job_id' => 8,
                'job_title' => 'Data Analyst',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-11',
                'scheduled_time' => '4:00 PM',
                'duration_minutes' => 45,
                'location_type' => 'video_call',
                'location' => 'Zoom Meeting',
                'meeting_link' => 'https://zoom.us/j/111111111',
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'status' => 'no_show',
                'notes' => 'Candidate did not attend',
                'created_at' => '2025-11-06',
                'updated_at' => '2025-11-11',
            ],
            [
                'id' => 17,
                'application_id' => 20,
                'candidate_name' => 'Jessica Martinez',
                'candidate_id' => 120,
                'job_id' => 7,
                'job_title' => 'DevOps Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-18',
                'scheduled_time' => '11:00 AM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'location' => 'IT Department',
                'interviewer_name' => 'James Wilson',
                'interviewer_id' => 15,
                'status' => 'scheduled',
                'notes' => 'Technical skills assessment',
                'created_at' => '2025-11-09',
                'updated_at' => '2025-11-09',
            ],
            [
                'id' => 18,
                'application_id' => 21,
                'candidate_name' => 'David Rodriguez',
                'candidate_id' => 121,
                'job_id' => 12,
                'job_title' => 'Sales Executive',
                'interview_type' => 'behavioral',
                'scheduled_date' => '2025-11-07',
                'scheduled_time' => '1:30 PM',
                'duration_minutes' => 50,
                'location_type' => 'office',
                'location' => 'Sales Office',
                'interviewer_name' => 'Emily Davis',
                'interviewer_id' => 12,
                'status' => 'completed',
                'notes' => 'Sales role play and behavioral questions',
                'feedback' => 'Good interpersonal skills, needs improvement in closing techniques',
                'score' => 6,
                'recommendation' => 'reject',
                'created_at' => '2025-11-02',
                'updated_at' => '2025-11-07',
                'completed_at' => '2025-11-07',
            ],
            [
                'id' => 19,
                'application_id' => 22,
                'candidate_name' => 'Sarah Jackson',
                'candidate_id' => 122,
                'job_id' => 3,
                'job_title' => 'HR Coordinator',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-19',
                'scheduled_time' => '10:00 AM',
                'duration_minutes' => 45,
                'location_type' => 'office',
                'location' => 'HR Office',
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'status' => 'scheduled',
                'notes' => 'Initial screening',
                'created_at' => '2025-11-10',
                'updated_at' => '2025-11-10',
            ],
            [
                'id' => 20,
                'application_id' => 23,
                'candidate_name' => 'Kevin Brown',
                'candidate_id' => 123,
                'job_id' => 13,
                'job_title' => 'Operations Manager',
                'interview_type' => 'panel',
                'scheduled_date' => '2025-11-20',
                'scheduled_time' => '2:00 PM',
                'duration_minutes' => 90,
                'location_type' => 'office',
                'location' => 'Operations Center',
                'interviewer_name' => 'David Wilson, James Wilson',
                'interviewer_id' => 12,
                'status' => 'scheduled',
                'notes' => 'Operations leadership assessment',
                'created_at' => '2025-11-10',
                'updated_at' => '2025-11-10',
            ],
            [
                'id' => 21,
                'application_id' => 24,
                'candidate_name' => 'Michelle Davis',
                'candidate_id' => 124,
                'job_id' => 4,
                'job_title' => 'Customer Service Representative',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-13',
                'scheduled_time' => '3:30 PM',
                'duration_minutes' => 45,
                'location_type' => 'office',
                'location' => 'Customer Service Dept',
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'status' => 'scheduled',
                'notes' => 'Customer service skills evaluation',
                'created_at' => '2025-11-08',
                'updated_at' => '2025-11-08',
            ],
            [
                'id' => 22,
                'application_id' => 25,
                'candidate_name' => 'Brian Wilson',
                'candidate_id' => 125,
                'job_id' => 11,
                'job_title' => 'Project Manager',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-06',
                'scheduled_time' => '11:30 AM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'location' => 'Project Management Office',
                'interviewer_name' => 'Emily Davis',
                'interviewer_id' => 12,
                'status' => 'completed',
                'notes' => 'Project management methodology assessment',
                'feedback' => 'Strong PMP background, excellent organizational skills',
                'score' => 8,
                'recommendation' => 'hire',
                'created_at' => '2025-11-01',
                'updated_at' => '2025-11-06',
                'completed_at' => '2025-11-06',
            ],
        ];

        // Filter by status if provided
        $statusFilter = $request->query('status');
        if ($statusFilter) {
            $interviews = array_filter($interviews, function ($interview) use ($statusFilter) {
                return $interview['status'] === $statusFilter;
            });
        }

        // Filter by interview type if provided
        $typeFilter = $request->query('interview_type');
        if ($typeFilter) {
            $interviews = array_filter($interviews, function ($interview) use ($typeFilter) {
                return $interview['interview_type'] === $typeFilter;
            });
        }

        // Search filter
        $search = $request->query('search');
        if ($search) {
            $interviews = array_filter($interviews, function ($interview) use ($search) {
                return stripos($interview['candidate_name'], $search) !== false ||
                       stripos($interview['job_title'], $search) !== false;
            });
        }

        // Statistics
        $statistics = [
            'total_interviews' => count($interviews),
            'scheduled' => count(array_filter($interviews, fn($i) => $i['status'] === 'scheduled')),
            'completed' => count(array_filter($interviews, fn($i) => $i['status'] === 'completed')),
            'cancelled' => count(array_filter($interviews, fn($i) => $i['status'] === 'cancelled')),
            'no_show' => count(array_filter($interviews, fn($i) => $i['status'] === 'no_show')),
            'upcoming_this_week' => 8,
        ];

        // Available interviewers
        $interviewers = [
            ['id' => 5, 'name' => 'Sarah Johnson', 'department' => 'Human Resources'],
            ['id' => 8, 'name' => 'Michael Chen', 'department' => 'Human Resources'],
            ['id' => 12, 'name' => 'Emily Davis', 'department' => 'Finance'],
            ['id' => 15, 'name' => 'James Wilson', 'department' => 'IT'],
            ['id' => 20, 'name' => 'David Wilson', 'department' => 'Operations'],
        ];

        return Inertia::render('HR/ATS/Interviews/Index', [
            'interviews' => $interviews,
            'statistics' => $statistics,
            'interviewers' => $interviewers,
            'filters' => [
                'search' => $search,
                'status' => $statusFilter,
                'interview_type' => $typeFilter,
            ],
            'interview_types' => [
                ['value' => 'hr', 'label' => 'HR Screening'],
                ['value' => 'technical', 'label' => 'Technical'],
                ['value' => 'behavioral', 'label' => 'Behavioral'],
                ['value' => 'panel', 'label' => 'Panel Interview'],
            ],
            'interview_statuses' => [
                ['value' => 'scheduled', 'label' => 'Scheduled'],
                ['value' => 'completed', 'label' => 'Completed'],
                ['value' => 'cancelled', 'label' => 'Cancelled'],
                ['value' => 'no_show', 'label' => 'No Show'],
            ],
            'breadcrumbs' => [
                ['label' => 'HR', 'href' => route('hr.dashboard')],
                ['label' => 'ATS', 'href' => route('hr.ats.job-postings.index')],
                ['label' => 'Interviews', 'href' => null],
            ],
        ]);
    }

    /**
     * Display a specific interview.
     */
    public function show($id): Response
    {
        // Mock data: Get the interview from the index mock data
        $allInterviews = [
            [
                'id' => 1,
                'application_id' => 1,
                'candidate_name' => 'John Doe',
                'job_title' => 'Senior Software Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-15',
                'scheduled_time' => '10:00 AM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'meeting_link' => null,
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'status' => 'scheduled',
                'notes' => 'First technical round',
                'score' => null,
                'feedback' => null,
                'recommendation' => null,
                'strengths' => null,
                'weaknesses' => null,
                'technical_skills_score' => null,
                'communication_score' => null,
                'cultural_fit_score' => null,
                'interviewer_notes' => null,
                'created_at' => '2025-11-08',
                'completed_at' => null,
                'cancelled_at' => null,
            ],
            [
                'id' => 2,
                'application_id' => 3,
                'candidate_name' => 'Jane Smith',
                'job_title' => 'Marketing Manager',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-14',
                'scheduled_time' => '2:00 PM',
                'duration_minutes' => 45,
                'location_type' => 'video_call',
                'meeting_link' => 'https://zoom.us/j/123456789',
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'status' => 'scheduled',
                'notes' => 'Initial HR screening',
                'score' => null,
                'feedback' => null,
                'recommendation' => null,
                'strengths' => null,
                'weaknesses' => null,
                'technical_skills_score' => null,
                'communication_score' => null,
                'cultural_fit_score' => null,
                'interviewer_notes' => null,
                'created_at' => '2025-11-07',
                'completed_at' => null,
                'cancelled_at' => null,
            ],
            [
                'id' => 3,
                'application_id' => 5,
                'candidate_name' => 'Robert Martinez',
                'job_title' => 'Financial Analyst',
                'interview_type' => 'panel',
                'scheduled_date' => '2025-11-10',
                'scheduled_time' => '11:00 AM',
                'duration_minutes' => 90,
                'location_type' => 'office',
                'meeting_link' => null,
                'interviewer_name' => 'Emily Davis, David Wilson',
                'interviewer_id' => 12,
                'status' => 'completed',
                'notes' => 'Panel interview with finance team',
                'score' => 8,
                'feedback' => 'Strong analytical skills, good cultural fit. Demonstrated excellent problem-solving abilities and team collaboration.',
                'recommendation' => 'hire',
                'strengths' => 'Analytical thinking, attention to detail, excellent communication',
                'weaknesses' => 'Limited experience with advanced SQL queries',
                'technical_skills_score' => 8,
                'communication_score' => 9,
                'cultural_fit_score' => 8,
                'interviewer_notes' => 'Candidate impressed all panel members. Strong candidate for senior roles.',
                'created_at' => '2025-11-05',
                'completed_at' => '2025-11-10',
                'cancelled_at' => null,
            ],
            [
                'id' => 4,
                'application_id' => 7,
                'candidate_name' => 'Lisa Anderson',
                'job_title' => 'HR Coordinator',
                'interview_type' => 'behavioral',
                'scheduled_date' => '2025-11-09',
                'scheduled_time' => '3:00 PM',
                'duration_minutes' => 45,
                'location_type' => 'office',
                'meeting_link' => null,
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'status' => 'completed',
                'notes' => 'Behavioral assessment',
                'score' => 7,
                'feedback' => 'Excellent communication skills, lacks experience in HRIS systems. Good fit for entry-level HR role.',
                'recommendation' => 'pending',
                'strengths' => 'Communication, interpersonal skills, enthusiasm',
                'weaknesses' => 'Limited HRIS experience, needs training on systems',
                'technical_skills_score' => 5,
                'communication_score' => 8,
                'cultural_fit_score' => 8,
                'interviewer_notes' => 'Consider for HR Coordinator role with HRIS training program.',
                'created_at' => '2025-11-04',
                'completed_at' => '2025-11-09',
                'cancelled_at' => null,
            ],
            [
                'id' => 5,
                'application_id' => 2,
                'candidate_name' => 'Michael Brown',
                'job_title' => 'Senior Software Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-12',
                'scheduled_time' => '1:00 PM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'meeting_link' => null,
                'interviewer_name' => 'James Wilson',
                'interviewer_id' => 15,
                'status' => 'cancelled',
                'notes' => 'Candidate withdrew application',
                'score' => null,
                'feedback' => null,
                'recommendation' => null,
                'strengths' => null,
                'weaknesses' => null,
                'technical_skills_score' => null,
                'communication_score' => null,
                'cultural_fit_score' => null,
                'interviewer_notes' => null,
                'created_at' => '2025-11-03',
                'completed_at' => null,
                'cancelled_at' => '2025-11-11',
            ],
            [
                'id' => 6,
                'application_id' => 4,
                'candidate_name' => 'Sarah Williams',
                'job_title' => 'Product Manager',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-13',
                'scheduled_time' => '9:00 AM',
                'duration_minutes' => 60,
                'location_type' => 'video_call',
                'meeting_link' => 'https://zoom.us/j/987654321',
                'interviewer_name' => 'James Wilson',
                'interviewer_id' => 15,
                'status' => 'no_show',
                'notes' => 'Candidate did not attend the scheduled interview',
                'score' => null,
                'feedback' => null,
                'recommendation' => null,
                'strengths' => null,
                'weaknesses' => null,
                'technical_skills_score' => null,
                'communication_score' => null,
                'cultural_fit_score' => null,
                'interviewer_notes' => null,
                'created_at' => '2025-11-06',
                'completed_at' => null,
                'cancelled_at' => null,
            ],
            [
                'id' => 7,
                'application_id' => 6,
                'candidate_name' => 'David Garcia',
                'job_title' => 'UX Designer',
                'interview_type' => 'behavioral',
                'scheduled_date' => '2025-11-16',
                'scheduled_time' => '10:30 AM',
                'duration_minutes' => 45,
                'location_type' => 'office',
                'meeting_link' => null,
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'status' => 'scheduled',
                'notes' => 'Design discussion and portfolio review',
                'score' => null,
                'feedback' => null,
                'recommendation' => null,
                'strengths' => null,
                'weaknesses' => null,
                'technical_skills_score' => null,
                'communication_score' => null,
                'cultural_fit_score' => null,
                'interviewer_notes' => null,
                'created_at' => '2025-11-09',
                'completed_at' => null,
                'cancelled_at' => null,
            ],
            [
                'id' => 8,
                'application_id' => 8,
                'candidate_name' => 'Emma Rodriguez',
                'job_title' => 'Data Scientist',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-11',
                'scheduled_time' => '2:00 PM',
                'duration_minutes' => 90,
                'location_type' => 'video_call',
                'meeting_link' => 'https://zoom.us/j/456789123',
                'interviewer_name' => 'James Wilson',
                'interviewer_id' => 15,
                'status' => 'completed',
                'notes' => 'Technical assessment and project discussion',
                'score' => 9,
                'feedback' => 'Exceptional candidate with strong machine learning background. Highly recommended for immediate hire.',
                'recommendation' => 'hire',
                'strengths' => 'Machine learning expertise, strong mathematical foundation, excellent problem-solving',
                'weaknesses' => 'Limited experience with cloud platforms',
                'technical_skills_score' => 9,
                'communication_score' => 8,
                'cultural_fit_score' => 8,
                'interviewer_notes' => 'Fast-track for hire. Consider for senior data scientist role.',
                'created_at' => '2025-11-02',
                'completed_at' => '2025-11-11',
                'cancelled_at' => null,
            ],
            [
                'id' => 9,
                'application_id' => 9,
                'candidate_name' => 'Christopher Lee',
                'job_title' => 'DevOps Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-17',
                'scheduled_time' => '11:00 AM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'meeting_link' => null,
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'status' => 'scheduled',
                'notes' => 'Infrastructure and deployment assessment',
                'score' => null,
                'feedback' => null,
                'recommendation' => null,
                'strengths' => null,
                'weaknesses' => null,
                'technical_skills_score' => null,
                'communication_score' => null,
                'cultural_fit_score' => null,
                'interviewer_notes' => null,
                'created_at' => '2025-11-10',
                'completed_at' => null,
                'cancelled_at' => null,
            ],
            [
                'id' => 10,
                'application_id' => 10,
                'candidate_name' => 'Patricia Taylor',
                'job_title' => 'Business Analyst',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-18',
                'scheduled_time' => '3:30 PM',
                'duration_minutes' => 45,
                'location_type' => 'video_call',
                'meeting_link' => 'https://zoom.us/j/321654987',
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'status' => 'scheduled',
                'notes' => 'HR screening and culture fit discussion',
                'score' => null,
                'feedback' => null,
                'recommendation' => null,
                'strengths' => null,
                'weaknesses' => null,
                'technical_skills_score' => null,
                'communication_score' => null,
                'cultural_fit_score' => null,
                'interviewer_notes' => null,
                'created_at' => '2025-11-11',
                'completed_at' => null,
                'cancelled_at' => null,
            ],
            [
                'id' => 11,
                'application_id' => 11,
                'candidate_name' => 'Kevin Thompson',
                'job_title' => 'Quality Assurance Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-12',
                'scheduled_time' => '10:00 AM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'meeting_link' => null,
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'status' => 'completed',
                'notes' => 'QA automation and manual testing assessment',
                'score' => 7,
                'feedback' => 'Good understanding of QA processes and testing frameworks. Needs improvement in automation scripting.',
                'recommendation' => 'pending',
                'strengths' => 'Detail-oriented, methodical approach, good communication',
                'weaknesses' => 'Limited experience with CI/CD pipelines',
                'technical_skills_score' => 7,
                'communication_score' => 7,
                'cultural_fit_score' => 8,
                'interviewer_notes' => 'Consider for QA role with additional automation training.',
                'created_at' => '2025-11-05',
                'completed_at' => '2025-11-12',
                'cancelled_at' => null,
            ],
            [
                'id' => 12,
                'application_id' => 12,
                'candidate_name' => 'Nicole Anderson',
                'job_title' => 'Content Manager',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-14',
                'scheduled_time' => '1:00 PM',
                'duration_minutes' => 45,
                'location_type' => 'video_call',
                'meeting_link' => 'https://zoom.us/j/789456123',
                'interviewer_name' => 'Emily Davis',
                'interviewer_id' => 12,
                'status' => 'scheduled',
                'notes' => 'Content strategy and editorial management discussion',
                'score' => null,
                'feedback' => null,
                'recommendation' => null,
                'strengths' => null,
                'weaknesses' => null,
                'technical_skills_score' => null,
                'communication_score' => null,
                'cultural_fit_score' => null,
                'interviewer_notes' => null,
                'created_at' => '2025-11-09',
                'completed_at' => null,
                'cancelled_at' => null,
            ],
            [
                'id' => 13,
                'application_id' => 13,
                'candidate_name' => 'Marcus Johnson',
                'job_title' => 'Systems Administrator',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-19',
                'scheduled_time' => '2:30 PM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'meeting_link' => null,
                'interviewer_name' => 'James Wilson',
                'interviewer_id' => 15,
                'status' => 'scheduled',
                'notes' => 'System administration and infrastructure management',
                'score' => null,
                'feedback' => null,
                'recommendation' => null,
                'strengths' => null,
                'weaknesses' => null,
                'technical_skills_score' => null,
                'communication_score' => null,
                'cultural_fit_score' => null,
                'interviewer_notes' => null,
                'created_at' => '2025-11-10',
                'completed_at' => null,
                'cancelled_at' => null,
            ],
            [
                'id' => 14,
                'application_id' => 14,
                'candidate_name' => 'Michelle Davis',
                'job_title' => 'Customer Service Representative',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-13',
                'scheduled_time' => '3:30 PM',
                'duration_minutes' => 45,
                'location_type' => 'office',
                'meeting_link' => null,
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'status' => 'scheduled',
                'notes' => 'Customer service skills evaluation',
                'score' => null,
                'feedback' => null,
                'recommendation' => null,
                'strengths' => null,
                'weaknesses' => null,
                'technical_skills_score' => null,
                'communication_score' => null,
                'cultural_fit_score' => null,
                'interviewer_notes' => null,
                'created_at' => '2025-11-08',
                'completed_at' => null,
                'cancelled_at' => null,
            ],
            [
                'id' => 15,
                'application_id' => 15,
                'candidate_name' => 'Brian Wilson',
                'job_title' => 'Project Manager',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-06',
                'scheduled_time' => '11:30 AM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'meeting_link' => null,
                'interviewer_name' => 'Emily Davis',
                'interviewer_id' => 12,
                'status' => 'completed',
                'notes' => 'Project management methodology assessment',
                'score' => 8,
                'feedback' => 'Strong PMP background, excellent organizational skills. Ready for immediate hire.',
                'recommendation' => 'hire',
                'strengths' => 'Project management expertise, leadership skills, strategic thinking',
                'weaknesses' => 'Limited experience with Agile methodologies',
                'technical_skills_score' => 8,
                'communication_score' => 8,
                'cultural_fit_score' => 9,
                'interviewer_notes' => 'Highly recommended for hire. Strong leader for project management role.',
                'created_at' => '2025-11-01',
                'completed_at' => '2025-11-06',
                'cancelled_at' => null,
            ],
                        [
                'id' => 16,
                'application_id' => 16,
                'candidate_name' => 'Mark Santos',
                'job_title' => 'Project Manager',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-06',
                'scheduled_time' => '11:30 AM',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'meeting_link' => null,
                'interviewer_name' => 'Emily Davis',
                'interviewer_id' => 12,
                'status' => 'completed',
                'notes' => 'Project management methodology assessment',
                'score' => 8,
                'feedback' => 'Strong PMP background, excellent organizational skills. Ready for immediate hire.',
                'recommendation' => 'hire',
                'strengths' => 'Project management expertise, leadership skills, strategic thinking',
                'weaknesses' => 'Limited experience with Agile methodologies',
                'technical_skills_score' => 8,
                'communication_score' => 8,
                'cultural_fit_score' => 9,
                'interviewer_notes' => 'Highly recommended for hire. Strong leader for project management role.',
                'created_at' => '2025-11-01',
                'completed_at' => '2025-11-06',
                'cancelled_at' => null,
            ],
        ];

        // Find the interview by ID
        $interview = collect($allInterviews)->firstWhere('id', $id);

        if (!$interview) {
            abort(404, 'Interview not found');
        }

        // Mock related application data
        $relatedApplication = [
            'id' => $interview['application_id'],
            'candidate_name' => $interview['candidate_name'],
            'job_title' => $interview['job_title'],
            'status' => 'interviewed',
            'applied_date' => '2025-10-28',
        ];

        // Mock timeline data
        $timeline = [
            [
                'id' => 1,
                'event' => 'interview_scheduled',
                'description' => 'Interview scheduled by Sarah Johnson',
                'timestamp' => $interview['created_at'],
                'user' => 'Sarah Johnson',
            ],
            [
                'id' => 2,
                'event' => 'interview_reminder',
                'description' => 'Reminder email sent to candidate',
                'timestamp' => date('Y-m-d', strtotime($interview['scheduled_date'] . ' -1 day')),
                'user' => 'System',
            ],
        ];

        // Add completion event if interview is completed
        if ($interview['status'] === 'completed') {
            $timeline[] = [
                'id' => 3,
                'event' => 'interview_completed',
                'description' => 'Interview completed with score: ' . $interview['score'] . '/10',
                'timestamp' => $interview['completed_at'],
                'user' => $interview['interviewer_name'],
            ];
        }

        // Add cancellation event if interview is cancelled
        if ($interview['status'] === 'cancelled') {
            $timeline[] = [
                'id' => 3,
                'event' => 'interview_cancelled',
                'description' => 'Interview cancelled - Candidate withdrew',
                'timestamp' => $interview['cancelled_at'],
                'user' => 'System',
            ];
        }

        return Inertia::render('HR/ATS/Interviews/Show', [
            'interview' => $interview,
            'relatedApplication' => $relatedApplication,
            'timeline' => $timeline,
        ]);
    }

    /**
     * Store a newly created interview.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'application_id' => 'required|integer',
            'interview_type' => 'required|in:hr,technical,behavioral,panel',
            'interview_date' => 'required|date|after:today',
            'interview_time' => 'required',
            'duration_minutes' => 'required|integer|min:15|max:480',
            'interviewer_id' => 'required|integer',
            'location' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

        // Validate office hours
        $officeHoursCheck = $this->validateOfficeHours(
            $validated['interview_date'],
            $validated['interview_time'],
            $validated['duration_minutes']
        );

        if (!$officeHoursCheck['valid']) {
            return back()->withErrors(['time' => $officeHoursCheck['message']])->withInput();
        }

        // Mock response - would normally save to database
        return back()->with('success', 'Interview scheduled successfully');
    }

    /**
     * Update the specified interview.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'interview_type' => 'sometimes|in:hr,technical,behavioral,panel',
            'interview_date' => 'sometimes|date',
            'interview_time' => 'sometimes',
            'duration_minutes' => 'sometimes|integer|min:15|max:480',
            'interviewer_id' => 'sometimes|integer',
            'location' => 'sometimes|string|max:255',
            'notes' => 'nullable|string',
        ]);

        // Validate office hours if date/time is being updated
        if (isset($validated['interview_date']) && isset($validated['interview_time'])) {
            $duration = $validated['duration_minutes'] ?? 60; // Default to 60 minutes
            $officeHoursCheck = $this->validateOfficeHours(
                $validated['interview_date'],
                $validated['interview_time'],
                $duration
            );

            if (!$officeHoursCheck['valid']) {
                return back()->withErrors(['time' => $officeHoursCheck['message']])->withInput();
            }
        }

        // Mock response
        return back()->with('success', 'Interview rescheduled successfully');
    }

    /**
     * Add feedback to a completed interview.
     */
    public function addFeedback(Request $request, $id)
    {
        $validated = $request->validate([
            'feedback' => 'required|string',
            'score' => 'required|integer|min:1|max:10',
            'recommendation' => 'required|in:hire,reject,pending',
            'interviewer_notes' => 'nullable|string',
        ]);

        // Mock response
        return back()->with('success', 'Interview feedback submitted successfully');
    }

    /**
     * Cancel the specified interview.
     */
    public function cancel(Request $request, $id)
    {
        $validated = $request->validate([
            'cancellation_reason' => 'required|string|max:500',
        ]);

        // Mock response
        return back()->with('success', 'Interview cancelled successfully');
    }

    /**
     * Mark interview as completed.
     */
    public function markCompleted($id)
    {
        // Mock response
        return back()->with('success', 'Interview marked as completed');
    }
}
