<?php

namespace App\Http\Controllers\HR\ATS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CandidateController extends Controller
{
    /**
     * Display a listing of candidates with mock data.
     */
    public function index(Request $request): Response
    {
        // Mock data: 20 candidates with varied sources and statuses
        $candidates = [
            [
                'id' => 1,
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'full_name' => 'Juan Dela Cruz',
                'email' => 'juan.delacruz@email.com',
                'phone' => '+63 912 345 6789',
                'source' => 'facebook',
                'status' => 'interviewed',
                'applied_at' => '2025-10-20',
                'resume_path' => '/uploads/resumes/juan-dela-cruz.pdf',
                'applications_count' => 2,
                'interviews_count' => 1,
                'notes_count' => 3,
                'created_at' => '2025-10-20 10:30:00',
                'updated_at' => '2025-10-25 14:20:00',
            ],
            [
                'id' => 2,
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'full_name' => 'Maria Santos',
                'email' => 'maria.santos@email.com',
                'phone' => '+63 918 765 4321',
                'source' => 'job_board',
                'status' => 'shortlisted',
                'applied_at' => '2025-10-22',
                'resume_path' => '/uploads/resumes/maria-santos.pdf',
                'applications_count' => 1,
                'interviews_count' => 0,
                'notes_count' => 1,
                'created_at' => '2025-10-22 09:15:00',
                'updated_at' => '2025-10-23 11:00:00',
            ],
            [
                'id' => 3,
                'first_name' => 'Roberto',
                'last_name' => 'Garcia',
                'full_name' => 'Roberto Garcia',
                'email' => 'roberto.garcia@email.com',
                'phone' => '+63 915 234 5678',
                'source' => 'referral',
                'status' => 'new',
                'applied_at' => '2025-10-25',
                'resume_path' => '/uploads/resumes/roberto-garcia.pdf',
                'applications_count' => 1,
                'interviews_count' => 0,
                'notes_count' => 0,
                'created_at' => '2025-10-25 13:45:00',
                'updated_at' => '2025-10-25 13:45:00',
            ],
            [
                'id' => 4,
                'first_name' => 'Ana',
                'last_name' => 'Lopez',
                'full_name' => 'Ana Lopez',
                'email' => 'ana.lopez@email.com',
                'phone' => '+63 920 876 5432',
                'source' => 'walk_in',
                'status' => 'in_process',
                'applied_at' => '2025-10-18',
                'resume_path' => '/uploads/resumes/ana-lopez.pdf',
                'applications_count' => 1,
                'interviews_count' => 1,
                'notes_count' => 2,
                'created_at' => '2025-10-18 08:00:00',
                'updated_at' => '2025-10-24 16:30:00',
            ],
            [
                'id' => 5,
                'first_name' => 'Pedro',
                'last_name' => 'Reyes',
                'full_name' => 'Pedro Reyes',
                'email' => 'pedro.reyes@email.com',
                'phone' => '+63 917 345 6789',
                'source' => 'agency',
                'status' => 'hired',
                'applied_at' => '2025-09-15',
                'resume_path' => '/uploads/resumes/pedro-reyes.pdf',
                'applications_count' => 1,
                'interviews_count' => 2,
                'notes_count' => 5,
                'created_at' => '2025-09-15 11:20:00',
                'updated_at' => '2025-10-10 15:00:00',
            ],
        ];

        // Mock summary statistics
        $summary = [
            'total_candidates' => 20,
            'new_candidates' => 5,
            'in_process' => 8,
            'interviewed' => 4,
            'hired' => 3,
        ];

        // Mock paginated response structure
        $paginatedCandidates = [
            'data' => $candidates,
            'current_page' => 1,
            'first_page_url' => route('hr.ats.candidates.index') . '?page=1',
            'from' => 1,
            'last_page' => 1,
            'last_page_url' => route('hr.ats.candidates.index') . '?page=1',
            'links' => [
                ['url' => null, 'label' => '&laquo; Previous', 'active' => false],
                ['url' => route('hr.ats.candidates.index') . '?page=1', 'label' => '1', 'active' => true],
                ['url' => null, 'label' => 'Next &raquo;', 'active' => false],
            ],
            'next_page_url' => null,
            'path' => route('hr.ats.candidates.index'),
            'per_page' => 15,
            'prev_page_url' => null,
            'to' => 5,
            'total' => 5,
        ];

        return Inertia::render('HR/ATS/Candidates/Index', [
            'candidates' => $paginatedCandidates,
            'filters' => [
                'search' => $request->input('search', ''),
                'source' => $request->input('source', ''),
                'status' => $request->input('status', ''),
            ],
            'summary' => $summary,
        ]);
    }

    /**
     * Display the specified candidate with full details.
     */
    public function show(int $id): Response
    {
        // Mock candidate data
        $candidate = [
            'id' => $id,
            'first_name' => 'Juan',
            'last_name' => 'Dela Cruz',
            'full_name' => 'Juan Dela Cruz',
            'email' => 'juan.delacruz@email.com',
            'phone' => '+63 912 345 6789',
            'source' => 'facebook',
            'status' => 'interviewed',
            'applied_at' => '2025-10-20',
            'resume_path' => '/uploads/resumes/juan-dela-cruz.pdf',
            'cover_letter' => 'I am very interested in this position and believe my experience in steel manufacturing makes me a strong candidate.',
            'linkedin_url' => 'https://linkedin.com/in/juandelacruz',
            'portfolio_url' => null,
            'applications_count' => 2,
            'interviews_count' => 1,
            'notes_count' => 3,
            'created_at' => '2025-10-20 10:30:00',
            'updated_at' => '2025-10-25 14:20:00',
        ];

        // Mock applications
        $applications = [
            [
                'id' => 1,
                'job_id' => 1,
                'job_title' => 'Production Supervisor - Rolling Mill 3',
                'status' => 'interviewed',
                'score' => 8.5,
                'applied_at' => '2025-10-20',
                'updated_at' => '2025-10-25',
            ],
            [
                'id' => 5,
                'job_id' => 2,
                'job_title' => 'Maintenance Technician - Wire Mill',
                'status' => 'submitted',
                'score' => null,
                'applied_at' => '2025-10-22',
                'updated_at' => '2025-10-22',
            ],
        ];

        // Mock interviews
        $interviews = [
            [
                'id' => 1,
                'application_id' => 1,
                'job_title' => 'Production Supervisor - Rolling Mill 3',
                'scheduled_date' => '2025-10-25',
                'scheduled_time' => '14:00',
                'status' => 'completed',
                'score' => 8.5,
                'interviewer_name' => 'John Smith',
                'recommendation' => 'hire',
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
            [
                'id' => 2,
                'note' => 'Candidate expressed interest in shift work flexibility.',
                'is_private' => false,
                'created_by_name' => 'HR Manager',
                'created_at' => '2025-10-23 15:30:00',
            ],
            [
                'id' => 3,
                'note' => 'Internal note: Check references before final decision.',
                'is_private' => true,
                'created_by_name' => 'HR Manager',
                'created_at' => '2025-10-25 16:00:00',
            ],
        ];

        // Mock stats
        $stats = [
            'total_applications' => 2,
            'total_interviews' => 1,
            'average_score' => 8.5,
        ];

        return Inertia::render('HR/ATS/Candidates/Show', [
            'candidate' => $candidate,
            'applications' => $applications,
            'interviews' => $interviews,
            'notes' => $notes,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created candidate (validation only - no database).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'source' => 'required|in:referral,job_board,walk_in,agency,internal,facebook,other',
            'resume_path' => 'nullable|string',
            'cover_letter' => 'nullable|string',
            'linkedin_url' => 'nullable|url',
            'portfolio_url' => 'nullable|url',
        ]);

        return redirect()->route('hr.ats.candidates.index')
            ->with('success', 'Candidate added successfully.');
    }

    /**
     * Update the specified candidate (validation only - no database).
     */
    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'source' => 'required|in:referral,job_board,walk_in,agency,internal,facebook,other',
            'resume_path' => 'nullable|string',
            'cover_letter' => 'nullable|string',
            'linkedin_url' => 'nullable|url',
            'portfolio_url' => 'nullable|url',
        ]);

        return redirect()->route('hr.ats.candidates.show', $id)
            ->with('success', 'Candidate updated successfully.');
    }

    /**
     * Add a note to the candidate.
     */
    public function addNote(Request $request, int $id)
    {
        $validated = $request->validate([
            'note' => 'required|string',
            'is_private' => 'required|boolean',
        ]);

        return redirect()->route('hr.ats.candidates.show', $id)
            ->with('success', 'Note added successfully.');
    }
}
