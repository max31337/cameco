<?php

namespace App\Http\Controllers\HR\ATS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobPostingController extends Controller
{
    /**
     * Display a listing of job postings with mock data.
     */
    public function index(Request $request): Response
    {
        // Mock data: 5 job postings (2 open, 2 closed, 1 draft)
        $jobPostings = [
            [
                'id' => 1,
                'title' => 'Production Supervisor - Rolling Mill 3',
                'department_id' => 3,
                'department_name' => 'Rolling Mill 3',
                'description' => 'Lead production team in RM3 to ensure efficient operations and quality output.',
                'requirements' => 'Minimum 3 years experience in steel manufacturing, strong leadership skills.',
                'status' => 'open',
                'posted_at' => '2025-10-15',
                'closed_at' => null,
                'applications_count' => 12,
                'created_by' => 1,
                'created_by_name' => 'Admin User',
                'created_at' => '2025-10-15 08:00:00',
                'updated_at' => '2025-10-15 08:00:00',
            ],
            [
                'id' => 2,
                'title' => 'Maintenance Technician - Wire Mill',
                'department_id' => 4,
                'department_name' => 'Wire Mill',
                'description' => 'Perform preventive and corrective maintenance on wire mill equipment.',
                'requirements' => 'Certificate in mechanical or electrical engineering, 2 years experience.',
                'status' => 'open',
                'posted_at' => '2025-10-20',
                'closed_at' => null,
                'applications_count' => 8,
                'created_by' => 1,
                'created_by_name' => 'Admin User',
                'created_at' => '2025-10-20 09:00:00',
                'updated_at' => '2025-10-20 09:00:00',
            ],
            [
                'id' => 3,
                'title' => 'HR Assistant',
                'department_id' => 1,
                'department_name' => 'Human Resources',
                'description' => 'Support HR operations including recruitment, employee records, and benefits administration.',
                'requirements' => 'Bachelor degree in HR or related field, proficient in MS Office.',
                'status' => 'closed',
                'posted_at' => '2025-09-01',
                'closed_at' => '2025-10-01',
                'applications_count' => 25,
                'created_by' => 1,
                'created_by_name' => 'Admin User',
                'created_at' => '2025-09-01 10:00:00',
                'updated_at' => '2025-10-01 16:00:00',
            ],
            [
                'id' => 4,
                'title' => 'Quality Control Inspector',
                'department_id' => 5,
                'department_name' => 'Quality Assurance',
                'description' => 'Inspect finished products to ensure they meet quality standards.',
                'requirements' => 'Experience with quality control procedures and measurement tools.',
                'status' => 'closed',
                'posted_at' => '2025-08-15',
                'closed_at' => '2025-09-30',
                'applications_count' => 18,
                'created_by' => 1,
                'created_by_name' => 'Admin User',
                'created_at' => '2025-08-15 11:00:00',
                'updated_at' => '2025-09-30 15:00:00',
            ],
            [
                'id' => 5,
                'title' => 'Safety Officer - All Mills',
                'department_id' => 6,
                'department_name' => 'Safety & Environment',
                'description' => 'Ensure workplace safety compliance and conduct safety training.',
                'requirements' => 'Safety certification, knowledge of OSHA standards.',
                'status' => 'draft',
                'posted_at' => null,
                'closed_at' => null,
                'applications_count' => 0,
                'created_by' => 1,
                'created_by_name' => 'Admin User',
                'created_at' => '2025-11-05 14:00:00',
                'updated_at' => '2025-11-05 14:00:00',
            ],
        ];

        // Mock summary statistics
        $summary = [
            'total_jobs' => 5,
            'open_jobs' => 2,
            'closed_jobs' => 2,
            'draft_jobs' => 1,
            'total_applications' => 63,
        ];

        // Mock departments for filter dropdown
        $departments = [
            ['id' => 1, 'name' => 'Human Resources', 'code' => 'HR'],
            ['id' => 2, 'name' => 'Finance', 'code' => 'FIN'],
            ['id' => 3, 'name' => 'Rolling Mill 3', 'code' => 'RM3'],
            ['id' => 4, 'name' => 'Wire Mill', 'code' => 'WM'],
            ['id' => 5, 'name' => 'Quality Assurance', 'code' => 'QA'],
            ['id' => 6, 'name' => 'Safety & Environment', 'code' => 'SAFE'],
        ];

        // Mock paginated response structure (keeping for reference but not using for now)
        // The frontend expects a simple array, not wrapped in pagination object

        return Inertia::render('HR/ATS/JobPostings/Index', [
            'job_postings' => $jobPostings,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'department_id' => $request->input('department_id'),
            ],
            'statistics' => $summary,
            'departments' => $departments,
        ]);
    }

    /**
     * Show the form for creating a new job posting.
     */
    public function create(): Response
    {
        // Mock departments for dropdown
        $departments = [
            ['id' => 1, 'name' => 'Human Resources', 'code' => 'HR'],
            ['id' => 2, 'name' => 'Finance', 'code' => 'FIN'],
            ['id' => 3, 'name' => 'Rolling Mill 3', 'code' => 'RM3'],
            ['id' => 4, 'name' => 'Wire Mill', 'code' => 'WM'],
            ['id' => 5, 'name' => 'Quality Assurance', 'code' => 'QA'],
            ['id' => 6, 'name' => 'Safety & Environment', 'code' => 'SAFE'],
        ];

        return Inertia::render('HR/ATS/JobPostings/Create', [
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created job posting (validation only - no database).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'required|integer',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'status' => 'required|in:draft,open',
            'closed_at' => 'nullable|date',
        ]);

        return redirect()->route('hr.ats.job-postings.index')
            ->with('success', 'Job posting created successfully.');
    }

    /**
     * Show the form for editing the specified job posting.
     */
    public function edit(int $id): Response
    {
        // Mock job posting data
        $jobPosting = [
            'id' => $id,
            'title' => 'Production Supervisor - Rolling Mill 3',
            'department_id' => 3,
            'department_name' => 'Rolling Mill 3',
            'description' => 'Lead production team in RM3 to ensure efficient operations and quality output.',
            'requirements' => 'Minimum 3 years experience in steel manufacturing, strong leadership skills.',
            'status' => 'open',
            'posted_at' => '2025-10-15',
            'closed_at' => null,
            'applications_count' => 12,
            'created_by' => 1,
            'created_by_name' => 'Admin User',
            'created_at' => '2025-10-15 08:00:00',
            'updated_at' => '2025-10-15 08:00:00',
        ];

        // Mock departments for dropdown
        $departments = [
            ['id' => 1, 'name' => 'Human Resources', 'code' => 'HR'],
            ['id' => 2, 'name' => 'Finance', 'code' => 'FIN'],
            ['id' => 3, 'name' => 'Rolling Mill 3', 'code' => 'RM3'],
            ['id' => 4, 'name' => 'Wire Mill', 'code' => 'WM'],
            ['id' => 5, 'name' => 'Quality Assurance', 'code' => 'QA'],
            ['id' => 6, 'name' => 'Safety & Environment', 'code' => 'SAFE'],
        ];

        return Inertia::render('HR/ATS/JobPostings/Edit', [
            'jobPosting' => $jobPosting,
            'departments' => $departments,
        ]);
    }

    /**
     * Update the specified job posting (validation only - no database).
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'department_id' => 'required|integer',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'status' => 'required|in:draft,open,closed',
            'closed_at' => 'nullable|date',
        ]);

        return redirect()->route('hr.ats.job-postings.index')
            ->with('success', 'Job posting updated successfully.');
    }

    /**
     * Remove the specified job posting (soft delete simulation).
     */
    public function destroy(int $id)
    {
        return redirect()->route('hr.ats.job-postings.index')
            ->with('success', 'Job posting deleted successfully.');
    }

    /**
     * Publish a job posting (change status to 'open').
     */
    public function publish(int $id)
    {
        return redirect()->route('hr.ats.job-postings.index')
            ->with('success', 'Job posting published successfully.');
    }

    /**
     * Close a job posting (change status to 'closed').
     */
    public function close(int $id)
    {
        return redirect()->route('hr.ats.job-postings.index')
            ->with('success', 'Job posting closed successfully.');
    }
}
