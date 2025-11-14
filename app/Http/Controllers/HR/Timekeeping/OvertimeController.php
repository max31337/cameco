<?php

namespace App\Http\Controllers\HR\Timekeeping;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class OvertimeController extends Controller
{
    /**
     * Display a listing of overtime records with mock data.
     */
    public function index(Request $request): Response
    {
        $records = $this->getMockOvertimeRecords();

        // Apply filters
        if ($request->has('department_id')) {
            $records = array_filter($records, fn($r) => $r['department_id'] == $request->department_id);
        }
        
        if ($request->has('status')) {
            $records = array_filter($records, fn($r) => $r['status'] == $request->status);
        }

        // Calculate summary
        $summary = [
            'total_records' => count($records),
            'planned' => count(array_filter($records, fn($r) => $r['status'] === 'planned')),
            'in_progress' => count(array_filter($records, fn($r) => $r['status'] === 'in_progress')),
            'completed' => count(array_filter($records, fn($r) => $r['status'] === 'completed')),
            'cancelled' => count(array_filter($records, fn($r) => $r['status'] === 'cancelled')),
            'total_ot_hours' => array_sum(array_map(fn($r) => $r['actual_hours'] ?? $r['planned_hours'], $records)),
        ];

        return Inertia::render('HR/Timekeeping/Overtime/Index', [
            'overtime' => array_values($records),
            'summary' => $summary,
            'filters' => $request->only(['department_id', 'status', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Show the form for creating a new overtime record.
     */
    public function create(): Response
    {
        return Inertia::render('HR/Timekeeping/Overtime/Create', [
            'employees' => $this->getMockEmployees(),
            'departments' => $this->getMockDepartments(),
        ]);
    }

    /**
     * Store a newly created overtime record.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|integer',
            'overtime_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'planned_hours' => 'required|numeric',
            'reason' => 'required|string',
            'status' => 'required|in:planned,in_progress,completed,cancelled',
            'budget_code' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Overtime record created successfully',
            'data' => array_merge($validated, [
                'id' => rand(1000, 9999),
                'created_by' => 'HR Manager',
                'created_at' => now()->format('Y-m-d H:i:s'),
            ]),
        ]);
    }

    /**
     * Display the specified overtime record.
     */
    public function show(int $id): Response
    {
        $record = $this->getMockOvertimeRecords()[$id - 1] ?? null;

        if (!$record) {
            abort(404, 'Overtime record not found');
        }

        return Inertia::render('HR/Timekeeping/Overtime/Show', [
            'overtime' => $record,
            'status_history' => $this->getMockStatusHistory($id),
        ]);
    }

    /**
     * Show the form for editing the specified overtime record.
     */
    public function edit(int $id): Response
    {
        $record = $this->getMockOvertimeRecords()[$id - 1] ?? null;

        if (!$record) {
            abort(404, 'Overtime record not found');
        }

        return Inertia::render('HR/Timekeeping/Overtime/Edit', [
            'overtime' => $record,
            'employees' => $this->getMockEmployees(),
            'departments' => $this->getMockDepartments(),
        ]);
    }

    /**
     * Update the specified overtime record.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'overtime_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'planned_hours' => 'required|numeric',
            'actual_hours' => 'nullable|numeric',
            'reason' => 'required|string',
            'status' => 'required|in:planned,in_progress,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Overtime record updated successfully',
            'data' => array_merge($validated, ['id' => $id]),
        ]);
    }

    /**
     * Remove the specified overtime record.
     */
    public function destroy(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Overtime record deleted successfully',
        ]);
    }

    /**
     * Process/mark overtime as completed or update status.
     */
    public function processOvertime(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:in_progress,completed,cancelled',
            'actual_hours' => 'nullable|numeric',
            'notes' => 'nullable|string',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Overtime status updated successfully',
            'data' => array_merge($validated, [
                'id' => $id,
                'processed_by' => 'HR Manager',
                'processed_at' => now()->format('Y-m-d H:i:s'),
            ]),
        ]);
    }

    /**
     * Get overtime budget information for a department.
     */
    public function getBudget(int $departmentId): JsonResponse
    {
        $budgets = [
            3 => ['allocated' => 200, 'used' => 145, 'available' => 55, 'percentage' => 72.5],
            4 => ['allocated' => 180, 'used' => 98, 'available' => 82, 'percentage' => 54.4],
            5 => ['allocated' => 120, 'used' => 87, 'available' => 33, 'percentage' => 72.5],
            6 => ['allocated' => 150, 'used' => 110, 'available' => 40, 'percentage' => 73.3],
        ];

        $budget = $budgets[$departmentId] ?? ['allocated' => 0, 'used' => 0, 'available' => 0, 'percentage' => 0];

        return response()->json([
            'success' => true,
            'data' => [
                'department_id' => $departmentId,
                'allocated_hours' => $budget['allocated'],
                'used_hours' => $budget['used'],
                'available_hours' => $budget['available'],
                'utilization_percentage' => $budget['percentage'],
                'is_over_budget' => $budget['percentage'] > 100,
                'near_limit' => $budget['percentage'] > 90,
            ],
        ]);
    }

    /**
     * Generate mock overtime records.
     */
    private function getMockOvertimeRecords(): array
    {
        $records = [];
        $statuses = ['planned', 'in_progress', 'completed', 'cancelled'];
        $reasons = [
            'Production rush order - urgent shipment',
            'Equipment maintenance during off-hours',
            'Project deadline approaching',
            'Staff shortage coverage',
            'Inventory reconciliation',
            'Emergency repair work',
            'Month-end processing',
        ];
        $departments = [
            ['id' => 3, 'name' => 'Rolling Mill 3'],
            ['id' => 4, 'name' => 'Wire Mill'],
            ['id' => 5, 'name' => 'Quality Control'],
            ['id' => 6, 'name' => 'Maintenance'],
        ];

        for ($i = 1; $i <= 20; $i++) {
            $status = $statuses[array_rand($statuses)];
            $dept = $departments[array_rand($departments)];
            $plannedHours = [2, 3, 4, 5][array_rand([2, 3, 4, 5])];
            $actualHours = $status === 'completed' ? $plannedHours + rand(-1, 1) * 0.5 : null;
            
            $records[] = [
                'id' => $i,
                'employee_id' => ($i % 15) + 1,
                'employee_name' => 'Employee ' . (($i % 15) + 1),
                'employee_number' => 'EMP' . str_pad(($i % 15) + 1, 3, '0', STR_PAD_LEFT),
                'overtime_date' => now()->addDays(rand(-7, 14))->format('Y-m-d'),
                'start_time' => '17:00:00',
                'end_time' => (17 + $plannedHours) . ':00:00',
                'planned_hours' => $plannedHours,
                'actual_hours' => $actualHours,
                'reason' => $reasons[array_rand($reasons)],
                'status' => $status,
                'budget_code' => 'OT-' . $dept['id'] . '-' . date('Y'),
                'department_id' => $dept['id'],
                'department_name' => $dept['name'],
                'created_by' => 'HR Manager',
                'created_by_name' => 'Admin User',
                'created_at' => now()->subDays(rand(1, 10))->format('Y-m-d H:i:s'),
                'updated_at' => now()->subDays(rand(0, 5))->format('Y-m-d H:i:s'),
                'notes' => $status === 'cancelled' ? 'Project completed ahead of schedule' : null,
            ];
        }

        return $records;
    }

    /**
     * Get mock status history for overtime record.
     */
    private function getMockStatusHistory(int $recordId): array
    {
        return [
            [
                'id' => 1,
                'overtime_record_id' => $recordId,
                'status' => 'planned',
                'changed_by' => 'HR Manager',
                'changed_by_name' => 'Admin User',
                'changed_at' => now()->subDays(5)->format('Y-m-d H:i:s'),
                'notes' => 'Overtime scheduled for production rush',
            ],
            [
                'id' => 2,
                'overtime_record_id' => $recordId,
                'status' => 'in_progress',
                'changed_by' => 'HR Manager',
                'changed_by_name' => 'Admin User',
                'changed_at' => now()->subDays(2)->format('Y-m-d H:i:s'),
                'notes' => 'Employee started overtime shift',
            ],
        ];
    }

    /**
     * Get mock employees list.
     */
    private function getMockEmployees(): array
    {
        $employees = [];
        for ($i = 1; $i <= 15; $i++) {
            $employees[] = [
                'id' => $i,
                'name' => 'Employee ' . $i,
                'employee_number' => 'EMP' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'department_id' => ($i % 4) + 3,
                'department_name' => ['Rolling Mill 3', 'Wire Mill', 'Quality Control', 'Maintenance'][$i % 4],
                'position' => 'Production Worker',
            ];
        }
        return $employees;
    }

    /**
     * Get mock departments.
     */
    private function getMockDepartments(): array
    {
        return [
            ['id' => 3, 'name' => 'Rolling Mill 3'],
            ['id' => 4, 'name' => 'Wire Mill'],
            ['id' => 5, 'name' => 'Quality Control'],
            ['id' => 6, 'name' => 'Maintenance'],
        ];
    }
}
