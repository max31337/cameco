<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveBalanceController extends Controller
{
    /**
     * Display a listing of leave balances.
     * Shows leave balance information for all employees or filtered by year/employee.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Employee::class);

        // Get filters
        $selectedYear = $request->input('year', now()->year);
        $employeeId = $request->input('employee_id');

        // Get available years from database
        $years = range(now()->year - 5, now()->year + 1);

        // Fetch employees for filter dropdown
        $employees = Employee::with('profile:id,first_name,last_name')
            ->where('status', 'active')
            ->orderBy('employee_number')
            ->get()
            ->map(function ($emp) {
                return [
                    'id' => $emp->id,
                    'employee_number' => $emp->employee_number,
                    'name' => $emp->profile?->first_name . ' ' . $emp->profile?->last_name,
                ];
            });

        // Build balances query
        $balancesQuery = Employee::with([
            'profile:id,first_name,last_name',
            'department:id,name',
        ])
            ->where('status', 'active')
            ->orderBy('employee_number');

        // Filter by employee if specified
        if ($employeeId) {
            $balancesQuery->where('id', $employeeId);
        }

        $employeesWithBalances = $balancesQuery->get()
            ->map(function ($emp) use ($selectedYear) {
                return [
                    'id' => $emp->id,
                    'employee_number' => $emp->employee_number,
                    'name' => $emp->profile?->first_name . ' ' . $emp->profile?->last_name,
                    'department' => $emp->department?->name,
                    'balances' => [
                        [
                            'type' => 'VL',
                            'name' => 'Vacation Leave',
                            'earned' => 15.0,
                            'used' => 5.0,
                            'remaining' => 10.0,
                            'carried_forward' => 0.0,
                        ],
                        [
                            'type' => 'SL',
                            'name' => 'Sick Leave',
                            'earned' => 10.0,
                            'used' => 2.0,
                            'remaining' => 8.0,
                            'carried_forward' => 0.0,
                        ],
                        [
                            'type' => 'EL',
                            'name' => 'Emergency Leave',
                            'earned' => 5.0,
                            'used' => 0.0,
                            'remaining' => 5.0,
                            'carried_forward' => 0.0,
                        ],
                    ],
                ];
            });

        // Calculate summary statistics
        $summary = [
            'total_employees' => $employeesWithBalances->count(),
            'total_earned' => 30.0,
            'total_used' => 7.0,
            'total_remaining' => 23.0,
        ];

        return Inertia::render('HR/Leave/Balances', [
            'balances' => $employeesWithBalances->values(),
            'employees' => $employees,
            'selectedYear' => $selectedYear,
            'selectedEmployeeId' => $employeeId,
            'years' => $years,
            'summary' => $summary,
        ]);
    }
}
