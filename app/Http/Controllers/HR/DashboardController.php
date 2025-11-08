<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Services\HR\EmployeeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected EmployeeService $employeeService;

    public function __construct(EmployeeService $employeeService)
    {
        $this->employeeService = $employeeService;
    }

    /**
     * Display the HR Manager Dashboard.
     * 
     * Shows key HR metrics, recent activity, and quick access to HR functions.
     * Requires HR Manager or Superadmin role (enforced by middleware).
     */
    public function index(Request $request)
    {
        // Get real metrics from EmployeeService
        $metrics = $this->employeeService->getDashboardMetrics();

        return Inertia::render('HR/Dashboard', [
            'metrics' => $metrics,
        ]);
    }
}
