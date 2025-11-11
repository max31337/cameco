<?php

namespace App\Http\Controllers\HR\ATS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApplicationController extends Controller
{
    /**
     * Display a listing of applications with mock data.
     */
    public function index(Request $request): Response
    {
        // Mock data: 30 applications across different job postings (showing first 10)
        $applications = [
            [
                'id' => 1,
                'candidate_id' => 1,
                'job_id' => 1,
                'candidate_name' => 'Juan Dela Cruz',
                'candidate_email' => 'juan.delacruz@email.com',
                'candidate_phone' => '+63 912 345 6789',
                'job_title' => 'Production Supervisor - Rolling Mill 3',
                'status' => 'interviewed',
                'score' => 8.5,
                'applied_at' => '2025-10-20',
                'cover_letter' => 'I am very interested in this position...',
                'resume_path' => '/uploads/resumes/juan-dela-cruz.pdf',
                'interview_date' => '2025-10-25',
                'interviewer_name' => 'John Smith',
                'rejection_reason' => null,
                'created_at' => '2025-10-20 10:30:00',
                'updated_at' => '2025-10-25 16:00:00',
            ],
            [
                'id' => 2,
                'candidate_id' => 2,
                'job_id' => 1,
                'candidate_name' => 'Maria Santos',
                'candidate_email' => 'maria.santos@email.com',
                'candidate_phone' => '+63 918 765 4321',
                'job_title' => 'Production Supervisor - Rolling Mill 3',
                'status' => 'shortlisted',
                'score' => null,
                'applied_at' => '2025-10-22',
                'cover_letter' => 'With my background in manufacturing...',
                'resume_path' => '/uploads/resumes/maria-santos.pdf',
                'interview_date' => null,
                'interviewer_name' => null,
                'rejection_reason' => null,
                'created_at' => '2025-10-22 09:15:00',
                'updated_at' => '2025-10-23 11:00:00',
            ],
            [
                'id' => 3,
                'candidate_id' => 3,
                'job_id' => 2,
                'candidate_name' => 'Roberto Garcia',
                'candidate_email' => 'roberto.garcia@email.com',
                'candidate_phone' => '+63 915 234 5678',
                'job_title' => 'Maintenance Technician - Wire Mill',
                'status' => 'submitted',
                'score' => null,
                'applied_at' => '2025-10-25',
                'cover_letter' => 'I have extensive experience in maintenance...',
                'resume_path' => '/uploads/resumes/roberto-garcia.pdf',
                'interview_date' => null,
                'interviewer_name' => null,
                'rejection_reason' => null,
                'created_at' => '2025-10-25 13:45:00',
                'updated_at' => '2025-10-25 13:45:00',
            ],
            [
                'id' => 4,
                'candidate_id' => 4,
                'job_id' => 2,
                'candidate_name' => 'Ana Lopez',
                'candidate_email' => 'ana.lopez@email.com',
                'candidate_phone' => '+63 920 876 5432',
                'job_title' => 'Maintenance Technician - Wire Mill',
                'status' => 'offered',
                'score' => 9.0,
                'applied_at' => '2025-10-18',
                'cover_letter' => 'I am confident that my skills...',
                'resume_path' => '/uploads/resumes/ana-lopez.pdf',
                'interview_date' => '2025-10-23',
                'interviewer_name' => 'Jane Doe',
                'rejection_reason' => null,
                'created_at' => '2025-10-18 08:00:00',
                'updated_at' => '2025-10-27 10:00:00',
            ],
            [
                'id' => 5,
                'candidate_id' => 5,
                'job_id' => 3,
                'candidate_name' => 'Pedro Reyes',
                'candidate_email' => 'pedro.reyes@email.com',
                'candidate_phone' => '+63 917 345 6789',
                'job_title' => 'HR Assistant',
                'status' => 'hired',
                'score' => 8.8,
                'applied_at' => '2025-09-15',
                'cover_letter' => 'I am passionate about human resources...',
                'resume_path' => '/uploads/resumes/pedro-reyes.pdf',
                'interview_date' => '2025-09-22',
                'interviewer_name' => 'HR Manager',
                'rejection_reason' => null,
                'created_at' => '2025-09-15 11:20:00',
                'updated_at' => '2025-10-10 15:00:00',
            ],
            [
                'id' => 6,
                'candidate_id' => 6,
                'job_id' => 1,
                'candidate_name' => 'Carlos Mendoza',
                'candidate_email' => 'carlos.mendoza@email.com',
                'candidate_phone' => '+63 919 234 5678',
                'job_title' => 'Production Supervisor - Rolling Mill 3',
                'status' => 'rejected',
                'score' => 5.5,
                'applied_at' => '2025-10-19',
                'cover_letter' => 'I would like to apply...',
                'resume_path' => '/uploads/resumes/carlos-mendoza.pdf',
                'interview_date' => '2025-10-24',
                'interviewer_name' => 'John Smith',
                'rejection_reason' => 'Insufficient experience in steel manufacturing.',
                'created_at' => '2025-10-19 14:00:00',
                'updated_at' => '2025-10-26 09:00:00',
            ],
            [
                'id' => 7,
                'candidate_id' => 7,
                'job_id' => 4,
                'candidate_name' => 'Isabel Cruz',
                'candidate_email' => 'isabel.cruz@email.com',
                'candidate_phone' => '+63 922 345 6789',
                'job_title' => 'Quality Control Inspector',
                'status' => 'submitted',
                'score' => null,
                'applied_at' => '2025-10-26',
                'cover_letter' => 'I have a keen eye for quality...',
                'resume_path' => '/uploads/resumes/isabel-cruz.pdf',
                'interview_date' => null,
                'interviewer_name' => null,
                'rejection_reason' => null,
                'created_at' => '2025-10-26 10:00:00',
                'updated_at' => '2025-10-26 10:00:00',
            ],
            [
                'id' => 8,
                'candidate_id' => 8,
                'job_id' => 1,
                'candidate_name' => 'Miguel Torres',
                'candidate_email' => 'miguel.torres@email.com',
                'candidate_phone' => '+63 921 876 5432',
                'job_title' => 'Production Supervisor - Rolling Mill 3',
                'status' => 'withdrawn',
                'score' => null,
                'applied_at' => '2025-10-21',
                'cover_letter' => 'I am excited about this opportunity...',
                'resume_path' => '/uploads/resumes/miguel-torres.pdf',
                'interview_date' => null,
                'interviewer_name' => null,
                'rejection_reason' => null,
                'created_at' => '2025-10-21 11:30:00',
                'updated_at' => '2025-10-24 08:00:00',
            ],
        ];

        // Mock summary statistics
        $summary = [
            'total_applications' => 30,
            'submitted' => 8,
            'shortlisted' => 6,
            'interviewed' => 7,
            'offered' => 2,
            'hired' => 3,
            'rejected' => 4,
        ];

        // Mock job postings for filter dropdown
        $jobPostings = [
            ['id' => 1, 'title' => 'Production Supervisor - Rolling Mill 3'],
            ['id' => 2, 'title' => 'Maintenance Technician - Wire Mill'],
            ['id' => 3, 'title' => 'HR Assistant'],
            ['id' => 4, 'title' => 'Quality Control Inspector'],
        ];

        // Mock paginated response structure
        $paginatedApplications = [
            'data' => $applications,
            'current_page' => 1,
            'first_page_url' => route('hr.ats.applications.index') . '?page=1',
            'from' => 1,
            'last_page' => 1,
            'last_page_url' => route('hr.ats.applications.index') . '?page=1',
            'links' => [
                ['url' => null, 'label' => '&laquo; Previous', 'active' => false],
                ['url' => route('hr.ats.applications.index') . '?page=1', 'label' => '1', 'active' => true],
                ['url' => null, 'label' => 'Next &raquo;', 'active' => false],
            ],
            'next_page_url' => null,
            'path' => route('hr.ats.applications.index'),
            'per_page' => 15,
            'prev_page_url' => null,
            'to' => 8,
            'total' => 8,
        ];

        return Inertia::render('HR/ATS/Applications/Index', [
            'applications' => $paginatedApplications,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'job_id' => $request->input('job_id'),
            ],
            'summary' => $summary,
            'jobPostings' => $jobPostings,
        ]);
    }

    /**
     * Display the specified application with full details.
     */
    public function show(int $id): Response
    {
        // Mock application data
        $application = [
            'id' => $id,
            'candidate_id' => 1,
            'job_id' => 1,
            'candidate_name' => 'Juan Dela Cruz',
            'candidate_email' => 'juan.delacruz@email.com',
            'candidate_phone' => '+63 912 345 6789',
            'job_title' => 'Production Supervisor - Rolling Mill 3',
            'status' => 'interviewed',
            'score' => 8.5,
            'applied_at' => '2025-10-20',
            'cover_letter' => 'I am very interested in this position and believe my experience in steel manufacturing makes me a strong candidate. With over 5 years of experience in production supervision, I have developed strong leadership and problem-solving skills.',
            'resume_path' => '/uploads/resumes/juan-dela-cruz.pdf',
            'interview_date' => '2025-10-25',
            'interviewer_name' => 'John Smith',
            'rejection_reason' => null,
            'created_at' => '2025-10-20 10:30:00',
            'updated_at' => '2025-10-25 16:00:00',
        ];

        // Mock candidate
        $candidate = [
            'id' => 1,
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'full_name' => 'Juan Dela Cruz',
            'email' => 'juan.delacruz@email.com',
            'phone' => '+63 912 345 6789',
            'source' => 'facebook',
            'linkedin_url' => 'https://linkedin.com/in/juandelacruz',
        ];

        // Mock job
        $job = [
            'id' => 1,
            'title' => 'Production Supervisor - Rolling Mill 3',
            'department_name' => 'Rolling Mill 3',
            'status' => 'open',
        ];

        // Mock interviews
        $interviews = [
            [
                'id' => 1,
                'scheduled_date' => '2025-10-25',
                'scheduled_time' => '14:00',
                'duration_minutes' => 60,
                'location_type' => 'office',
                'status' => 'completed',
                'score' => 8.5,
                'interviewer_name' => 'John Smith',
                'recommendation' => 'hire',
                'feedback' => 'Strong candidate with good technical knowledge and leadership experience.',
                'completed_at' => '2025-10-25 15:00:00',
            ],
        ];

        // Mock status history
        $statusHistory = [
            [
                'id' => 1,
                'status' => 'submitted',
                'changed_by_name' => 'System',
                'notes' => null,
                'created_at' => '2025-10-20 10:30:00',
            ],
            [
                'id' => 2,
                'status' => 'shortlisted',
                'changed_by_name' => 'HR Manager',
                'notes' => 'Good qualifications, moving to interview stage.',
                'created_at' => '2025-10-22 14:00:00',
            ],
            [
                'id' => 3,
                'status' => 'interviewed',
                'changed_by_name' => 'HR Manager',
                'notes' => 'Interview completed with positive feedback.',
                'created_at' => '2025-10-25 16:00:00',
            ],
        ];

        // Mock notes
        $notes = [
            [
                'id' => 1,
                'note' => 'Strong technical background, good communication skills.',
                'is_private' => false,
                'created_by_name' => 'HR Manager',
                'created_at' => '2025-10-21 10:00:00',
            ],
        ];

        return Inertia::render('HR/ATS/Applications/Show', [
            'application' => $application,
            'candidate' => $candidate,
            'job' => $job,
            'interviews' => $interviews,
            'statusHistory' => $statusHistory,
            'notes' => $notes,
        ]);
    }

    /**
     * Update the application status.
     */
    public function updateStatus(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:submitted,shortlisted,interviewed,offered,hired,rejected,withdrawn',
            'notes' => 'nullable|string',
        ]);

        return redirect()->route('hr.ats.applications.show', $id)
            ->with('success', 'Application status updated successfully.');
    }

    /**
     * Move application to shortlisted status.
     */
    public function shortlist(int $id)
    {
        return redirect()->route('hr.ats.applications.show', $id)
            ->with('success', 'Application shortlisted successfully.');
    }

    /**
     * Reject the application with reason.
     */
    public function reject(Request $request, int $id)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        return redirect()->route('hr.ats.applications.index')
            ->with('success', 'Application rejected.');
    }
}
