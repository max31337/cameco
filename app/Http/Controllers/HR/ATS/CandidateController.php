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
        // Mock data: Candidates with varied sources and statuses
        $candidates = [
            // New Candidates
            [
                'id' => 1,
                'first_name' => 'Roberto',
                'last_name' => 'Garcia',
                'full_name' => 'Roberto Garcia',
                'email' => 'roberto.garcia@email.com',
                'phone' => '+63 915 234 5678',
                'source' => 'referral',
                'status' => 'new',
                'applied_at' => '2025-11-10',
                'resume_path' => '/uploads/resumes/roberto-garcia.pdf',
                'applications_count' => 1,
                'interviews_count' => 0,
                'notes_count' => 0,
                'created_at' => '2025-11-10 13:45:00',
                'updated_at' => '2025-11-10 13:45:00',
            ],
            [
                'id' => 2,
                'first_name' => 'Sophia',
                'last_name' => 'Chen',
                'full_name' => 'Sophia Chen',
                'email' => 'sophia.chen@email.com',
                'phone' => '+63 917 456 7890',
                'source' => 'job_board',
                'status' => 'new',
                'applied_at' => '2025-11-11',
                'resume_path' => '/uploads/resumes/sophia-chen.pdf',
                'applications_count' => 1,
                'interviews_count' => 0,
                'notes_count' => 0,
                'created_at' => '2025-11-11 09:20:00',
                'updated_at' => '2025-11-11 09:20:00',
            ],

            // In Process
            [
                'id' => 3,
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
                'updated_at' => '2025-11-08 16:30:00',
            ],
            [
                'id' => 4,
                'first_name' => 'Michael',
                'last_name' => 'Torres',
                'full_name' => 'Michael Torres',
                'email' => 'michael.torres@email.com',
                'phone' => '+63 921 234 5678',
                'source' => 'internal',
                'status' => 'in_process',
                'applied_at' => '2025-10-25',
                'resume_path' => '/uploads/resumes/michael-torres.pdf',
                'applications_count' => 2,
                'interviews_count' => 1,
                'notes_count' => 3,
                'created_at' => '2025-10-25 10:15:00',
                'updated_at' => '2025-11-09 14:45:00',
            ],
            [
                'id' => 5,
                'first_name' => 'Isabella',
                'last_name' => 'Rodriguez',
                'full_name' => 'Isabella Rodriguez',
                'email' => 'isabella.rodriguez@email.com',
                'phone' => '+63 919 876 5432',
                'source' => 'agency',
                'status' => 'in_process',
                'applied_at' => '2025-10-30',
                'resume_path' => '/uploads/resumes/isabella-rodriguez.pdf',
                'applications_count' => 1,
                'interviews_count' => 0,
                'notes_count' => 1,
                'created_at' => '2025-10-30 11:30:00',
                'updated_at' => '2025-11-07 13:20:00',
            ],

            // Interviewed
            [
                'id' => 6,
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
                'updated_at' => '2025-11-06 14:20:00',
            ],
            [
                'id' => 7,
                'first_name' => 'David',
                'last_name' => 'Mendoza',
                'full_name' => 'David Mendoza',
                'email' => 'david.mendoza@email.com',
                'phone' => '+63 916 789 0123',
                'source' => 'job_board',
                'status' => 'interviewed',
                'applied_at' => '2025-10-22',
                'resume_path' => '/uploads/resumes/david-mendoza.pdf',
                'applications_count' => 1,
                'interviews_count' => 1,
                'notes_count' => 2,
                'created_at' => '2025-10-22 14:00:00',
                'updated_at' => '2025-11-05 10:45:00',
            ],

            // Offered
            [
                'id' => 8,
                'first_name' => 'Maria',
                'last_name' => 'Santos',
                'full_name' => 'Maria Santos',
                'email' => 'maria.santos@email.com',
                'phone' => '+63 918 765 4321',
                'source' => 'referral',
                'status' => 'offered',
                'applied_at' => '2025-10-15',
                'resume_path' => '/uploads/resumes/maria-santos.pdf',
                'applications_count' => 1,
                'interviews_count' => 1,
                'notes_count' => 4,
                'created_at' => '2025-10-15 08:30:00',
                'updated_at' => '2025-11-04 16:00:00',
            ],

            // Hired
            [
                'id' => 9,
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
                'updated_at' => '2025-11-01 15:00:00',
            ],
            [
                'id' => 10,
                'first_name' => 'Jessica',
                'last_name' => 'Morales',
                'full_name' => 'Jessica Morales',
                'email' => 'jessica.morales@email.com',
                'phone' => '+63 910 123 4567',
                'source' => 'job_board',
                'status' => 'hired',
                'applied_at' => '2025-09-20',
                'resume_path' => '/uploads/resumes/jessica-morales.pdf',
                'applications_count' => 1,
                'interviews_count' => 2,
                'notes_count' => 4,
                'created_at' => '2025-09-20 12:00:00',
                'updated_at' => '2025-10-28 17:30:00',
            ],

            // Rejected
            [
                'id' => 11,
                'first_name' => 'Carlos',
                'last_name' => 'Villalobos',
                'full_name' => 'Carlos Villalobos',
                'email' => 'carlos.villalobos@email.com',
                'phone' => '+63 911 234 5678',
                'source' => 'facebook',
                'status' => 'rejected',
                'applied_at' => '2025-10-10',
                'resume_path' => '/uploads/resumes/carlos-villalobos.pdf',
                'applications_count' => 1,
                'interviews_count' => 1,
                'notes_count' => 2,
                'created_at' => '2025-10-10 15:45:00',
                'updated_at' => '2025-10-26 09:15:00',
            ],
            [
                'id' => 12,
                'first_name' => 'Angela',
                'last_name' => 'Fernandez',
                'full_name' => 'Angela Fernandez',
                'email' => 'angela.fernandez@email.com',
                'phone' => '+63 922 345 6789',
                'source' => 'other',
                'status' => 'rejected',
                'applied_at' => '2025-11-01',
                'resume_path' => '/uploads/resumes/angela-fernandez.pdf',
                'applications_count' => 1,
                'interviews_count' => 0,
                'notes_count' => 1,
                'created_at' => '2025-11-01 10:00:00',
                'updated_at' => '2025-11-03 11:30:00',
            ],
        ];

        // Mock summary statistics
        $statistics = [
            'total_candidates' => 12,
            'new_candidates' => 2,
            'in_process' => 3,
            'interviewed' => 2,
            'offered' => 1,
            'hired' => 2,
            'rejected' => 2,
        ];

        return Inertia::render('HR/ATS/Candidates/Index', [
            'candidates' => $candidates,
            'statistics' => $statistics,
            'filters' => [
                'search' => $request->input('search', ''),
                'source' => $request->input('source', ''),
                'status' => $request->input('status', ''),
            ],
        ]);
    }

    /**
     * Display the specified candidate with full details.
     */
    public function show(int $id): Response
    {
        // Mock candidate data based on ID
        $candidateData = [
            1 => [
                'first_name' => 'Roberto',
                'last_name' => 'Garcia',
                'email' => 'roberto.garcia@email.com',
                'phone' => '+63 915 234 5678',
                'source' => 'referral',
                'status' => 'new',
            ],
            6 => [
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'email' => 'juan.delacruz@email.com',
                'phone' => '+63 912 345 6789',
                'source' => 'facebook',
                'status' => 'interviewed',
            ],
            9 => [
                'first_name' => 'Pedro',
                'last_name' => 'Reyes',
                'email' => 'pedro.reyes@email.com',
                'phone' => '+63 917 345 6789',
                'source' => 'agency',
                'status' => 'hired',
            ],
        ];

        $data = $candidateData[$id] ?? $candidateData[6];

        $candidate = [
            'id' => $id,
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'full_name' => $data['first_name'] . ' ' . $data['last_name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'source' => $data['source'],
            'status' => $data['status'],
            'applied_at' => '2025-10-20',
            'resume_path' => '/uploads/resumes/' . strtolower(str_replace(' ', '-', $data['first_name'] . ' ' . $data['last_name'])) . '.pdf',
            'cover_letter' => 'I am very interested in this position and believe my experience in the industry makes me a strong candidate.',
            'linkedin_url' => 'https://linkedin.com/in/' . strtolower(str_replace(' ', '', $data['first_name'] . $data['last_name'])),
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
                'location_type' => 'office',
                'status' => 'completed',
                'score' => 8.5,
                'interviewer_name' => 'John Smith',
                'recommendation' => 'hire',
                'feedback' => 'Excellent technical knowledge and leadership potential.',
            ],
        ];

        // Mock notes - Rich timeline showing progression
        $notes = [
            [
                'id' => 3,
                'candidate_id' => $id,
                'user_id' => 1,
                'note' => 'Internal note: Check references before final decision. Verified experience in manufacturing with 8+ years background.',
                'is_private' => true,
                'created_by_name' => 'Sarah Johnson',
                'created_at' => '2025-10-25 16:00:00',
                'updated_at' => '2025-10-25 16:00:00',
            ],
            [
                'id' => 2,
                'candidate_id' => $id,
                'user_id' => 2,
                'note' => 'Candidate expressed interest in flexible shift arrangements. Willing to work overtime during peak production seasons.',
                'is_private' => false,
                'created_by_name' => 'Michael Chen',
                'created_at' => '2025-10-23 15:30:00',
                'updated_at' => '2025-10-23 15:30:00',
            ],
            [
                'id' => 1,
                'candidate_id' => $id,
                'user_id' => 1,
                'note' => 'Initial screening completed. Strong technical background with excellent communication skills. Recommended for next round.',
                'is_private' => false,
                'created_by_name' => 'Sarah Johnson',
                'created_at' => '2025-10-21 10:00:00',
                'updated_at' => '2025-10-21 10:00:00',
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
