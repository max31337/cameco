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
                'interview_date' => '2025-11-15',
                'interview_time' => '10:00 AM',
                'interviewer' => 'Sarah Johnson',
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
                'interview_date' => '2025-11-14',
                'interview_time' => '2:00 PM',
                'interviewer' => 'Michael Chen',
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
                'interview_date' => '2025-11-10',
                'interview_time' => '11:00 AM',
                'interviewer' => 'Emily Davis, David Wilson',
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
                'interview_date' => '2025-11-09',
                'interview_time' => '3:00 PM',
                'interviewer' => 'Sarah Johnson',
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
                'interview_date' => '2025-11-12',
                'interview_time' => '1:00 PM',
                'interviewer' => 'James Wilson',
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
                'interview_date' => '2025-11-16',
                'interview_time' => '9:00 AM',
                'interviewer' => 'Michael Chen',
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
                'interview_date' => '2025-11-17',
                'interview_time' => '10:30 AM',
                'interviewer' => 'David Wilson, Emily Davis',
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
                'interview_date' => '2025-11-08',
                'interview_time' => '2:30 PM',
                'interviewer' => 'Sarah Johnson',
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
                'interview_date' => '2025-11-11',
                'interview_time' => '4:00 PM',
                'interviewer' => 'Michael Chen',
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
                'interview_date' => '2025-11-18',
                'interview_time' => '11:00 AM',
                'interviewer' => 'James Wilson',
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
                'interview_date' => '2025-11-07',
                'interview_time' => '1:30 PM',
                'interviewer' => 'Emily Davis',
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
                'interview_date' => '2025-11-19',
                'interview_time' => '10:00 AM',
                'interviewer' => 'Michael Chen',
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
                'interview_date' => '2025-11-20',
                'interview_time' => '2:00 PM',
                'interviewer' => 'David Wilson, James Wilson',
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
                'interview_date' => '2025-11-13',
                'interview_time' => '3:30 PM',
                'interviewer' => 'Sarah Johnson',
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
                'interview_date' => '2025-11-06',
                'interview_time' => '11:30 AM',
                'interviewer' => 'Emily Davis',
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
