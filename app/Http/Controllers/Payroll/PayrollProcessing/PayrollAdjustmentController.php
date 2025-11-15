<?php

namespace App\Http\Controllers\Payroll\PayrollProcessing;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PayrollAdjustmentController extends Controller
{
    /**
     * Display a listing of payroll adjustments
     */
    public function index(Request $request): Response
    {
        // Mock data for available periods
        $availablePeriods = [
            [
                'id' => 1,
                'name' => 'November 1-15, 2025 (Semi-Monthly)',
                'period_type' => 'semi-monthly',
                'start_date' => '2025-11-01',
                'end_date' => '2025-11-15',
                'payment_date' => '2025-11-20',
                'status' => 'open',
            ],
            [
                'id' => 2,
                'name' => 'November 16-30, 2025 (Semi-Monthly)',
                'period_type' => 'semi-monthly',
                'start_date' => '2025-11-16',
                'end_date' => '2025-11-30',
                'payment_date' => '2025-12-05',
                'status' => 'draft',
            ],
        ];

        // Mock data for available employees
        $availableEmployees = [
            [
                'id' => 1,
                'name' => 'Juan Dela Cruz',
                'employee_number' => 'EMP-2024-001',
                'department' => 'Mining Operations',
            ],
            [
                'id' => 2,
                'name' => 'Maria Santos',
                'employee_number' => 'EMP-2024-002',
                'department' => 'Engineering',
            ],
            [
                'id' => 3,
                'name' => 'Pedro Rodriguez',
                'employee_number' => 'EMP-2024-003',
                'department' => 'Maintenance',
            ],
            [
                'id' => 4,
                'name' => 'Ana Reyes',
                'employee_number' => 'EMP-2024-004',
                'department' => 'Human Resources',
            ],
            [
                'id' => 5,
                'name' => 'Carlos Garcia',
                'employee_number' => 'EMP-2024-005',
                'department' => 'Finance',
            ],
        ];

        // Mock data for payroll adjustments
        $adjustments = [
            [
                'id' => 1,
                'payroll_period_id' => 1,
                'payroll_period' => $availablePeriods[0],
                'employee_id' => 1,
                'employee_name' => 'Juan Dela Cruz',
                'employee_number' => 'EMP-2024-001',
                'department' => 'Mining Operations',
                'position' => 'Senior Miner',
                'adjustment_type' => 'correction',
                'adjustment_category' => 'Overtime Correction',
                'amount' => 5000.00,
                'reason' => 'Additional 10 hours of overtime not captured in original timesheet for November 5-7, 2025. Approved by Operations Manager.',
                'reference_number' => 'ADJ-2025-001',
                'status' => 'pending',
                'requested_by' => 'HR Admin',
                'requested_at' => '2025-11-10 09:30:00',
                'reviewed_by' => null,
                'reviewed_at' => null,
                'review_notes' => null,
                'applied_at' => null,
            ],
            [
                'id' => 2,
                'payroll_period_id' => 1,
                'payroll_period' => $availablePeriods[0],
                'employee_id' => 2,
                'employee_name' => 'Maria Santos',
                'employee_number' => 'EMP-2024-002',
                'department' => 'Engineering',
                'position' => 'Lead Engineer',
                'adjustment_type' => 'refund',
                'adjustment_category' => 'Tax Refund',
                'amount' => 2500.00,
                'reason' => 'Excess withholding tax refund for Q3 2025 as per BIR computation. Tax certificate attached.',
                'reference_number' => 'TAX-REF-2025-045',
                'status' => 'approved',
                'requested_by' => 'Finance Team',
                'requested_at' => '2025-11-08 14:20:00',
                'reviewed_by' => 'Finance Manager',
                'reviewed_at' => '2025-11-09 10:15:00',
                'review_notes' => 'Verified against BIR Form 1604C. Approved for processing.',
                'applied_at' => null,
            ],
            [
                'id' => 3,
                'payroll_period_id' => 1,
                'payroll_period' => $availablePeriods[0],
                'employee_id' => 3,
                'employee_name' => 'Pedro Rodriguez',
                'employee_number' => 'EMP-2024-003',
                'department' => 'Maintenance',
                'position' => 'Maintenance Technician',
                'adjustment_type' => 'earning',
                'adjustment_category' => 'Performance Bonus',
                'amount' => 10000.00,
                'reason' => 'Q4 2025 performance bonus for exceeding safety and efficiency targets. Approved by Department Head.',
                'reference_number' => 'BONUS-2025-Q4-003',
                'status' => 'rejected',
                'requested_by' => 'Department Head',
                'requested_at' => '2025-11-07 11:45:00',
                'reviewed_by' => 'Payroll Manager',
                'reviewed_at' => '2025-11-08 08:30:00',
                'review_notes' => 'Bonus payout scheduled for December period per company policy. Please resubmit for Dec 1-15 period.',
                'applied_at' => null,
            ],
            [
                'id' => 4,
                'payroll_period_id' => 1,
                'payroll_period' => $availablePeriods[0],
                'employee_id' => 4,
                'employee_name' => 'Ana Reyes',
                'employee_number' => 'EMP-2024-004',
                'department' => 'Human Resources',
                'position' => 'HR Specialist',
                'adjustment_type' => 'deduction',
                'adjustment_category' => 'Loan Deduction Correction',
                'amount' => 3000.00,
                'reason' => 'Missed loan installment deduction from October payroll. Catching up on scheduled payment.',
                'reference_number' => 'LOAN-COR-2025-018',
                'status' => 'applied',
                'requested_by' => 'Payroll Team',
                'requested_at' => '2025-11-05 13:00:00',
                'reviewed_by' => 'Payroll Manager',
                'reviewed_at' => '2025-11-06 09:00:00',
                'review_notes' => 'Verified loan schedule. Approved for immediate deduction.',
                'applied_at' => '2025-11-10 16:30:00',
            ],
            [
                'id' => 5,
                'payroll_period_id' => 1,
                'payroll_period' => $availablePeriods[0],
                'employee_id' => 5,
                'employee_name' => 'Carlos Garcia',
                'employee_number' => 'EMP-2024-005',
                'department' => 'Finance',
                'position' => 'Financial Analyst',
                'adjustment_type' => 'backpay',
                'adjustment_category' => 'Salary Increase Retroactive',
                'amount' => 15000.00,
                'reason' => 'Retroactive salary increase effective October 1, 2025. Covering October 1-31 differential (₱7,500/mo × 2 months).',
                'reference_number' => 'SAL-ADJ-2025-012',
                'status' => 'pending',
                'requested_by' => 'HR Manager',
                'requested_at' => '2025-11-09 10:00:00',
                'reviewed_by' => null,
                'reviewed_at' => null,
                'review_notes' => null,
                'applied_at' => null,
            ],
        ];

        // Apply filters
        $periodId = $request->input('period_id');
        $employeeId = $request->input('employee_id');
        $status = $request->input('status');
        $adjustmentType = $request->input('adjustment_type');

        $filteredAdjustments = collect($adjustments);

        if ($periodId) {
            $filteredAdjustments = $filteredAdjustments->filter(function ($adjustment) use ($periodId) {
                return $adjustment['payroll_period_id'] == $periodId;
            });
        }

        if ($employeeId) {
            $filteredAdjustments = $filteredAdjustments->filter(function ($adjustment) use ($employeeId) {
                return $adjustment['employee_id'] == $employeeId;
            });
        }

        if ($status) {
            $filteredAdjustments = $filteredAdjustments->filter(function ($adjustment) use ($status) {
                return $adjustment['status'] === $status;
            });
        }

        if ($adjustmentType) {
            $filteredAdjustments = $filteredAdjustments->filter(function ($adjustment) use ($adjustmentType) {
                return $adjustment['adjustment_type'] === $adjustmentType;
            });
        }

        return Inertia::render('Payroll/PayrollProcessing/Adjustments/Index', [
            'adjustments' => $filteredAdjustments->values()->all(),
            'available_periods' => $availablePeriods,
            'available_employees' => $availableEmployees,
            'filters' => [
                'period_id' => $periodId ? (int)$periodId : null,
                'employee_id' => $employeeId ? (int)$employeeId : null,
                'status' => $status,
                'adjustment_type' => $adjustmentType,
            ],
        ]);
    }

    /**
     * Store a newly created adjustment
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'payroll_period_id' => 'required|integer',
            'employee_id' => 'required|integer',
            'adjustment_type' => 'required|in:earning,deduction,correction,backpay,refund',
            'adjustment_category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'reason' => 'required|string',
            'reference_number' => 'nullable|string|max:255',
        ]);

        // In a real app, save to database
        // For now, just simulate success

        return redirect()->back()->with('success', 'Payroll adjustment created successfully');
    }

    /**
     * Display the specified adjustment
     */
    public function show(int $id): Response
    {
        // Mock data - in real app, fetch from database
        $adjustment = [
            'id' => $id,
            'payroll_period_id' => 1,
            'employee_id' => 1,
            'employee_name' => 'Juan Dela Cruz',
            'adjustment_type' => 'correction',
            'adjustment_category' => 'Overtime Correction',
            'amount' => 5000.00,
            'reason' => 'Additional overtime not captured in original timesheet',
            'status' => 'pending',
        ];

        return Inertia::render('Payroll/PayrollProcessing/Adjustments/Show', [
            'adjustment' => $adjustment,
        ]);
    }

    /**
     * Update the specified adjustment
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'payroll_period_id' => 'required|integer',
            'employee_id' => 'required|integer',
            'adjustment_type' => 'required|in:earning,deduction,correction,backpay,refund',
            'adjustment_category' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'reason' => 'required|string',
            'reference_number' => 'nullable|string|max:255',
        ]);

        // In a real app, update database
        // For now, just simulate success

        return redirect()->back()->with('success', 'Payroll adjustment updated successfully');
    }

    /**
     * Remove the specified adjustment
     */
    public function destroy(int $id): RedirectResponse
    {
        // In a real app, delete from database
        // For now, just simulate success

        return redirect()->back()->with('success', 'Payroll adjustment deleted successfully');
    }

    /**
     * Approve the specified adjustment
     */
    public function approve(int $id): RedirectResponse
    {
        // In a real app, update status to 'approved' in database
        // For now, just simulate success

        return redirect()->back()->with('success', 'Payroll adjustment approved successfully');
    }

    /**
     * Reject the specified adjustment
     */
    public function reject(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'rejection_notes' => 'required|string',
        ]);

        // In a real app, update status to 'rejected' and save notes in database
        // For now, just simulate success

        return redirect()->back()->with('success', 'Payroll adjustment rejected');
    }
}
