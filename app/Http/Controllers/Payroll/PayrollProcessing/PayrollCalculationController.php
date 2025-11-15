<?php

namespace App\Http\Controllers\Payroll\PayrollProcessing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PayrollCalculationController extends Controller
{
    /**
     * Display a listing of payroll calculations.
     */
    public function index(Request $request): Response
    {
        // Get filter parameters
        $periodId = $request->input('period_id');
        $status = $request->input('status');
        $calculationType = $request->input('calculation_type');

        // Get mock calculations
        $calculations = $this->getMockCalculations();

        // Apply filters
        if ($periodId) {
            $calculations = array_filter($calculations, function ($calc) use ($periodId) {
                return $calc['payroll_period_id'] == $periodId;
            });
        }

        if ($status) {
            $calculations = array_filter($calculations, function ($calc) use ($status) {
                return $calc['status'] === $status;
            });
        }

        if ($calculationType) {
            $calculations = array_filter($calculations, function ($calc) use ($calculationType) {
                return $calc['calculation_type'] === $calculationType;
            });
        }

        // Re-index array after filtering
        $calculations = array_values($calculations);

        // Get available periods for filter dropdown
        $availablePeriods = $this->getMockPeriods();

        return Inertia::render('Payroll/PayrollProcessing/Calculations/Index', [
            'calculations' => $calculations,
            'available_periods' => $availablePeriods,
            'filters' => [
                'period_id' => $periodId ? (int) $periodId : null,
                'status' => $status,
                'calculation_type' => $calculationType,
            ],
        ]);
    }

    /**
     * Start a new payroll calculation.
     */
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validate([
            'payroll_period_id' => 'required|integer',
            'calculation_type' => 'required|in:regular,adjustment,final,re-calculation',
        ]);

        // In real implementation, this would:
        // 1. Create a calculation record
        // 2. Queue calculation job
        // 3. Process employees in background
        // For now, just redirect back with success message

        return redirect()
            ->route('payroll.calculations.index')
            ->with('success', 'Payroll calculation started successfully.');
    }

    /**
     * Display a specific calculation's details.
     */
    public function show(int $id): Response
    {
        $calculations = $this->getMockCalculations();
        $calculation = collect($calculations)->firstWhere('id', $id);

        if (!$calculation) {
            abort(404, 'Calculation not found');
        }

        // Get employee-level calculation details
        $employeeCalculations = $this->getMockEmployeeCalculations($id);

        return Inertia::render('Payroll/PayrollProcessing/Calculations/Show', [
            'calculation' => $calculation,
            'employee_calculations' => $employeeCalculations,
        ]);
    }

    /**
     * Recalculate a failed or completed payroll.
     */
    public function recalculate(int $id): \Illuminate\Http\RedirectResponse
    {
        // In real implementation, this would:
        // 1. Mark existing calculation as superseded
        // 2. Create new calculation
        // 3. Queue recalculation job

        return redirect()
            ->route('payroll.calculations.index')
            ->with('success', 'Payroll recalculation started successfully.');
    }

    /**
     * Approve a completed calculation.
     */
    public function approve(int $id): \Illuminate\Http\RedirectResponse
    {
        // In real implementation, this would:
        // 1. Validate calculation is completed
        // 2. Lock payroll period
        // 3. Generate payment records
        // 4. Update calculation status

        return redirect()
            ->route('payroll.calculations.index')
            ->with('success', 'Payroll calculation approved successfully.');
    }

    /**
     * Cancel a pending or processing calculation.
     */
    public function destroy(int $id): \Illuminate\Http\RedirectResponse
    {
        // In real implementation, this would:
        // 1. Stop any running calculation jobs
        // 2. Mark calculation as cancelled
        // 3. Clean up partial data

        return redirect()
            ->route('payroll.calculations.index')
            ->with('success', 'Payroll calculation cancelled successfully.');
    }

    // ========================================================================
    // Mock Data Helpers
    // ========================================================================

    /**
     * Get mock payroll calculations with Philippine payroll data.
     */
    private function getMockCalculations(): array
    {
        $periods = $this->getMockPeriods();

        return [
            [
                'id' => 1,
                'payroll_period_id' => 1,
                'payroll_period' => $periods[0],
                'calculation_type' => 'regular',
                'status' => 'completed',
                'calculation_date' => '2025-11-15 14:30:00',
                'progress_percentage' => 100,
                'total_employees' => 156,
                'processed_employees' => 156,
                'failed_employees' => 0,
                'total_gross_pay' => 3245678.50,
                'total_deductions' => 687432.25,
                'total_net_pay' => 2558246.25,
                'error_message' => null,
            ],
            [
                'id' => 2,
                'payroll_period_id' => 2,
                'payroll_period' => $periods[1],
                'calculation_type' => 'regular',
                'status' => 'processing',
                'calculation_date' => '2025-11-30 09:15:00',
                'progress_percentage' => 68,
                'total_employees' => 156,
                'processed_employees' => 106,
                'failed_employees' => 0,
                'total_gross_pay' => 2208461.20,
                'total_deductions' => 467374.85,
                'total_net_pay' => 1741086.35,
                'error_message' => null,
            ],
            [
                'id' => 3,
                'payroll_period_id' => 2,
                'payroll_period' => $periods[1],
                'calculation_type' => 'adjustment',
                'status' => 'failed',
                'calculation_date' => '2025-11-29 16:45:00',
                'progress_percentage' => 42,
                'total_employees' => 156,
                'processed_employees' => 65,
                'failed_employees' => 8,
                'total_gross_pay' => 1352789.00,
                'total_deductions' => 286337.19,
                'total_net_pay' => 1066451.81,
                'error_message' => 'SSS contribution table lookup failed for 8 employees. Please verify SSS rate configuration.',
            ],
            [
                'id' => 4,
                'payroll_period_id' => 3,
                'payroll_period' => $periods[2],
                'calculation_type' => 'regular',
                'status' => 'pending',
                'calculation_date' => '2025-12-02 08:00:00',
                'progress_percentage' => 0,
                'total_employees' => 156,
                'processed_employees' => 0,
                'failed_employees' => 0,
                'total_gross_pay' => 0,
                'total_deductions' => 0,
                'total_net_pay' => 0,
                'error_message' => null,
            ],
            [
                'id' => 5,
                'payroll_period_id' => 1,
                'payroll_period' => $periods[0],
                'calculation_type' => 're-calculation',
                'status' => 'completed',
                'calculation_date' => '2025-11-16 10:20:00',
                'progress_percentage' => 100,
                'total_employees' => 12,
                'processed_employees' => 12,
                'failed_employees' => 0,
                'total_gross_pay' => 287450.00,
                'total_deductions' => 60964.50,
                'total_net_pay' => 226485.50,
                'error_message' => null,
            ],
        ];
    }

    /**
     * Get mock payroll periods for filter dropdown.
     */
    private function getMockPeriods(): array
    {
        return [
            [
                'id' => 1,
                'name' => 'November 1-15, 2025',
                'start_date' => '2025-11-01',
                'end_date' => '2025-11-15',
                'status' => 'completed',
            ],
            [
                'id' => 2,
                'name' => 'November 16-30, 2025',
                'start_date' => '2025-11-16',
                'end_date' => '2025-11-30',
                'status' => 'processing',
            ],
            [
                'id' => 3,
                'name' => 'December 1-15, 2025',
                'start_date' => '2025-12-01',
                'end_date' => '2025-12-15',
                'status' => 'draft',
            ],
            [
                'id' => 4,
                'name' => 'December 16-31, 2025',
                'start_date' => '2025-12-16',
                'end_date' => '2025-12-31',
                'status' => 'draft',
            ],
        ];
    }

    /**
     * Get mock employee-level calculation details.
     */
    private function getMockEmployeeCalculations(int $calculationId): array
    {
        // Sample employee calculations for detail view
        return [
            [
                'id' => 1,
                'calculation_id' => $calculationId,
                'employee_id' => 1001,
                'employee_name' => 'Juan Dela Cruz',
                'employee_code' => 'EMP-001',
                'department' => 'Engineering',
                'position' => 'Senior Software Engineer',
                'basic_salary' => 45000.00,
                'overtime_pay' => 3500.00,
                'allowances' => 2000.00,
                'gross_pay' => 50500.00,
                'sss_contribution' => 1350.00,
                'philhealth_contribution' => 1400.00,
                'pagibig_contribution' => 200.00,
                'withholding_tax' => 4256.25,
                'total_deductions' => 7206.25,
                'net_pay' => 43293.75,
                'status' => 'completed',
            ],
            [
                'id' => 2,
                'calculation_id' => $calculationId,
                'employee_id' => 1002,
                'employee_name' => 'Maria Santos',
                'employee_code' => 'EMP-002',
                'department' => 'Human Resources',
                'position' => 'HR Manager',
                'basic_salary' => 38000.00,
                'overtime_pay' => 0,
                'allowances' => 1500.00,
                'gross_pay' => 39500.00,
                'sss_contribution' => 1350.00,
                'philhealth_contribution' => 1100.00,
                'pagibig_contribution' => 200.00,
                'withholding_tax' => 2856.50,
                'total_deductions' => 5506.50,
                'net_pay' => 33993.50,
                'status' => 'completed',
            ],
            [
                'id' => 3,
                'calculation_id' => $calculationId,
                'employee_id' => 1003,
                'employee_name' => 'Pedro Reyes',
                'employee_code' => 'EMP-003',
                'department' => 'Operations',
                'position' => 'Operations Supervisor',
                'basic_salary' => 32000.00,
                'overtime_pay' => 2400.00,
                'allowances' => 1200.00,
                'gross_pay' => 35600.00,
                'sss_contribution' => 1350.00,
                'philhealth_contribution' => 990.00,
                'pagibig_contribution' => 200.00,
                'withholding_tax' => 2145.00,
                'total_deductions' => 4685.00,
                'net_pay' => 30915.00,
                'status' => 'completed',
            ],
        ];
    }
}
