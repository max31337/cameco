<?php

namespace App\Http\Controllers\HR\ATS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InterviewController extends Controller
{
    /**
     * Display a listing of interviews.
     */
    public function index(Request $request): Response
    {
        // Mock data: 15 interviews with different statuses
        $interviews = [
            [
                'id' => 1,
                'application_id' => 1,
                'candidate_name' => 'John Doe',
                'job_title' => 'Senior Software Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-15',
                'scheduled_time' => '10:00 AM',
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'location' => 'Conference Room A',
                'status' => 'scheduled',
                'notes' => 'First technical round',
                'created_at' => '2025-11-08',
            ],
            [
                'id' => 2,
                'application_id' => 3,
                'candidate_name' => 'Jane Smith',
                'job_title' => 'Marketing Manager',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-14',
                'scheduled_time' => '2:00 PM',
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'location' => 'Zoom Meeting',
                'status' => 'scheduled',
                'notes' => 'Initial HR screening',
                'created_at' => '2025-11-07',
            ],
            [
                'id' => 3,
                'application_id' => 5,
                'candidate_name' => 'Robert Martinez',
                'job_title' => 'Financial Analyst',
                'interview_type' => 'panel',
                'scheduled_date' => '2025-11-10',
                'scheduled_time' => '11:00 AM',
                'interviewer_name' => 'Emily Davis, David Wilson',
                'interviewer_id' => 12,
                'location' => 'Finance Department',
                'status' => 'completed',
                'notes' => 'Panel interview with finance team',
                'feedback' => 'Strong analytical skills, good cultural fit',
                'score' => 8,
                'recommendation' => 'hire',
                'created_at' => '2025-11-05',
                'completed_at' => '2025-11-10',
            ],
            [
                'id' => 4,
                'application_id' => 7,
                'candidate_name' => 'Lisa Anderson',
                'job_title' => 'HR Coordinator',
                'interview_type' => 'behavioral',
                'scheduled_date' => '2025-11-09',
                'scheduled_time' => '3:00 PM',
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'location' => 'HR Office',
                'status' => 'completed',
                'notes' => 'Behavioral assessment',
                'feedback' => 'Excellent communication skills, lacks experience in HRIS',
                'score' => 7,
                'recommendation' => 'pending',
                'created_at' => '2025-11-04',
                'completed_at' => '2025-11-09',
            ],
            [
                'id' => 5,
                'application_id' => 2,
                'candidate_name' => 'Michael Brown',
                'job_title' => 'Senior Software Engineer',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-12',
                'scheduled_time' => '1:00 PM',
                'interviewer_name' => 'James Wilson',
                'interviewer_id' => 15,
                'location' => 'Conference Room B',
                'status' => 'cancelled',
                'notes' => 'Candidate withdrew application',
                'cancellation_reason' => 'Candidate accepted another offer',
                'created_at' => '2025-11-06',
                'cancelled_at' => '2025-11-11',
            ],
            [
                'id' => 6,
                'application_id' => 8,
                'candidate_name' => 'Patricia Garcia',
                'job_title' => 'Customer Service Representative',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-16',
                'scheduled_time' => '9:00 AM',
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'location' => 'Main Office',
                'status' => 'scheduled',
                'notes' => 'Walk-in candidate',
                'created_at' => '2025-11-09',
            ],
            [
                'id' => 7,
                'application_id' => 10,
                'candidate_name' => 'Christopher Lee',
                'job_title' => 'Project Manager',
                'interview_type' => 'panel',
                'scheduled_date' => '2025-11-17',
                'scheduled_time' => '10:30 AM',
                'interviewer_name' => 'David Wilson, Emily Davis',
                'interviewer_id' => 12,
                'location' => 'Conference Room C',
                'status' => 'scheduled',
                'notes' => 'Final round interview',
                'created_at' => '2025-11-08',
            ],
            [
                'id' => 8,
                'application_id' => 12,
                'candidate_name' => 'Amanda White',
                'job_title' => 'Marketing Manager',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-08',
                'scheduled_time' => '2:30 PM',
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'location' => 'Marketing Department',
                'status' => 'completed',
                'notes' => 'Marketing strategy assessment',
                'feedback' => 'Creative thinking, strong portfolio, good presentation skills',
                'score' => 9,
                'recommendation' => 'hire',
                'created_at' => '2025-11-03',
                'completed_at' => '2025-11-08',
            ],
            [
                'id' => 9,
                'application_id' => 15,
                'candidate_name' => 'Daniel Thomas',
                'job_title' => 'Financial Analyst',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-11',
                'scheduled_time' => '4:00 PM',
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'location' => 'Zoom Meeting',
                'status' => 'no_show',
                'notes' => 'Candidate did not attend',
                'created_at' => '2025-11-06',
            ],
            [
                'id' => 10,
                'application_id' => 18,
                'candidate_name' => 'Jessica Martinez',
                'job_title' => 'Data Analyst',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-18',
                'scheduled_time' => '11:00 AM',
                'interviewer_name' => 'James Wilson',
                'interviewer_id' => 15,
                'location' => 'IT Department',
                'status' => 'scheduled',
                'notes' => 'Technical skills assessment',
                'created_at' => '2025-11-09',
            ],
            [
                'id' => 11,
                'application_id' => 20,
                'candidate_name' => 'David Rodriguez',
                'job_title' => 'Sales Executive',
                'interview_type' => 'behavioral',
                'scheduled_date' => '2025-11-07',
                'scheduled_time' => '1:30 PM',
                'interviewer_name' => 'Emily Davis',
                'interviewer_id' => 12,
                'location' => 'Sales Office',
                'status' => 'completed',
                'notes' => 'Sales role play and behavioral questions',
                'feedback' => 'Good interpersonal skills, needs improvement in closing techniques',
                'score' => 6,
                'recommendation' => 'reject',
                'created_at' => '2025-11-02',
                'completed_at' => '2025-11-07',
            ],
            [
                'id' => 12,
                'application_id' => 22,
                'candidate_name' => 'Sarah Johnson',
                'job_title' => 'HR Coordinator',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-19',
                'scheduled_time' => '10:00 AM',
                'interviewer_name' => 'Michael Chen',
                'interviewer_id' => 8,
                'location' => 'HR Office',
                'status' => 'scheduled',
                'notes' => 'Initial screening',
                'created_at' => '2025-11-10',
            ],
            [
                'id' => 13,
                'application_id' => 25,
                'candidate_name' => 'Kevin Brown',
                'job_title' => 'Operations Manager',
                'interview_type' => 'panel',
                'scheduled_date' => '2025-11-20',
                'scheduled_time' => '2:00 PM',
                'interviewer_name' => 'David Wilson, James Wilson',
                'interviewer_id' => 12,
                'location' => 'Operations Center',
                'status' => 'scheduled',
                'notes' => 'Operations leadership assessment',
                'created_at' => '2025-11-10',
            ],
            [
                'id' => 14,
                'application_id' => 28,
                'candidate_name' => 'Michelle Davis',
                'job_title' => 'Customer Service Representative',
                'interview_type' => 'hr',
                'scheduled_date' => '2025-11-13',
                'scheduled_time' => '3:30 PM',
                'interviewer_name' => 'Sarah Johnson',
                'interviewer_id' => 5,
                'location' => 'Customer Service Dept',
                'status' => 'scheduled',
                'notes' => 'Customer service skills evaluation',
                'created_at' => '2025-11-08',
            ],
            [
                'id' => 15,
                'application_id' => 30,
                'candidate_name' => 'Brian Wilson',
                'job_title' => 'Project Manager',
                'interview_type' => 'technical',
                'scheduled_date' => '2025-11-06',
                'scheduled_time' => '11:30 AM',
                'interviewer_name' => 'Emily Davis',
                'interviewer_id' => 12,
                'location' => 'Project Management Office',
                'status' => 'completed',
                'notes' => 'Project management methodology assessment',
                'feedback' => 'Strong PMP background, excellent organizational skills',
                'score' => 8,
                'recommendation' => 'hire',
                'created_at' => '2025-11-01',
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
            'interviewer_id' => 'required|integer',
            'location' => 'required|string|max:255',
            'notes' => 'nullable|string',
        ]);

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
            'interviewer_id' => 'sometimes|integer',
            'location' => 'sometimes|string|max:255',
            'notes' => 'nullable|string',
        ]);

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
